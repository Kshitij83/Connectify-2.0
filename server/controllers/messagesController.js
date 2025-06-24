import { messageModel } from "../models/messageModel.js";

export const getmessages = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const friendId = req.query.friendId;
    const messages = await messageModel.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const sendmessage = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const friendId = req.body.friendId;
    const message = req.body.message;
    const messageType = req.body.messageType || "text";
    const fileName = req.body.fileName;

    const newmessage = await messageModel.create({
      sender: userId,
      receiver: friendId,
      message,
      messageType,
      fileName,
      timestamp: Date.now(),
    });
    res.status(200).json({ message: "Message sent" });
  } catch (error) {
    res.status(500).json(error);
  }
};
