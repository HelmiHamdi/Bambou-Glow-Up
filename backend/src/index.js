import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import participantsRoutes from "./routes/participants.js";
import partnersRoutes from "./routes/partners.js";
import uploadRoute from "./routes/upload.js";
import quoteRoutes from "./routes/quoteRoutes.js";

dotenv.config();

// Fix ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/participants", participantsRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/quotes", quoteRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "🌿 API running", version: "1.0.0" });
});

// Serve frontend
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
