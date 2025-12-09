const express = require("express");
const router = express.Router();
const { pool } = require("../database");

// Borrow book - simple version
router.post("/borrow", async (req, res) => {
  try {
    const { book_id, user_id } = req.body;
    
    // Check if available
    const bookCheck = await pool.query(
      "SELECT * FROM books WHERE id = $1 AND available = true",
      [book_id]
    );
    
    if (bookCheck.rows.length === 0) {
      return res.status(400).json({ message: "Book not available" });
    }
    
    // Borrow it
    await pool.query(
      "INSERT INTO borrow_records (book_id, user_id) VALUES ($1, $2)",
      [book_id, user_id]
    );
    
    await pool.query(
      "UPDATE books SET available = false WHERE id = $1",
      [book_id]
    );
    
    res.json({ message: "Book borrowed" });
  } catch (error) {
    res.status(500).json({ message: "Error borrowing book" });
  }
});

// Return book - simple version
router.post("/return", async (req, res) => {
  try {
    const { record_id } = req.body;
    
    // Get book id from record
    const record = await pool.query(
      "SELECT book_id FROM borrow_records WHERE id = $1",
      [record_id]
    );
    
    if (record.rows.length > 0) {
      const bookId = record.rows[0].book_id;
      
      // Update book as available
      await pool.query(
        "UPDATE books SET available = true WHERE id = $1",
        [bookId]
      );
      
      // Remove borrow record
      await pool.query(
        "DELETE FROM borrow_records WHERE id = $1",
        [record_id]
      );
      
      res.json({ message: "Book returned" });
    } else {
      res.status(400).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error returning book" });
  }
});

// Get borrowed books - simple version
router.get("/user/:user_id", async (req, res) => {
  try {
    const borrowed = await pool.query(
      `SELECT b.* FROM books b 
       JOIN borrow_records br ON b.id = br.book_id 
       WHERE br.user_id = $1`,
      [req.params.user_id]
    );
    res.json(borrowed.rows);
  } catch (error) {
    res.status(500).json({ message: "Error loading borrowed books" });
  }
});

module.exports = router;