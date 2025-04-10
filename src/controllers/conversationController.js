import Message from "../models/Message.js";

export async function getConversationHistory(page, limit = 10) {
  try {
    const messages = await Message.find()
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return messages;
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    throw error;
  }
}
