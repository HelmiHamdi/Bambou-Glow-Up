import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: [true, 'Le prénom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: { 
    type: String, 
    required: [true, 'Le nom est obligatoire'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: { 
    type: String, 
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: { 
    type: String,
    required: [true, 'Le numéro de téléphone est obligatoire'],
    trim: true
  },
  age: { 
    type: Number,
    min: [16, 'L\'âge minimum est de 16 ans'],
    max: [80, 'L\'âge maximum est de 80 ans']
  },
  city: { 
    type: String,
    trim: true,
    maxlength: [100, 'La ville ne peut pas dépasser 100 caractères']
  },
  description: { 
    type: String,
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  imageUrl: { 
     required: [true, 'L\'image  est obligatoire'],
    type: String 
  },
  cloudinaryId: { 
    type: String 
  },
  selected: { 
    type: Boolean, 
    default: false 
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères']
  },
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
ParticipantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour les recherches
ParticipantSchema.index({ email: 1 });
ParticipantSchema.index({ createdAt: -1 });
ParticipantSchema.index({ selected: 1 });
ParticipantSchema.index({ status: 1 });

export default mongoose.model('Participant', ParticipantSchema);