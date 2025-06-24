import express from "express";
import { addComment, getComments } from "../controllers/commentsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:postId", authMiddleware, addComment);

router.get("/:postId", getComments);

export default router;
