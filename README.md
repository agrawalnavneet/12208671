# URL Shortener Project

This repository contains a full-stack URL Shortener application with separate frontend and backend implementations, along with a reusable logging middleware.

## Project Structure

```
12208671/
  backend-test-submission/   # Express.js backend (Node.js, MongoDB)
  frontend-test-submission/  # React frontend (Vite, Redux, TailwindCSS)
  logging-middleware/        # Shared logging middleware for both frontend and backend
```

---

## Backend

- **Tech Stack:** Node.js, Express, MongoDB, Mongoose, JWT, Cookie-based Auth
- **Features:**
  - User registration, login, logout, and authentication
  - Create short URLs (with or without authentication)
  - Custom short URL slugs for authenticated users
  - Track URL clicks and user-specific URLs
  - Centralized error handling and logging

**Setup:**
1. `cd backend-test-submission`
2. `npm install`
3. Configure your `.env` file (see `.env.example` if available)
4. `npm run dev` or `npm start`

---

## Frontend

- **Tech Stack:** React, Vite, Redux Toolkit, React Query, TailwindCSS
- **Features:**
  - User registration and login
  - Create and manage short URLs
  - Copy short URLs to clipboard
  - View user-specific URL statistics
  - Error handling and logging

**Setup:**
1. `cd frontend-test-submission`
2. `npm install`
3. `npm run dev` (runs on [http://localhost:5173](http://localhost:5173))

---

## Logging Middleware

- Located in [`logging-middleware/`](logging-middleware/)
- Used by both frontend and backend for consistent logging
- Sends logs to a remote evaluation service as required

---

## How to Run

1. **Start the backend:**
   ```sh
   cd backend-test-submission
   npm install
   npm run dev
   ```
2. **Start the frontend:**
   ```sh
   cd frontend-test-submission
   npm install
   npm run dev
   ```
3. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Notes

- All logging is handled via the reusable logging middleware. Do **not** use `console.log` or built-in loggers elsewhere.
- Make sure MongoDB is running and the connection string is set in your backend `.env`.
- For more details, see the individual README files in each subdirectory.

---
