import express from "express";
import { register, login, randomDp } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/randomdp", randomDp);

export default router;
