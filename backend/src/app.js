const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
            INSERT INTO users (name, email, address, password)
            VALUES (?, ?, ?, ?)
        `;

    db.query(sql, [name, email, address, hashedPassword], (err, result) => {
      if (err) {
        console.error("Registration failed:", err);
        return res.status(500).json({
          message: "Registration failed",
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
      });
    });
  } catch (error) {
    console.error("Password hashing failed:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
        SELECT id, name, email, address, password
        FROM users
        WHERE email = ?
    `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Login failed:", err);

      return res.status(500).json({
        message: "Login failed",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });
  });
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, name, email, address
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error("Failed to retrieve user:", err);

      return res.status(500).json({
        message: "Failed to retrieve user details",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: results[0],
    });
  });
});

app.get("/api/accounts", authenticateToken, (req, res) => {
  const sql = `
    SELECT
      accounts.id,
      accounts.name,
      accounts.balance,
      account_types.type AS accountType
    FROM accounts
    INNER JOIN account_types
      ON accounts.account_type_id = account_types.id
    WHERE accounts.user_id = ?
    ORDER BY accounts.name ASC
  `;

  db.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error("Failed to retrieve accounts:", err);

      return res.status(500).json({
        message: "Failed to retrieve accounts",
      });
    }

    res.json({
      accounts: results,
    });
  });
});

app.post("/api/accounts", authenticateToken, (req, res) => {
  const { name, accountTypeId, balance } = req.body;

  // Validate the account name.
  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 100
  ) {
    return res.status(400).json({
      message: "Account name must be between 1 and 100 characters",
    });
  }

  // Validate the account type ID.
  if (!Number.isInteger(accountTypeId) || accountTypeId <= 0) {
    return res.status(400).json({
      message: "A valid account type is required",
    });
  }

  // Validate the starting balance.
  const parsedBalance = typeof balance === "number" ? balance : Number(balance);

  if (
    balance === undefined ||
    balance === null ||
    (typeof balance === "string" && balance.trim() === "") ||
    !Number.isFinite(parsedBalance) ||
    Math.abs(parsedBalance) > 9999999999999.99
  ) {
    return res.status(400).json({
      message: "A valid starting balance is required",
    });
  }

  // Check that the selected account type exists.
  const typeSql = `
    SELECT id
    FROM account_types
    WHERE id = ?
  `;

  db.query(typeSql, [accountTypeId], (typeErr, typeResults) => {
    if (typeErr) {
      console.error("Failed to validate account type:", typeErr);

      return res.status(500).json({
        message: "Failed to create account",
      });
    }

    if (typeResults.length === 0) {
      return res.status(400).json({
        message: "Selected account type does not exist",
      });
    }

    const insertSql = `
      INSERT INTO accounts (user_id, account_type_id, name, balance)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [req.user.userId, accountTypeId, name.trim(), parsedBalance.toFixed(2)],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Failed to create account:", insertErr);

          return res.status(500).json({
            message: "Failed to create account",
          });
        }

        res.status(201).json({
          message: "Account created successfully",
          account: {
            id: result.insertId,
            name: name.trim(),
            accountTypeId,
            balance: parsedBalance.toFixed(2),
          },
        });
      },
    );
  });
});



app.get("/api/account-types", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, type
    FROM account_types
    ORDER BY type ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to retrieve account types:", err);

      return res.status(500).json({
        message: "Failed to retrieve account types",
      });
    }

    res.json({
      accountTypes: results,
    });
  });
});


// Get transaction categories
app.get("/api/categories", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, category
    FROM categories
    ORDER BY category ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to retrieve categories:", err);

      return res.status(500).json({
        message: "Failed to retrieve categories",
      });
    }

    res.json({
      categories: results,
    });
  });
});

// Get transaction statuses
app.get("/api/statuses", authenticateToken, (req, res) => {
  const sql = `
    SELECT id, status
    FROM statuses
    ORDER BY id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Failed to retrieve statuses:", err);

      return res.status(500).json({
        message: "Failed to retrieve statuses",
      });
    }

    res.json({
      statuses: results,
    });
  });
});



