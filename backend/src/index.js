import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import path from "path";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import participantsRoutes from "./routes/participants.js";
import partnersRoutes from "./routes/partners.js";
import uploadRoute from "./routes/upload.js";
import quoteRoutes from "./routes/quoteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// --------------------------------------------------------
// 🔧 Middlewares globaux
// --------------------------------------------------------





// CORS sécurisé
app.use(cors({
  origin: "*", // Autorise toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
// --------------------------------------------------------
// 📌 Routes API
// --------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/participants", participantsRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/quotes", quoteRoutes);

// Route test
app.get("/api", (req, res) => {
  res.json({
    message: "🌿 Bambou Glow Up API is running!",
    version: "1.0.0",
  });
});

// --------------------------------------------------------
// 🏭 Production Mode (Vite/React)
// --------------------------------------------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Permet au routing frontend de fonctionner
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

// --------------------------------------------------------
// 🚀 Démarrage serveur + connexion DB
// --------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  connectDB();
});
