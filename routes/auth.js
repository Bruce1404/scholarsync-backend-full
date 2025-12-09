const express = require("express");
const router = express.Router();
const { pool } = require("../database");

// Register - simple version
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name",
      [email, password, name]
    );
    res.json({ message: "User registered", user: newUser.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login - simple version
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    
    if (user.rows.length > 0) {
      const userData = user.rows[0];
      delete userData.password;
      res.json({ message: "Login successful", user: userData });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;