import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import mainRouter from "./routes/index.js";
import { Server } from "socket.io";
import http from "http";
import { messageModel } from "./models/messageModel.js";
import { uploadAudioToS3 } from './utils/s3Upload.js';

import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
import bodyParser from "body-parser";

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api", mainRouter);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ userId, friendId }) => {
    const room = [userId, friendId].sort().join("_");
    socket.join(room);
  });

  socket.on("sendMessage", async ({ sender, receiver, message, messageType, fileName }) => {
    let messageContent = message;

    // Upload audio to S3 and use the S3 URL
    if (messageType === "audio" && message.startsWith("data:audio")) {
      messageContent = await uploadAudioToS3(message, fileName || "audio.webm");
    }

    // (Optional) For images, you can also upload to S3 here if you want

    const newMessage = await messageModel.create({
      sender,
      receiver,
      message: messageContent,
      messageType: messageType || "text",
      fileName: fileName || undefined,
      timestamp: Date.now(),
    });

    const room = [sender, receiver].sort().join("_");
    io.to(room).emit("message", newMessage);
  });

  socket.on("callUser", (data) => {
    io.to(data.to).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
      callType: data.callType, // 'audio' or 'video'
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, "0.0.0.0", (err) => {
  if (err) console.log("Error in server setup");
  console.log(
    `Server listening in ${process.env.NODE_ENV} mode on Port ${PORT}`
  );
});
