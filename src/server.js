import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";

// Import custom modules
import { getConversationHistory } from "./controllers/conversationController.js";
import createRouter from "./routes/conversationRoutes.js";

// Load environment variables
dotenv.config();

// Set up Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up routes
app.use("/api", createRouter(getConversationHistory));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
