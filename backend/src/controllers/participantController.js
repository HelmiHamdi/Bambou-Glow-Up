import Participant from '../models/Participant.js';
import cloudinary from '../utils/cloudinary.js';
import { sendConfirmationEmail } from '../utils/mailer.js';
import streamifier from 'streamifier';

export const createParticipant = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone, age, city, description
    } = req.body;

    const existingParticipant = await Participant.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingParticipant) {
    return res.status(409).json({
  success: false,
  message: "Cet email est déjà inscrit à notre plateforme"
});

    }

    let imageUrl = '';
    let cloudId = '';

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              folder: 'bambou/participants',
              transformation: [
                { width: 800, height: 800, crop: 'limit' },
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
        
        imageUrl = uploadResult.secure_url;
        cloudId = uploadResult.public_id;
      } catch (uploadError) {
        console.error('Erreur upload image:', uploadError);
        return res.status(500).json({ 
          success: false,
          message: 'Erreur lors de l\'upload de l\'image' 
        });
      }
    }

    // Création du participant
    const participant = new Participant({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      age: age ? parseInt(age) : undefined,
      city: city ? city.trim() : '',
      description: description ? description.trim() : '',
      imageUrl,
      cloudinaryId: cloudId
    });

    await participant.save();

    // Envoi de l'email de confirmation
   /* try {
      await sendConfirmationEmail({ 
        to: participant.email, 
        firstName: participant.firstName,
        lastName: participant.lastName,
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On ne bloque pas la réponse si l'email échoue
    }*/

    res.status(201).json({
      success: true,
      message: 'Participation enregistrée avec succès! Un email de confirmation vous a été envoyé.',
      participant: {
        id: participant._id,
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email
      }
    });

  } catch (err) {
    console.error('Erreur création participant:', err);
    
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
      message: 'Erreur lors de l\'inscription' 
    });
  }
};

// @desc    Récupérer tous les participants
// @route   GET /api/participants
// @access  Private
export const getParticipants = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, selected } = req.query;
    
    let query = {};
    
    // Filtre de recherche
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtre par statut
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filtre par sélection
    if (selected && selected !== 'all') {
      query.selected = selected === 'selected';
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      lean: true
    };
    
    const participants = await Participant.find(query)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit);
    
    const total = await Participant.countDocuments(query);
    
    res.json({
      success: true,
      participants,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });

  } catch (err) {
    console.error('Erreur récupération participants:', err);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des participants' 
    });
  }
};

// @desc    Récupérer un participant
// @route   GET /api/participants/:id
// @access  Private
export const getParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    
    if (!participant) {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }

    res.json({
      success: true,
      participant
    });

  } catch (err) {
    console.error('Erreur récupération participant:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

// @desc    Supprimer un participant
// @route   DELETE /api/participants/:id
// @access  Private
export const deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    
    if (!participant) {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }

    // Suppression de l'image Cloudinary si elle existe
    if (participant.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(participant.cloudinaryId);
      } catch (cloudinaryError) {
        console.error('Erreur suppression Cloudinary:', cloudinaryError);
      }
    }

    await Participant.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Participant supprimé avec succès'
    });

  } catch (err) {
    console.error('Erreur suppression participant:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la suppression' 
    });
  }
};

// @desc    Sélectionner/désélectionner un participant
// @route   PATCH /api/participants/:id/select
// @access  Private
export const toggleSelect = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    
    if (!participant) {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }

    participant.selected = !participant.selected;
    await participant.save();

    res.json({
      success: true,
      message: participant.selected ? 
        'Participant sélectionné' : 
        'Participant désélectionné',
      participant
    });

  } catch (err) {
    console.error('Erreur toggle selection:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la mise à jour' 
    });
  }
};

// @desc    Mettre à jour le statut d'un participant
// @route   PATCH /api/participants/:id/status
// @access  Private
export const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const participant = await Participant.findById(req.params.id);
    
    if (!participant) {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }

    if (status) participant.status = status;
    if (notes !== undefined) participant.notes = notes;
    
    await participant.save();

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      participant
    });

  } catch (err) {
    console.error('Erreur mise à jour statut:', err);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ 
        success: false,
        message: 'Participant non trouvé' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la mise à jour' 
    });
  }
};