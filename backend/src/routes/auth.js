import express from 'express';
import { login, getProfile, verifyToken } from '../controllers/authController.js';
import { adminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Connexion admin
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/profile
// @desc    Récupérer le profil admin
// @access  Private
router.get('/profile', adminAuth, getProfile);

// @route   GET /api/auth/verify
// @desc    Vérifier le token
// @access  Private
router.get('/verify', adminAuth, verifyToken);

export default router;