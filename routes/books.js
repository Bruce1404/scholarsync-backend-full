const express = require("express");
const router = express.Router();
const { pool } = require("../database");

// Get all books
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY title");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

// Add new book
router.post("/", async (req, res) => {
  try {
    const { title, author, isbn, category } = req.body;
    const newBook = await pool.query(
      "INSERT INTO books (title, author, isbn, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, isbn, category]
    );
    res.json({ message: "Book added", book: newBook.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

// Update book
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, available } = req.body;
    
    await pool.query(
      "UPDATE books SET title=$1, author=$2, isbn=$3, category=$4, available=$5 WHERE id=$6",
      [title, author, isbn, category, available, id]
    );
    
    res.json({ message: "Book updated" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;