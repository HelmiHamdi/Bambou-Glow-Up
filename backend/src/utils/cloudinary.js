import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configuration Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test de la configuration
cloudinary.v2.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connecté avec succès');
  })
  .catch(error => {
    console.error('❌ Erreur connexion Cloudinary:', error.message);
  });

export default cloudinary.v2;