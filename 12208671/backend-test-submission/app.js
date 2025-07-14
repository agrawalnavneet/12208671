import express from "express";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import connectDB from "./src/config/monogo.config.js";
import short_url from "./src/routes/short_url.route.js";
import user_routes from "./src/routes/user.routes.js";
import auth_routes from "./src/routes/auth.routes.js";
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import cors from "cors";
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser";
import log from '../logging-middleware/logger.node.js';

dotenv.config(".env");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // your React app
    credentials: true, // 👈 this allows cookies to be sent
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(attachUser);

app.use("/api/user", user_routes);
app.use("/api/auth", auth_routes);
app.use("/api/create", short_url);
app.get("/:id", redirectFromShortUrl);

app.use(errorHandler);

// Connect to MongoDB first, then start the server
(async () => {
  try {
    await connectDB();
    log('backend', 'info', 'db', `MongoDB Connected: ${process.env.MONGO_URI}`);
    app.listen(PORT, () => {
      log('backend', 'info', 'service', `Server running on port ${PORT}`);
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    log('backend', 'fatal', 'db', `MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
})();


