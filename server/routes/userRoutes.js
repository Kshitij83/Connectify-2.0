import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { userModel } from "../models/userModel.js";
import {
  signup,
  signin,
  getusers,
  getprofile,
  getpfp,
  updatepfp,
  getfriends,
  isfriend,
  sentrequests,
  issent,
  receivedrequests,
  acceptrequest,
  sendrequest,
  searchuser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getusers", authMiddleware, getusers);
router.get("/getprofile", authMiddleware, getprofile);
router.get("/getpfp", authMiddleware, getpfp);
router.put("/updatepfp", authMiddleware, updatepfp);
router.get("/getfriends", authMiddleware, getfriends);
router.get("/isfriend", authMiddleware, isfriend);
router.get("/sentrequests", sentrequests);
router.get("/issent", authMiddleware, issent);
router.get("/receivedrequests", authMiddleware, receivedrequests);
router.post("/acceptrequest", authMiddleware, acceptrequest);
router.post("/sendrequest", authMiddleware, sendrequest);
router.get("/searchuser", searchuser);
router.delete("/delete/:id", authMiddleware, deleteUser);

export default router;
