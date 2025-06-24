import mongoose from "mongoose";
import { userModel } from "./userModel.js";

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },
});

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [likeSchema],
  caption: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  comments: [commentSchema],
});

const postsModel = mongoose.model("postsModel", postsSchema);

export { postsModel };
