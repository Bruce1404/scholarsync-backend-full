# ScholarSync Backend API

This is the backend server for the ScholarSync Library System.

## Tech Stack

- Node.js + Express
- PostgreSQL database
- Hosted on Render

## Live API

**Base URL:** https://scholarsync-backend-full-1.onrender.com

## API Endpoints

### Test
- `GET /` - Check if server is running
- `GET /test-db` - Test database connection

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add book (admin only)
- `PUT /api/books/:id` - Update book (admin only)
- `DELETE /api/books/:id` - Delete book (admin only)

### Borrow/Return
- `POST /api/borrow/borrow` - Borrow a book
- `POST /api/borrow/return` - Return a book
- `GET /api/borrow/user/:id` - Get user's borrowed books

## Database Schema

**Users:** id, email, password, name, role (student/admin)
**Books:** id, title, author, isbn, category, available
**Borrow Records:** id, book_id, user_id, borrowed_date, due_date, status

## Environment Variables
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production
```

## Running Locally
```bash
npm install
node index.js
```

Server runs on port 3004

## Frontend Repo

https://github.com/Bruce1404/scholarsync-library-frontend
