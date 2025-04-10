import express from "express";
import { getConversationHistory } from "../controllers/conversationController.js";
const createRouter = (conversationController) => {
  const router = express.Router();

  router.post("/get", async (req, res) => {
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

  return router;
};

export default createRouter;
