import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email et mot de passe requis' 
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Identifiants invalides' 
      });
    }


    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Identifiants invalides' 
      });
    }

  
    await admin.updateLastLogin();


    const token = jwt.sign(
      { 
        id: admin._id, 
        email: admin.email,
        role: admin.role
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      admin: { 
        id: admin._id, 
        email: admin.email, 
        name: admin.name,
        role: admin.role
      }
    });

  } catch (err) {
    console.error('Erreur connexion admin:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur lors de la connexion' 
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'Administrateur non trouvé' 
      });
    }

    res.json({
      success: true,
      admin
    });

  } catch (err) {
    console.error('Erreur récupération profil:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

  } catch (err) {
    console.error('Erreur vérification token:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};