import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('🌱 Démarrage du seed admin...');

    await connectDB();

    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error('Variables ADMIN_EMAIL et ADMIN_PASSWORD requises dans .env');
    }

    // Vérification si l'admin existe déjà
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('ℹ️ Admin existe déjà:', existingAdmin.email);

      if (process.argv.includes('--force')) {
        console.log('🔄 Forcer la mise à jour du mot de passe...');
        // Hash du nouveau mot de passe
        const salt = await bcrypt.genSalt(12);
        existingAdmin.password = await bcrypt.hash(ADMIN_PASSWORD, salt);
        await existingAdmin.save();
        console.log('✅ Mot de passe admin mis à jour');
      }

      process.exit(0);
    }

    // Création du superadmin
    const admin = new Admin({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // sera hashé automatiquement par le pre-save
      name: 'Administrateur Principal',
      role: 'superadmin'
    });

    await admin.save();

    console.log('✅ Admin créé avec succès:');
    console.log('   📧 Email:', admin.email);
    console.log('   👤 Nom:', admin.name);
    console.log('   🔑 Rôle:', admin.role);
    console.log('   🕐 Créé le:', admin.createdAt.toLocaleString('fr-FR'));

    process.exit(0);

  } catch (err) {
    console.error('❌ Erreur seed admin:', err);
    process.exit(1);
  }
};

// Gestion des signaux pour une fermeture propre
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`\n🔌 Seed interrompu (${signal})`);
    process.exit(0);
  });
});

seedAdmin();
