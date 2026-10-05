const express = require('express');

const app = express();

app.use(express.json());

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