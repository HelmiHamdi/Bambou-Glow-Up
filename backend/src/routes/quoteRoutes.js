import express from "express";
import multer from "multer";
import { 
  createQuoteRequest, 
  getQuoteRequests, 
  getQuoteRequest, 
  deleteQuoteRequest 
} from "../controllers/quoteController.js";
import { adminAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 5MB limit
});

// Route publique pour envoyer un devis - UNE SEULE IMAGE
router.post("/", upload.single("photo"), createQuoteRequest);

// Routes admin protégées
router.get("/", adminAuth, getQuoteRequests);
router.get("/:id", adminAuth, getQuoteRequest);
router.delete("/:id", adminAuth, deleteQuoteRequest);

export default router;