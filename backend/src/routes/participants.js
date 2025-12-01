import express from 'express';
import multer from 'multer';
import {
  createParticipant,
  getParticipants,
  getParticipant,
  deleteParticipant,
  toggleSelect,
  updateStatus
} from '../controllers/participantController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Routes publiques
router.post('/', upload.single('photo'), createParticipant);

// Routes admin (protégées)
router.get('/', adminAuth, getParticipants);
router.get('/:id', adminAuth, getParticipant);
router.delete('/:id', adminAuth, deleteParticipant);
router.patch('/:id/select', adminAuth, toggleSelect);
router.patch('/:id/status', adminAuth, updateStatus);

export default router;