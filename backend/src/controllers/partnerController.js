import Partner from '../models/Partner.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

// @desc    Récupérer tous les partenaires
// @route   GET /api/partners
// @access  Public
export const getPartners = async (req, res) => {
  try {
    const { specialty, active } = req.query;
    
    let query = {};
    
    // Filtre par spécialité
    if (specialty && specialty !== 'all') {
      query.specialty = { $regex: specialty, $options: 'i' };
    }
    
    // Filtre par statut actif
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const partners = await Partner.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      partners,
      count: partners.length
    });

  } catch (err) {
    console.error('Erreur récupération partenaires:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des partenaires' 
    });
  }
};

// @desc    Récupérer un partenaire
// @route   GET /api/partners/:id
// @access  Public
export const getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ 
        success: false,
        message: 'Partenaire non trouvé' 
      });
    }

    res.json({
      success: true,
      partner
    });

  } catch (err) {
    console.error('Erreur récupération partenaire:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Partenaire non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

// @desc    Créer un partenaire
// @route   POST /api/partners
// @access  Private
export const createPartner = async (req, res) => {
  try {
    const { name, specialty, phone, address, description, website, services } = req.body;
    
    let photoUrl = '';
    let cloudId = '';

    // Upload de la photo si présente
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'bambou/partners',
              transformation: [
                { width: 600, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { format: 'jpg' }
              ]
            }, 
            (err, result) => {
              if (err) reject(err); 
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
        
        photoUrl = uploadResult.secure_url;
        cloudId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Erreur upload photo:', uploadError);
        return res.status(500).json({ 
          success: false,
          message: 'Erreur lors de l\'upload de la photo' 
        });
      }
    }

    // Création du partenaire
    const partner = new Partner({
      name: name.trim(),
      specialty: specialty.trim(),
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      description: description ? description.trim() : '',
      website: website ? website.trim() : '',
      services: services ? services.split(',').map(s => s.trim()) : [],
      photoUrl,
      cloudinaryId: cloudId
    });

    await partner.save();

    res.status(201).json({
      success: true,
      message: 'Partenaire créé avec succès',
      partner
    });

  } catch (err) {
    console.error('Erreur création partenaire:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        success: false,
        message: 'Données invalides',
        errors 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la création du partenaire' 
    });
  }
};

// @desc    Mettre à jour un partenaire
// @route   PUT /api/partners/:id
// @access  Private
export const updatePartner = async (req, res) => {
  try {
    const { name, specialty, phone, address, description, website, services, isActive } = req.body;
    
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ 
        success: false,
        message: 'Partenaire non trouvé' 
      });
    }

    // Mise à jour des champs
    if (name) partner.name = name.trim();
    if (specialty) partner.specialty = specialty.trim();
    if (phone !== undefined) partner.phone = phone.trim();
    if (address !== undefined) partner.address = address.trim();
    if (description !== undefined) partner.description = description.trim();
    if (website !== undefined) partner.website = website.trim();
    if (services !== undefined) partner.services = services.split(',').map(s => s.trim());
    if (isActive !== undefined) partner.isActive = isActive;

    // Upload de la nouvelle photo si présente
    if (req.file) {
      // Suppression de l'ancienne image
      if (partner.cloudinaryId) {
        try {
          await cloudinary.uploader.destroy(partner.cloudinaryId);
        } catch (cloudinaryError) {
          console.error('Erreur suppression ancienne image:', cloudinaryError);
        }
      }

      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'bambou/partners',
              transformation: [
                { width: 600, height: 600, crop: 'limit' },
                { quality: 'auto' },
                { format: 'jpg' }
              ]
            }, 
            (err, result) => {
              if (err) reject(err); 
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
        
        partner.photoUrl = uploadResult.secure_url;
        partner.cloudinaryId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Erreur upload nouvelle photo:', uploadError);
        return res.status(500).json({ 
          success: false,
          message: 'Erreur lors de l\'upload de la photo' 
        });
      }
    }

    await partner.save();

    res.json({
      success: true,
      message: 'Partenaire mis à jour avec succès',
      partner
    });

  } catch (err) {
    console.error('Erreur mise à jour partenaire:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Partenaire non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la mise à jour' 
    });
  }
};

// @desc    Supprimer un partenaire
// @route   DELETE /api/partners/:id
// @access  Private
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({ 
        success: false,
        message: 'Partenaire non trouvé' 
      });
    }

    // Suppression de l'image Cloudinary si elle existe
    if (partner.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(partner.cloudinaryId);
      } catch (cloudinaryError) {
        console.error('Erreur suppression Cloudinary:', cloudinaryError);
      }
    }

    await Partner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Partenaire supprimé avec succès'
    });

  } catch (err) {
    console.error('Erreur suppression partenaire:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Partenaire non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la suppression' 
    });
  }
};