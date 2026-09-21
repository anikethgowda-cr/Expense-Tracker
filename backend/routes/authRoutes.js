import express from "express";
import {
  registerUser,
  loginUser,
  getMe
} from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator
} from "../validators/authValidator.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.get("/me", protect, getMe);

export default router;
