import dotenv from "dotenv";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";

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
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up routes
app.use("/api", createRouter(getConversationHistory));
// Test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server is running correctly" });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
