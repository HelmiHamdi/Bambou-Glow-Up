import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  specialty: { 
    type: String,
    required: [true, 'La spécialité est obligatoire'],
    trim: true,
    maxlength: [100, 'La spécialité ne peut pas dépasser 100 caractères']
  },
  phone: { 
    type: String,
    trim: true
  },
  address: { 
    type: String,
    trim: true,
    maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères']
  },
  photoUrl: { 
    type: String 
  },
  cloudinaryId: { 
    type: String 
  },
  description: { 
    type: String,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  website: {
    type: String,
    trim: true
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  services: [String],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware pour mettre à jour updatedAt
PartnerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour les recherches
PartnerSchema.index({ name: 1 });
PartnerSchema.index({ specialty: 1 });
PartnerSchema.index({ isActive: 1 });
PartnerSchema.index({ createdAt: -1 });

export default mongoose.model('Partner', PartnerSchema);