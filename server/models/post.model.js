import mongoose from "mongoose";

let schema = mongoose.Schema(
  {
    title: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    imgs: Array,
    reacts: [
      {
        reactBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        react: String,
      },
    ],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  },
  { timestamps: true }
);
export let postModel = mongoose.model("post", schema);