app.post("/api/transactions", authenticateToken, (req, res) => {
  const {accountId, categoryId, amount, date, description, notes, statusId, transactionType,} = req.body;

  // Validate the account ID.
  if (!Number.isInteger(accountId) || accountId <= 0) {
    return res.status(400).json({
      message: "A valid account is required",
    });
  }

  // Validate the category and status IDs.
  if (
    !Number.isInteger(categoryId) ||
    categoryId <= 0 ||
    !Number.isInteger(statusId) ||
    statusId <= 0
  ) {
    return res.status(400).json({
      message: "A valid category and status are required",
    });
  }

  // Validate the transaction type.
// 1 = Income, 2 = Expense.
if (![1, 2].includes(transactionType)) {
  return res.status(400).json({
    message: "Transaction type must be 1 (Income) or 2 (Expense)",
  });
}

  // Validate the amount.
  const parsedAmount = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    String(amount).trim() === "" ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0 ||
    parsedAmount > 9999999999999.99
  ) {
    return res.status(400).json({
      message: "Amount must be a positive, valid number",
    });
  }

  // Validate the date.
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2})?)?$/.test(date) ||
    Number.isNaN(Date.parse(date))
  ) {
    return res.status(400).json({
      message: "A valid transaction date is required",
    });
  }

  // Validate optional text fields.
  if (
    (description != null &&
      (typeof description !== "string" || description.length > 255)) ||
    (notes != null && typeof notes !== "string")
  ) {
    return res.status(400).json({
      message: "Description or notes are invalid",
    });
  }

  // Confirm the account belongs to the logged-in user.
  const accountSql = `
    SELECT id
    FROM accounts
    WHERE id = ? AND user_id = ?
  `;

  db.query(
    accountSql,
    [accountId, req.user.userId],
    (accountErr, accountResults) => {
      if (accountErr) {
        console.error("Failed to validate account:", accountErr);
        return res.status(500).json({
          message: "Failed to create transaction",
        });
      }

      if (accountResults.length === 0) {
        return res.status(404).json({
          message: "Account not found",
        });
      }

      // Validate the category and status exist.
      const lookupSql = `
        SELECT
          (SELECT COUNT(*) FROM categories WHERE id = ?) AS categoryCount,
          (SELECT COUNT(*) FROM statuses WHERE id = ?) AS statusCount
      `;

      db.query(
        lookupSql,
        [categoryId, statusId],
        (lookupErr, lookupResults) => {
          if (lookupErr) {
            console.error("Failed to validate transaction fields:", lookupErr);
            return res.status(500).json({
              message: "Failed to create transaction",
            });
          }

          if (
            lookupResults[0].categoryCount === 0 ||
            lookupResults[0].statusCount === 0
          ) {
            return res.status(400).json({
              message: "The selected category or status does not exist",
            });
          }

          // Save the transaction and its account link together.
          db.getConnection((connectionErr, connection) => {
            if (connectionErr) {
              console.error("Failed to get database connection:", connectionErr);
              return res.status(500).json({
                message: "Failed to create transaction",
              });
            }

            connection.beginTransaction((beginErr) => {
              if (beginErr) {
                connection.release();
                console.error("Failed to start transaction:", beginErr);
                return res.status(500).json({
                  message: "Failed to create transaction",
                });
              }

              const rollback = (message, statusCode = 500) => {
                connection.rollback(() => {
                  connection.release();
                  res.status(statusCode).json({ message });
                });
              };

              const insertSql = `
                INSERT INTO transactions
                  (category_id, amount, date, description, notes, status_id)
                VALUES (?, ?, ?, ?, ?, ?)
              `;

              connection.query(
                insertSql,
                [
                  categoryId,
                  parsedAmount.toFixed(2),
                  date.replace("T", " "),
                  description?.trim() || null,
                  notes?.trim() || null,
                  statusId,
                ],
                (insertErr, insertResult) => {
                  if (insertErr) {
                    console.error("Failed to insert transaction:", insertErr);
                    return rollback("Failed to create transaction");
                  }

                  const transactionId = insertResult.insertId;

                  const linkSql = `
                    INSERT INTO account_transactions
                      (account_id, transaction_id, account_role_id, transaction_type)
                    VALUES (?, ?, ?, ?)
                  `;

                  // Role 1 represents the account associated with this transaction.
                  // This is an application-level convention; the database doesn't enforce it.
                  connection.query(
                    linkSql,
                    [accountId, transactionId, 1, transactionType],
                    (linkErr) => {
                      if (linkErr) {
                        console.error("Failed to link transaction to account:", linkErr);
                        return rollback("Failed to create transaction");
                      }

                      if (statusId === 1) {
                        const adjustment =
                          transactionType === 1
                            ? parsedAmount
                            : -parsedAmount;

                        const balanceSql = `
                          UPDATE accounts
                          SET balance = balance + ?
                          WHERE id = ? AND user_id = ?
                        `;

                        connection.query(
                          balanceSql,
                          [
                            adjustment.toFixed(2),
                            accountId,
                            req.user.userId,
                          ],
                          (balanceErr, balanceResult) => {
                            if (balanceErr || balanceResult.affectedRows !== 1) {
                              console.error(
                                "Failed to update account balance:",
                                balanceErr
                              );
                              return rollback("Failed to update account balance");
                            }

                            finish();
                          }
                        );
                      } else {
                        finish();
                      }

                      function finish() {
                        connection.commit((commitErr) => {
                          if (commitErr) {
                            console.error("Failed to save transaction:", commitErr);
                            return rollback("Failed to save transaction");
                          }

                          connection.release();

                          res.status(201).json({
                            message: "Transaction created successfully",
                            transactionId,
                          });
                        });
                      }
                    }
                  );
                }
              );
            });
          });
        }
      );
    }
  );
});


module.exports = app;
