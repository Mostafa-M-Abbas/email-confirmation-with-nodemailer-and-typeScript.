import express from "express";
import { registerUser, confirmEmail } from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.get("/confirm/:token", confirmEmail);

export default router;
