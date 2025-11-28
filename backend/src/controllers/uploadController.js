import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// @desc    Uploader une image
// @route   POST /api/upload
// @access  Private
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier fourni' 
      });
    }

    // Vérification du type de fichier
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false,
        message: 'Type de fichier non autorisé. Formats acceptés: JPEG, JPG, PNG, WEBP' 
      });
    }

    // Vérification de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        success: false,
        message: 'Fichier trop volumineux. Taille maximale: 5MB' 
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: 'bambou/uploads',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { format: 'jpg' }
          ]
        }, 
        (error, result) => {
          if (error) reject(error); 
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    res.json({
      success: true,
      message: 'Upload réussi',
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height
      }
    });

  } catch (err) {
    console.error('Erreur upload:', err);
    
    if (err.http_code === 400) {
      return res.status(400).json({ 
        success: false,
        message: 'Fichier invalide' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'upload' 
    });
  }
};

// @desc    Supprimer une image
// @route   DELETE /api/upload
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ 
        success: false,
        message: 'ID public requis' 
      });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image supprimée avec succès'
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: 'Image non trouvée' 
      });
    }

  } catch (err) {
    console.error('Erreur suppression image:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la suppression' 
    });
  }
};