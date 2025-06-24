import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getmessages, sendmessage } from "../controllers/messagesController.js";

const router = express.Router();

router.get("/getmessages", authMiddleware, getmessages);
router.post("/sendmessage", authMiddleware, sendmessage);

export default router;
