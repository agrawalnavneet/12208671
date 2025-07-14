# Backend Test Submission

This folder contains the backend microservice for the URL Shortener project.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy the logging middleware from `../logging-middleware/logger.js` into your backend codebase or require it directly.
3. Set up your environment variables as needed (e.g., MongoDB connection string).

## Run

```sh
node app.js
```

## Notes
- All logging is handled via the reusable logging middleware.
- Do not use `console.log` or built-in loggers.
- See the main project README for more details.
