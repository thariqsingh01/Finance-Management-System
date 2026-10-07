const express = require('express');
const db = require('./config/db');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

app.post('/api/auth/register', async (req, res) => {

    const { name, email, password, address } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO users (name, email, address, password)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [name, email, address, hashedPassword],
            (err, result) => {

                if (err) {
                    console.error('Registration failed:', err);
                    return res.status(500).json({
                        message: 'Registration failed'
                    });
                }

                res.status(201).json({
                    message: 'User registered successfully',
                    userId: result.insertId
                });
            }
        );

    } catch (error) {

        console.error('Password hashing failed:', error);

        res.status(500).json({
            message: 'Registration failed'
        });
    }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:');
  console.log('Email:', email);
  console.log('Password:', password);

  res.json({
    message: 'Login request received',
    email: email
  });
});

module.exports = app;