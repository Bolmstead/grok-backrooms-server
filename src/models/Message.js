import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["grok1", "grok2", "user", "status"],
    required: true,
  },
  backroomId: {
    type: String,
    enum: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
    required: true,
  },
  model: {
    type: String,
    enum: [
      "grok-2-1212",
      "grok-3-beta",
      "grok-3-mini-beta",
      "grok-2-image-1212",
      "grok-2-vision-1212",
      "grok-3-mini-fast-beta",
      "grok-3-fast-beta",
      "claude-3-opus-20240229",
      "status",
    ],
    required: true,
  },
  systemMessage: {
    type: String,
    required: true,
  },
  maxTokens: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create text index on content field
MessageSchema.index({ content: "text" });

export default mongoose.model("Message", MessageSchema);
