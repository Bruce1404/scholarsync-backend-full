const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase, pool } = require("./database");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const borrowRoutes = require("./routes/borrow");

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(cors());

// Initialize database on startup
// Initialize database on startup
initializeDatabase().then(() => {
  console.log("Database setup completed");
}).catch(err => {
  console.log("Database setup had issues, but server continues:", err.message);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// Basic route to test
app.get("/", (req, res) => {
  res.send("Library System Backend is running");
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ 
      message: "Database connected successfully",
      time: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

