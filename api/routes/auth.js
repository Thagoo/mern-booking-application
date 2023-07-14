import express from "express";
import {
  register,
  login,
  randomDp,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/randomdp", randomDp);

export default router;
