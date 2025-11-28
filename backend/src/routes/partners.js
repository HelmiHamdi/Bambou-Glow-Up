import express from 'express';
import multer from 'multer';
import {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner
} from '../controllers/partnerController.js';
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
router.get('/', getPartners);
router.get('/:id', getPartner);

// Routes admin (protégées)
router.post('/', adminAuth, upload.single('photo'), createPartner);
router.put('/:id', adminAuth, upload.single('photo'), updatePartner);
router.delete('/:id', adminAuth, deletePartner);

export default router;