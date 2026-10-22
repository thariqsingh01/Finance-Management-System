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

module.exports = app;
