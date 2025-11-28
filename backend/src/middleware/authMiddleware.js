import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// @desc    Middleware d'authentification admin
// @access  Private
export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Token d\'authentification manquant' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérification que le token contient bien un admin
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide' 
      });
    }
    
    req.admin = decoded;
    next();
    
  } catch (err) {
    console.error('Erreur authentification:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expiré' 
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token invalide' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur d\'authentification' 
    });
  }
};

// @desc    Middleware de validation des données
// @access  Public
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: 'Données invalides',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};