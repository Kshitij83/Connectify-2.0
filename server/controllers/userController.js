import zod from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userModel.js";
import { friendsModel } from "../models/friendsModel.js";
import { requestsModel } from "../models/requestsModel.js";

dotenv.config();
const jwtsecret = process.env.JWT_SECRET;

const signupbody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
  username: zod.string(),
});

export const signup = async (req, res) => {
  try {
    const { success } = signupbody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({ message: "incorrect input" });
    }
    const existinguser = await userModel.findOne({
      username: req.body.username,
    });
    if (existinguser) {
      return res.status(411).json({ message: "username already taken" });
    }
    const newUser = await userModel.create({
      email: req.body.email,
      password: req.body.password,
      username: req.body.username,
    });

    const userId = newUser._id;
    await requestsModel.create({ userId, requests: [] });
    await friendsModel.create({ userId, friends: [] });

    const token = jwt.sign({ userId }, jwtsecret);
    res
      .status(200)
      .json({ message: "User created Successfully", token, userId });
  } catch (error) {
    res.status(500).json({ message: "error while signing up" });
  }
};

const signinbody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

export const signin = async (req, res) => {
  try {
    const { success, data } = signinbody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Incorrect input", errors: data });
    }

    const { username, password } = data;
    const user = await userModel.findOne({ username, password });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or credentials incorrect" });
    }

    const token = jwt.sign({ userId: user._id }, jwtsecret);
    res.json({ token, userId: user._id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while signing in", error: error.message });
  }
};

export const getusers = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const users = await userModel.find({ _id: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getprofile = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const user = await userModel.findOne({ _id: userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(411).json(error);
  }
};

export const getpfp = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.pfp);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updatepfp = async (req, res) => {
  const { pfp } = req.body;
  const userId = req.headers.userid;
  if (!userId || !pfp) {
    return res
      .status(400)
      .json({ message: "User ID and profile picture are required" });
  }

  try {
    const user = await userModel.findByIdAndUpdate(userId, { pfp });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Profile picture updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getfriends = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const friends = await friendsModel
      .findOne({ userId })
      .populate("friends", "username _id pfp");
    if (!friends) {
      return res.status(200).json({ message: "You have no friends" });
    }
    const friendDetails = friends.friends.map((user) => ({
      userId: user._id,
      username: user.username,
      pfp: user.pfp,
    }));
    res.status(200).json(friendDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const isfriend = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { to } = req.query;
    const isfriend = await friendsModel.findOne({ userId, friends: to });
    res.status(200).json(isfriend ? "Added" : "Add Friend");
  } catch (error) {
    res.json({ message: error });
  }
};

export const sentrequests = async (req, res) => {
  try {
    const userId = req.headers.userid;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const requests = await requestsModel
      .find({ requests: userId })
      .populate("userId", "username pfp");
    const users = requests.map((request) => ({
      username: request.userId.username,
      pfp: request.userId.pfp,
    }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
};

export const issent = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { to } = req.query;
    const sent = await requestsModel.findOne({ userId: to, requests: userId });
    res.status(200).json(sent ? "Sent" : "Add Friend");
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};

export const receivedrequests = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const userRequests = await requestsModel
      .findOne({ userId })
      .populate("requests", "username _id pfp");
    const userDetails = userRequests.requests.map((user) => ({
      userId: user._id,
      username: user.username,
      pfp: user.pfp,
    }));
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const sendrequest = async (req, res) => {
  try {
    const userId = req.headers["userid"];
    const { to } = req.body;
    console.log(to);
    const existingRequest = await requestsModel.findOne({
      userId: to,
      requests: userId,
    });

    const reqalr = await requestsModel.findOne({
      userId: userId,
      requests: to,
    });
    if (reqalr) {
      return res.status(200).json({
        message: "Alreadysent",
      });
    }

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    console.log("hello");
    await requestsModel.updateOne(
      { userId: to },
      { $push: { requests: userId } }
    );
    return res.status(200).json({
      message: "request sent successfully",
    });
  } catch (error) {
    return res.json({
      message: error,
    });
  }
};

export const acceptrequest = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { from } = req.body;

    if (!userId || !from) {
      return res.status(400).json({ message: "userId and from are required" });
    }

    const request = await requestsModel.findOne({ userId, requests: from });
    if (!request) {
      return res.status(400).json({ message: "No request from this user" });
    }

    await requestsModel.updateOne({ userId }, { $pull: { requests: from } });
    await friendsModel.updateOne(
      { userId },
      { $addToSet: { friends: from } },
      { upsert: true }
    );
    await friendsModel.updateOne(
      { userId: from },
      { $addToSet: { friends: userId } },
      { upsert: true }
    );

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Error accepting request" });
  }
};

export const searchuser = async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const users = await userModel.find({
      $or: [{ username: { $regex: new RegExp(searchQuery, "i") } }],
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
