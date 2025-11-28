import QuoteRequest from "../models/QuoteRequest.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import { sendQuoteEmail } from '../utils/mailer.js';

export const createQuoteRequest = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      country,
      city,
      services,
      budget,
      availableDates,
      phone,
      email
    } = req.body;

    // Validation des champs obligatoires
    if (!firstName || !lastName || !country || !phone || !email || !budget) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis"
      });
    }

    // Upload d'une seule photo
    let uploadedImages = [];
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "bambou/quotes",
            transformation: [
              { width: 1000, height: 1000, crop: "limit" },
              { quality: "auto" },
              { format: "jpg" }
            ]
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      uploadedImages.push({
        url: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id
      });
    }

    const quote = new QuoteRequest({
      firstName,
      lastName,
      country,
      city,
      services: Array.isArray(services) ? services : JSON.parse(services || "[]"),
      budget: parseFloat(budget),
      availableDates,
      phone,
      email,
      photos: uploadedImages
    });

    await quote.save();

    try {
      await sendQuoteEmail({
        to: quote.email,
        firstName: quote.firstName,
        lastName: quote.lastName
      });
    } catch (emailError) {
      console.error("Erreur envoi email devis :", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Demande de devis envoyée avec succès.",
      quote
    });

  } catch (err) {
    console.error("Erreur création devis :", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Données de formulaire invalides",
        errors: Object.values(err.errors).map(error => error.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du devis"
    });
  }
};

// Les autres fonctions restent inchangées
export const getQuoteRequests = async (req, res) => {
  try {
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, quotes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const getQuoteRequest = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Demande non trouvée"
      });
    }

    res.json({ success: true, quote });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const deleteQuoteRequest = async (req, res) => {
  try {
    const quote = await QuoteRequest.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: "Demande non trouvée" });

    // delete cloudinary photos
    for (const photo of quote.photos) {
      if (photo.cloudinaryId) {
        await cloudinary.uploader.destroy(photo.cloudinaryId);
      }
    }

    await QuoteRequest.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Demande supprimée" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur" });
  }
};