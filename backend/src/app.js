const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = app;
