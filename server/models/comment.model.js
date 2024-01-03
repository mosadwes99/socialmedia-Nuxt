import mongoose from "mongoose";

let schema = mongoose.Schema(
  {
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  },
  { timestamps: true }
);
export let commentModel = mongoose.model("comment", schema);
