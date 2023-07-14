import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
} from "#api/controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//   res.json("yes");
// });

router.post("/", verifyUser, createUser);
router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", verifyUser, getUser);
router.get("/", verifyUser, getAllUsers);

export default router;
