import express from "express";
import {
  getConversationHistory,
  searchMessages,
} from "../controllers/conversationController.js";
import Message from "../models/Message.js";

const createRouter = (conversationController) => {
  const router = express.Router();

  router.post("/conversations", async (req, res) => {
    try {
      const { page } = req.body;
      console.log("Received request to fetch conversations");
      const conversations = await getConversationHistory(page);
      console.log(`Conversations length: ${conversations.length}`);
      return res.status(201).json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch conversations" });
    }
  });

  router.post("/message/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Received request to fetch messages");
      const message = await Message.findById(id);
      console.log("🚀 ~ router.post ~ message:", message);
      return res.status(201).json(message);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch conversations" });
    }
  });

  router.post("/surrounding-messages", async (req, res) => {
    try {
      const { date, messageId } = req.body;
      const targetDate = new Date(date);
      const fiveMinutesInMs = 5 * 60 * 1000; // 5 minutes in milliseconds

      console.log("Received request to fetch surrounding messages");
      const messages = await Message.find({
        timestamp: {
          $gte: new Date(targetDate.getTime() - fiveMinutesInMs),
          $lte: new Date(targetDate.getTime() + fiveMinutesInMs),
        },
      }).sort({ timestamp: 1 }); // Sort by timestamp ascending

      console.log("🚀 ~ router.post ~ messages:", messages);
      return res.status(201).json(messages);
    } catch (error) {
      console.error("Error fetching surrounding messages:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch surrounding messages",
      });
    }
  });

  router.post("/next-messages", async (req, res) => {
    try {
      const { date, messageId } = req.body;
      const targetDate = new Date(date);
      const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

      console.log("Received request to fetch next messages");
      const messages = await Message.find({
        timestamp: {
          $gte: new Date(targetDate.getTime()),
          $lte: new Date(targetDate.getTime() + tenMinutesInMs),
        },
      }).sort({ timestamp: 1 }); // Sort by timestamp ascending

      console.log("🚀 ~ router.post ~ messages:", messages);
      return res.status(201).json(messages);
    } catch (error) {
      console.error("Error fetching surrounding messages:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch surrounding messages",
      });
    }
  });

  router.post("/prev-messages", async (req, res) => {
    try {
      const { date, messageId } = req.body;
      const targetDate = new Date(date);
      const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

      console.log("Received request to fetch previous messages");
      const messages = await Message.find({
        timestamp: {
          $gte: new Date(targetDate.getTime() - tenMinutesInMs),
          $lte: new Date(targetDate.getTime()),
        },
      }).sort({ timestamp: 1 }); // Sort by timestamp ascending

      console.log("🚀 ~ router.post ~ messages:", messages);
      return res.status(201).json(messages);
    } catch (error) {
      console.error("Error fetching surrounding messages:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch surrounding messages",
      });
    }
  });

  router.post("/conversations/search", async (req, res) => {
    try {
      const { query, page = 1 } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      const messages = await searchMessages(query, page);
      return res.status(200).json(messages);
    } catch (error) {
      console.error("Error searching messages:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to search messages" });
    }
  });

  return router;
};

export default createRouter;
