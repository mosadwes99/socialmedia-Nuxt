import mongoose from "mongoose";

let AbstractSchema = mongoose.Schema({
  job: String,
  education: String,
  address: String,
  relation: String,
});

let UserSchema = mongoose.Schema(
  {
    userName: String,
    name: String,
    email: String,
    password: String,
    userImage: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    requestSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    requestReceive: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    statue: String,
    abstract: AbstractSchema,
  },
  { timestamps: true }
);
export let userModel = mongoose.model("user", UserSchema);
