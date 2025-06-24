import { postsModel } from "../models/postsModel.js";
import { userModel } from "../models/userModel.js";

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  const userId = req.user?.userId;

  try {
    const post = await postsModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const username = user.username;

    const newComment = {
      userId: userId,
      username: username,
      text: text,
    };

    post.comments.push(newComment);

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postsModel
      .findById(postId)
      .populate("comments.userId", "username");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
