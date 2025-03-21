import express from "express";
import { registerUser } from "../controllers/userController.js";
import { validateUserRegistration } from "../controllers/userController.js";

const router = express.Router();

// Register route
router.post('/register', validateUserRegistration, registerUser);

export default router;
