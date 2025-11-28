import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ===============================
// 🚀 CONFIGURATION SMTP BREVO
// ===============================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // false pour port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ===============================
// 🔍 Vérifier connexion SMTP
// ===============================
transporter.verify()
  .then(() => console.log("✅ SMTP connecté (Brevo OK)"))
  .catch(err => console.error("❌ Problème SMTP :", err));


// ===============================================
// 📩 EMAIL 1 : Confirmation participation
// ===============================================
export const sendConfirmationEmail = async ({ to, firstName, lastName }) => {
  try {

    const htmlContent = `
      <html>
      <body style="font-family:Arial;background:#f7f3ed;margin:0;padding:0;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">
          
          <div style="background:#1F4D3E;color:#fff;padding:25px;text-align:center;">
            <h2 style="margin:0;">Bambou Glow Up</h2>
          </div>

          <div style="padding:25px;color:#333;">
            <h3>Bonjour ${firstName} ${lastName}</h3>
            <p>Merci pour votre participation ! Nous avons bien reçu votre inscription.</p>
            <p>Nous vous contacterons bientôt.</p>
            <p style="margin-top:30px;">Cordialement,<br>L’équipe Bambou</p>
          </div>

          <div style="background:#eee;text-align:center;padding:15px;font-size:13px;color:#666;">
            © ${new Date().getFullYear()} Bambou Glow Up
          </div>

        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: "🎉 Merci pour votre participation",
      html: htmlContent
    });

    console.log("📧 Email participation envoyé →", to);

  } catch (error) {
    console.error("❌ Erreur confirmation email :", error);
  }
};


// ===============================================
// 📩 EMAIL 2 : Demande de devis
// ===============================================
export const sendQuoteEmail = async ({ to, firstName, lastName }) => {
  try {

    const htmlContent = `
      <html>
      <body style="font-family:Arial;background:#f7f3ed;margin:0;padding:0;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">
          
          <div style="background:#1F4D3E;color:#fff;padding:25px;text-align:center;">
            <h2 style="margin:0;">Bambou Esthétique</h2>
          </div>

          <div style="padding:25px;color:#333;">
            <h3>Bonjour ${firstName} ${lastName},</h3>
            <p>Nous avons bien reçu votre demande de devis.</p>
            <p>Notre équipe vous répondra très prochainement avec une offre personnalisée.</p>
            <p style="margin-top:30px;">Merci pour votre confiance 💚<br>L’équipe Bambou</p>
          </div>

          <div style="background:#eee;text-align:center;padding:15px;font-size:13px;color:#666;">
            © ${new Date().getFullYear()} Bambou Esthétique
          </div>

        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject: "📨 Votre demande de devis est bien reçue",
      html: htmlContent
    });

    console.log("📧 Email devis envoyé →", to);

  } catch (error) {
    console.error("❌ Erreur email devis :", error);
  }
};


// ===============================================
// 📩 EMAIL 3 : Notification admin
// ===============================================
export const sendAdminNotification = async ({ participant }) => {
  try {

    const htmlContent = `
      <html>
      <body style="font-family:Arial;background:#fff;">
        <div style="max-width:600px;margin:auto;padding:20px;">
          <h2 style="background:#1F4D3E;color:#fff;padding:15px;text-align:center;">
            Nouvelle Participation
          </h2>
          <p><strong>Nom :</strong> ${participant.firstName} ${participant.lastName}</p>
          <p><strong>Email :</strong> ${participant.email}</p>
          <p><strong>Téléphone :</strong> ${participant.phone || "Non renseigné"}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `📥 Nouvelle participation - ${participant.firstName} ${participant.lastName}`,
      html: htmlContent
    });

    console.log("📧 Admin notifié →", participant.email);

  } catch (error) {
    console.error("❌ Erreur notification admin :", error);
  }
};


// Export du transporteur
export default transporter;
