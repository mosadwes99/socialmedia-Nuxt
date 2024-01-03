import mongoose from "mongoose";

let schema = mongoose.Schema(
  {
    content: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    messageUid: String,
  },
  { timestamps: true }
);
export let messageModel = mongoose.model("message", schema);
