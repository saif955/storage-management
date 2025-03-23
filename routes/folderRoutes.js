import { Router } from "express";
import { createFolder, getFolder, updateFolder, deleteFolder } from "../controllers/folderController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();

router.post('/', protect, createFolder);
router.get('/:id', protect, getFolder);
router.put('/:id', protect, updateFolder);
router.delete('/:id', protect, deleteFolder);

export default router;