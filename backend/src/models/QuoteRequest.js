import mongoose from 'mongoose';

const QuoteRequestSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Le prénom est obligatoire"],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true
  },
  country: {
    type: String,
    required: [true, "Le pays est obligatoire"],
    trim: true
  },
  city: { 
    type: String, 
    required: false,
    trim: true 
  },
  services: {
    type: [String],
    enum: ["Esthétique", "Dentaire", "Cheveux", "Mode"],
    required: true
  },
  photos: [
    {
      url: String,
      cloudinaryId: String,
    }
  ],
  budget: {
    type: String,
    required: false
  },
  availableDates: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: [true, "Le numéro de téléphone est obligatoire"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ["pending", "contacted", "treated"],
    default: "pending"
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("QuoteRequest", QuoteRequestSchema);