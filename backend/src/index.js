import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import participantsRoutes from "./routes/participants.js";
import partnersRoutes from "./routes/partners.js";
import uploadRoute from "./routes/upload.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import corsMiddleware from "./middleware/cors.js";
import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();


// --- Middlewares globaux ---
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes API ---
app.use("/api/auth", authRoutes);
app.use("/api/participants", participantsRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/quotes", quoteRoutes);
// --- Route racine test API ---

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Capture toutes les autres routes et renvoie index.html (pour permettre le routage frontend)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}
app.get("/api", (req, res) => {
  res.json({
    message: "🌿 Bambou Glow Up API is running!",
    version: "1.0.0"
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  connectDB();
});
