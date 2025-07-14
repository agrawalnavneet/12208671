
---
![URL Shortener Screenshot](https://ik.imagekit.io/7iyebtvue/Screenshot%202025-07-14%20at%201.15.37%E2%80%AFPM.png?updatedAt=1752479779738)
![URL Shortener Screenshot](https://ik.imagekit.io/7iyebtvue/Screenshot%202025-07-14%20at%201.15.47%E2%80%AFPM.png?updatedAt=1752480271429)
![URL Shortener Screenshot](https://ik.imagekit.io/7iyebtvue/Screenshot%202025-07-14%20at%201.16.03%E2%80%AFPM.png?updatedAt=1752480271725)
![URL Shortener Screenshot](https://ik.imagekit.io/7iyebtvue/Screenshot%202025-07-14%20at%201.16.12%E2%80%AFPM.png?updatedAt=1752480271538)

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
