import Message from "../models/Message.js";
import Scenario from "../models/Scenario.js";

export async function getConversationHistory(scenarioName, page, limit = 50) {
  console.log(
    `🔍 Fetching conversation history for scenario: ${scenarioName}, page: ${page}, limit: ${limit}`
  );
  try {
    console.log(`🔎 Looking up scenario with ID: ${scenarioName}`);
    const scenario = await Scenario.findOne({
      scenarioId: scenarioName,
    });

    if (!scenario) {
      console.log(`⚠️ Scenario not found: ${scenarioName}`);
      throw new Error(`Scenario not found: ${scenarioName}`);
    }

    console.log(
      `✅ Found scenario: ${scenario.scenarioId}
 ${scenario}`
    );
    console.log(`📚 Fetching messages for scenario ID: ${scenario._id}`);

    const messages = await Message.find({
      scenario: scenario._id,
    })
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(`📝 Retrieved ${messages.length} messages`);
    console.log(`🔄 Returning conversation data package`);
    const isLastPage = messages.length < limit;
    return { messages, scenario, isLastPage };
  } catch (error) {
    console.error(
      `❌ Error fetching conversation history: ${error.message}`,
      error
    );
    console.error(`🚨 Stack trace: ${error.stack}`);
    throw error;
  }
}

export async function searchMessages(query, page = 1, limit = 50) {
  console.log(
    `🔍 Searching messages with query: "${query}", page: ${page}, limit: ${limit}`
  );
  try {
    console.log(`🔎 Executing text search in MongoDB`);
    const messages = await Message.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit);

    console.log(`📊 Search results: ${messages.length} messages found`);
    if (messages.length === 0) {
      console.log(`🤷‍♂️ No messages found matching query: "${query}"`);
    } else {
      console.log(`🎯 Top result score: ${messages[0]?._doc?.score || "N/A"}`);
    }

    console.log(`🔄 Returning search results`);
    return messages;
  } catch (error) {
    console.error(`❌ Error searching messages: ${error.message}`, error);
    console.error(`🚨 Stack trace: ${error.stack}`);
    throw error;
  }
}
