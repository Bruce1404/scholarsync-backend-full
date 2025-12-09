const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Books table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(50) UNIQUE NOT NULL,
        category VARCHAR(100),
        available BOOLEAN DEFAULT TRUE,
        added_by INTEGER REFERENCES users(id),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Borrow records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borrow_records (
        id SERIAL PRIMARY KEY,
        book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP,
        returned_date TIMESTAMP,
        status VARCHAR(50) DEFAULT 'borrowed'
      )
    `);

    console.log("Database tables created/verified successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

module.exports = { pool, initializeDatabase };