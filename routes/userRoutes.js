import express from "express";
import { registerUser, loginUser, forgotPassword,resetPassword } from "../controllers/userController.js";
import { validateUserRegistration } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Register route
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get("/profile", protect, getUser);
export default router;
