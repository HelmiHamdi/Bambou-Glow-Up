import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MentionsLegales = () => {
  const legalSections = [
    {
      icon: "🏢",
      title: "Éditeur du site",
      details: [
        { label: "Société", value: "Bambou Glow Up" },
        { label: "Forme juridique", value: "SARL au capital de 50 000 TND" },
        { label: "Adresse", value: "Rue du Commerce, 1002 Tunis, Tunisia" },
        { label: "Téléphone", value: "+216 12 345 678" },
        { label: "Email", value: "contact@bambou.tn" }
      ],
      color: "linear-gradient(135deg, #0F5B4F 0%, #2E6653 100%)"
    },
    {
      icon: "🌐",
      title: "Hébergement",
      details: [
        { label: "Hébergeur", value: "[Nom de l'hébergeur]" },
        { label: "Adresse", value: "[Adresse de l'hébergeur]" },
        { label: "Téléphone", value: "[Téléphone de l'hébergeur]" }
      ],
      color: "linear-gradient(135deg, #2E6653 0%, #1F4D3E 100%)"
    },
    {
      icon: "⚖️",
      title: "Propriété intellectuelle",
      description: "L'ensemble de ce site relève de la législation tunisienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.",
      color: "linear-gradient(135deg, #1F4D3E 0%, #0F5B4F 100%)"
    },
    {
      icon: "🔒",
      title: "Protection des données",
      description: "Conformément à la loi n°2004-63 du 27 juillet 2004, relative à la protection des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.",
      color: "linear-gradient(135deg, #0F5B4F 0%, #1F4D3E 100%)"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F7EFE6] via-white to-[#F0E6D6]">
      <Header />
      
      <main className="flex-grow py-16 pt-24">
        {/* Hero Section avec design moderne */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5B4F]/5 to-[#2E6653]/5 transform -skew-y-3 origin-top-left"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#0F5B4F] to-[#2E6653] rounded-3xl mb-8 shadow-2xl">
                <span className="text-3xl">📄</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#0F5B4F] mb-6">
                Mentions <span className="text-[#2E6653]">Légales</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Transparence et conformité légale de Bambou Glow Up
              </p>
              <div className="flex justify-center space-x-4">
                <div className="w-3 h-3 bg-[#0F5B4F] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#2E6653] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-[#1F4D3E] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Design moderne */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Grid moderne avec cartes asymétriques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {legalSections.map((section, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 backdrop-blur-sm overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(247,239,230,0.8) 100%)'
                  }}
                >
                  {/* Background décoratif */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: section.color }}
                  ></div>
                  
                  <div className="relative p-8">
                    {/* En-tête avec icône */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div 
                        className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                        style={{ background: section.color }}
                      >
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0F5B4F] mb-2">
                          {section.title}
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] rounded-full"></div>
                      </div>
                    </div>

                    {/* Contenu */}
                    {section.description && (
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {section.description}
                      </p>
                    )}

                    {section.details && (
                      <div className="space-y-4">
                        {section.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm font-semibold text-[#0F5B4F] min-w-32 mb-1 sm:mb-0">
                              {detail.label}
                            </span>
                            <span className="text-gray-700 font-medium">
                              {detail.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Effet de bordure animée */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
                </div>
              ))}
            </div>

            {/* Section d'engagement */}
            <div className="relative bg-gradient-to-br from-[#0F5B4F] to-[#2E6653] rounded-3xl p-12 text-white overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
              </div>
              
              <div className="relative text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6">
                  Engagement & Transparence
                </h3>
                <p className="text-xl opacity-90 leading-relaxed mb-8">
                  Chez Bambou Glow Up, nous nous engageons à respecter scrupuleusement 
                  toutes les obligations légales et à garantir la protection de vos données 
                  dans le strict respect des lois tunisiennes.
                </p>
                
                {/* Badges de conformité */}
                <div className="flex flex-wrap justify-center gap-4">
                  {['🔐 Données sécurisées', '⚖️ Conforme loi tunisienne', '📝 Transparence totale', '🛡️ Protection garantie'].map((badge, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 text-sm font-semibold border border-white/20 transform hover:scale-105 transition-transform duration-300"
                    >
                      {badge}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Date de mise à jour */}
           
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MentionsLegales;