import mongoose from "mongoose";
import log from '../../../logging-middleware/logger.node.js';

log('backend', 'info', 'db', `Connecting to MongoDB: ${process.env.MONGO_URI}`);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    log('backend', 'info', 'db', `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    log('backend', 'fatal', 'db', `Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
