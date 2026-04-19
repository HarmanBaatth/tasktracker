const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./db');

const SECRET = "mysecretkey"; // change later

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashed]);
  res.json({ message: "User registered" });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: "User not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});

module.exports = router;
