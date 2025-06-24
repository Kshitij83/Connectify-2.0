import express from "express";
import userRouter from "./userRoutes.js";
import postsRouter from "./postsRouter.js";
import messagesRouter from "./messagesRouter.js";
import commentsRouter from "./commentsRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/posts", postsRouter);
router.use("/messages", messagesRouter);
router.use("/comments", commentsRouter);

export default router;
