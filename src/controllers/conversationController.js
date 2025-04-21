import Message from "../models/Message.js";
import Scenario from "../models/Scenario.js";
export async function getConversationHistory(scenarioName, page, limit = 50) {
  try {
    const scenario = await Scenario.findOne({
      scenarioId: scenarioName,
    });
    const messages = await Message.find({
      scenario: scenario._id,
    })
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return { messages, scenario };
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    throw error;
  }
}

export async function searchMessages(query, page = 1, limit = 50) {
  try {
    const messages = await Message.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit);
    return messages;
  } catch (error) {
    console.error("Error searching messages:", error);
    throw error;
  }
}
