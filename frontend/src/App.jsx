import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ConditionsUtilisation from './pages/ConditionsUtilisation';
import Partenariat from './pages/Partenariat';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './hooks/useAuth.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/conditions-utilisation" element={<ConditionsUtilisation />} />
          <Route path="/partenariat" element={<Partenariat />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-[#0F5B4F] mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page non trouvée</p>
                <a 
                  href="/" 
                  className="bg-[#0F5B4F] text-white px-6 py-3 rounded-lg hover:bg-[#0a4037] transition-colors"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;