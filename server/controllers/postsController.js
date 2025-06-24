import { userModel } from "../models/userModel.js";
import { postsModel } from "../models/postsModel.js";
import { friendsModel } from "../models/friendsModel.js";

export const createpost = async (req, res) => {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID missing in headers" });
    }
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { base64 } = req.body;

    const newpost = await postsModel.create({
      userId,
      likes: 0,
      caption: req.body.caption,
      username: user.username,
      image: base64,
      comments: [],
    });

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

export const getposts = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const friends = await friendsModel.findOne({ userId });
    if (!friends) {
      return res
        .status(411)
        .json({ message: "Add friends to see their posts on your feed" });
    }

    const friendsArray = friends.friends;
    const posts = await postsModel.find({ userId: { $in: friendsArray } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "error getting the posts" });
  }
};

export const userposts = async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await userModel.findById(userId);
    const posts = await postsModel.find({ userId });
    const friends = await friendsModel.findOne({ userId });

    res.status(200).json({ user, posts, friends: friends.friends });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const likePost = async (postId, userId) => {
  try {
    const post = await postsModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const alreadyLiked = post.likedBy.some(
      (like) => like.userId.toString() === userId
    );
    if (alreadyLiked) {
      post.likes--;
      post.likedBy = post.likedBy.filter(
        (like) => like.userId.toString() !== userId
      );
    } else {
      post.likes++;
      post.likedBy.push({ userId: userId });
    }
    await post.save();

    return { message: "Post liked successfully", post, liked: !alreadyLiked };
  } catch (error) {
    throw new Error(`Error liking post: ${error.message}`);
  }
};

export const isPostLikedByUser = async (postId, userId) => {
  try {
    const post = await postsModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const liked = post.likedBy.some(
      (like) => like.userId.toString() === userId
    );

    return liked;
  } catch (error) {
    throw new Error(`Error checking like status: ${error.message}`);
  }
};
