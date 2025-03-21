import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import { validateUserRegistration } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Register route
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', loginUser);

export default router;
