import express from "express";
import {
  getConversationHistory,
  searchMessages,
} from "../controllers/conversationController.js";
import Message from "../models/Message.js";
import Scenario from "../models/Scenario.js";

const createRouter = () => {
  const router = express.Router();

  router.post("/conversations", async (req, res) => {
    try {
      const { page, scenarioName } = req.body;
      console.log("Received request to fetch conversations");
      const result = await getConversationHistory(scenarioName, page);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return res
        .status(500)
        .json({ error: error.message || "Failed to fetch conversations" });
    }
  });

  router.get("/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Received request to fetch message and next messages");

      // First, find the specified message with its scenario populated
      const targetMessage = await Message.findById(id).populate("scenario");
      if (!targetMessage) {
        return res.status(404).json({ error: "Message not found" });
      }

      // Find the next 9 messages after this message's timestamp within the same scenario
      const nextMessages = await Message.find({
        timestamp: { $gt: targetMessage.timestamp },
        scenario: targetMessage.scenario._id,
      })
        .sort({ timestamp: 1 })
        .limit(9)
        .populate("scenario");

      // Find the ID of the message that would be 10 messages after the target within the same scenario
      const nextPageMessage = await Message.findOne({
        timestamp: { $gt: targetMessage.timestamp },
        scenario: targetMessage.scenario._id,
      })
        .sort({ timestamp: 1 })
        .skip(9)
        .limit(1);

      // Find the ID of the message that would be 10 messages before the target within the same scenario
      const prevPageMessage = await Message.findOne({
        timestamp: { $lt: targetMessage.timestamp },
        scenario: targetMessage.scenario._id,
      })
        .sort({ timestamp: -1 })
        .skip(9)
        .limit(1);

      // Combine the target message and next messages
      const allMessages = [targetMessage, ...nextMessages];

      console.log(`Found ${allMessages.length} messages`);
      return res.status(200).json({
        messages: allMessages,
        prevPageMsgId: prevPageMessage?._id || null,
        nextPageMsgId: nextPageMessage?._id || null,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({
        error: error.message || "Failed to fetch messages",
      });
    }
  });

  // router.post("/next-messages", async (req, res) => {
  //   try {
  //     const { date, messageId } = req.body;
  //     const targetDate = new Date(date);
  //     const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

  //     console.log("Received request to fetch next messages");
  //     const messages = await Message.find({
  //       timestamp: {
  //         $gte: new Date(targetDate.getTime()),
  //         $lte: new Date(targetDate.getTime() + tenMinutesInMs),
  //       },
  //     }).sort({ timestamp: 1 }); // Sort by timestamp ascending

  //     console.log("🚀 ~ router.post ~ messages:", messages);
  //     return res.status(201).json(messages);
  //   } catch (error) {
  //     console.error("Error fetching surrounding messages:", error);
  //     return res.status(500).json({
  //       error: error.message || "Failed to fetch surrounding messages",
  //     });
  //   }
  // });

  // router.post("/prev-messages", async (req, res) => {
  //   try {
  //     const { date, messageId } = req.body;
  //     const targetDate = new Date(date);
  //     const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes in milliseconds

  //     console.log("Received request to fetch previous messages");
  //     const messages = await Message.find({
  //       timestamp: {
  //         $gte: new Date(targetDate.getTime() - tenMinutesInMs),
  //         $lte: new Date(targetDate.getTime()),
  //       },
  //     }).sort({ timestamp: 1 }); // Sort by timestamp ascending

  //     console.log("🚀 ~ router.post ~ messages:", messages);
  //     return res.status(201).json(messages);
  //   } catch (error) {
  //     console.error("Error fetching surrounding messages:", error);
  //     return res.status(500).json({
  //       error: error.message || "Failed to fetch surrounding messages",
  //     });
  //   }
  // });

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
