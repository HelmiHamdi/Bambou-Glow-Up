import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

// ===============================
// 🚀 CONFIGURATION SENDGRID
// ===============================
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===============================================
// 📩 FONCTION GÉNÉRIQUE D’ENVOI D’EMAIL
// ===============================================
const sendEmail = async (to, subject, htmlContent, textContent) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    html: htmlContent,
    text: textContent || "Message sans texte alternatif",
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ Email envoyé à ${to}`);
  } catch (error) {
    console.error("❌ Erreur SendGrid:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error("Erreur lors de l’envoi de l’email");
  }
};

// ===============================================
// 📩 EMAIL 1 : Confirmation de participation
// ===============================================
export const sendConfirmationEmail = async ({ to, firstName, lastName }) => {
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
  const textContent = `Bonjour ${firstName} ${lastName}, merci pour votre participation.`;

  await sendEmail(to, "🎉 Merci pour votre participation", htmlContent, textContent);
};

// ===============================================
// 📩 EMAIL 2 : Demande de devis
// ===============================================
export const sendQuoteEmail = async ({ to, firstName, lastName }) => {
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
  const textContent = `Bonjour ${firstName} ${lastName}, nous avons bien reçu votre demande de devis.`;

  await sendEmail(to, "📨 Votre demande de devis est bien reçue", htmlContent, textContent);
};

// ===============================================
// 📩 EMAIL 3 : Notification admin
// ===============================================
export const sendAdminNotification = async ({ participant }) => {
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
  const textContent = `Nouvelle participation : ${participant.firstName} ${participant.lastName}, Email: ${participant.email}, Téléphone: ${participant.phone || "Non renseigné"}`;

  await sendEmail(process.env.ADMIN_EMAIL, `📥 Nouvelle participation - ${participant.firstName} ${participant.lastName}`, htmlContent, textContent);
};

export default sendEmail;
