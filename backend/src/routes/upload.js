import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

router.post('/', adminAuth, upload.single('file'), uploadImage);
router.delete('/', adminAuth, deleteImage);

export default router;