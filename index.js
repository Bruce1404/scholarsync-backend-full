const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { initializeDatabase, pool } = require("./database");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const borrowRoutes = require("./routes/borrow");

// PRODUCTION
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use(cors());

// Initialize database on startup
initializeDatabase();

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

// Add a catch-all for debugging
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    requestedUrl: req.url,
    method: req.method 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Available routes:`);
  console.log(`  GET  /`);
  console.log(`  GET  /test-db`);
  console.log(`  POST /api/auth/register`);
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/books`);
  console.log(`  POST /api/books`);
});