import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PolitiqueConfidentialite = () => {
  const privacySections = [
    {
      icon: "🔒",
      title: "Introduction",
      description: "Bambou Glow Up s'engage à protéger la vie privée de ses utilisateurs. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles.",
      gradient: "linear-gradient(135deg, #0F5B4F 0%, #1F4D3E 100%)"
    },
    {
      icon: "📊",
      title: "Données collectées",
      items: [
        "Nom et prénom",
        "Adresse email", 
        "Numéro de téléphone",
        "Photos avant/après transformation",
        "Informations de santé nécessaires au traitement"
      ],
      gradient: "linear-gradient(135deg, #1F4D3E 0%, #2E6653 100%)"
    },
    {
      icon: "🎯",
      title: "Utilisation des données",
      subtitle: "Vos données sont utilisées pour :",
      items: [
        "Gérer votre participation au programme",
        "Vous contacter concernant votre transformation",
        "Améliorer nos services",
        "Respecter nos obligations légales"
      ],
      gradient: "linear-gradient(135deg, #2E6653 0%, #0F5B4F 100%)"
    },
    {
      icon: "⚖️",
      title: "Vos droits",
      subtitle: "Vous disposez des droits suivants :",
      items: [
        "Droit d'accès à vos données",
        "Droit de rectification",
        "Droit à l'effacement", 
        "Droit à la limitation du traitement"
      ],
      gradient: "linear-gradient(135deg, #0F5B4F 0%, #2E6653 100%)"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F7EFE6] via-white to-[#F0E6D6]">
      <Header />
      
      <main className="flex-grow py-8 md:py-16 pt-20 md:pt-24">
        {/* Hero Section avec animation */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5B4F]/10 to-[#2E6653]/10 transform -skew-y-2 origin-top-left"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-[#0F5B4F] to-[#2E6653] rounded-2xl md:rounded-3xl mb-6 md:mb-8 shadow-2xl animate-float">
                <span className="text-3xl md:text-4xl">🛡️</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0F5B4F] mb-4 md:mb-6 leading-tight">
                Politique de <span className="text-[#2E6653] block md:inline">Confidentialité</span>
              </h1>
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                Votre vie privée est notre priorité. Découvrez comment nous protégeons vos données.
              </p>
              <div className="flex justify-center space-x-3">
                {[1, 2, 3].map((dot) => (
                  <div 
                    key={dot}
                    className="w-2 h-2 bg-[#0F5B4F] rounded-full animate-pulse"
                    style={{ animationDelay: `${dot * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Design moderne et responsive */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Grid avec cartes modernes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
              {privacySections.map((section, index) => (
                <div 
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 border border-white/20 overflow-hidden"
                >
                  {/* Background décoratif */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-full -translate-y-16 md:-translate-y-20 translate-x-16 md:translate-x-20"
                    style={{ background: section.gradient }}
                  ></div>
                  
                  <div className="relative p-6 md:p-8">
                    {/* En-tête avec icône */}
                    <div className="flex items-start space-x-4 md:space-x-5 mb-4 md:mb-6">
                      <div 
                        className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-xl md:text-2xl text-white shadow-lg transform group-hover:scale-105 md:group-hover:scale-110 transition-transform duration-300"
                        style={{ background: section.gradient }}
                      >
                        {section.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl md:text-2xl font-bold text-[#0F5B4F] mb-2 md:mb-3 leading-tight">
                          {section.title}
                        </h2>
                        <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] rounded-full"></div>
                      </div>
                    </div>

                    {/* Contenu */}
                    {section.description && (
                      <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                        {section.description}
                      </p>
                    )}

                    {section.subtitle && (
                      <p className="text-gray-600 font-semibold mb-3 md:mb-4 text-base md:text-lg">
                        {section.subtitle}
                      </p>
                    )}

                    {section.items && (
                      <div className="space-y-2 md:space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <div 
                            key={itemIndex}
                            className="flex items-center p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg md:rounded-xl border border-gray-100 hover:border-[#0F5B4F]/20 transition-all duration-300 group/item"
                          >
                            <div 
                              className="w-2 h-2 rounded-full mr-3 md:mr-4 flex-shrink-0 transform group-hover/item:scale-125 md:group-hover/item:scale-150 transition-transform duration-300"
                              style={{ background: section.gradient }}
                            ></div>
                            <span className="text-gray-700 font-medium text-sm md:text-base break-words">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Effet de bordure animée */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  ></div>
                </div>
              ))}
            </div>

            {/* Section d'engagement sécurité */}
            <div className="relative bg-gradient-to-br from-[#0F5B4F] to-[#2E6653] rounded-2xl md:rounded-3xl p-6 md:p-12 text-white overflow-hidden mb-8 md:mb-12">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-6 md:top-10 left-6 md:left-10 w-12 h-12 md:w-20 md:h-20 bg-white rounded-full"></div>
                <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 w-20 h-20 md:w-32 md:h-32 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 bg-white rounded-full"></div>
              </div>
              
              <div className="relative text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-white/20 rounded-xl md:rounded-2xl mb-6 md:mb-8 backdrop-blur-sm">
                  <span className="text-2xl md:text-4xl">💎</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                  Notre Engagement Sécurité
                </h3>
                <p className="text-base md:text-xl opacity-90 leading-relaxed mb-6 md:mb-8 px-4">
                  Nous mettons en œuvre les mesures techniques et organisationnelles les plus strictes 
                  pour garantir la sécurité et la confidentialité de vos données personnelles.
                </p>
                
                {/* Indicateurs de sécurité */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-2xl mx-auto">
                  {[
                    { icon: "🔐", label: "Chiffrement", desc: "Données cryptées" },
                    { icon: "🛡️", label: "Protection", desc: "Accès sécurisé" },
                    { icon: "📜", label: "Conformité", desc: "Loi tunisienne" },
                    { icon: "👁️", label: "Transparence", desc: "Contrôle total" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20 transform hover:scale-105 transition-transform duration-300"
                    >
                      <div className="text-xl md:text-2xl mb-1 md:mb-2">{feature.icon}</div>
                      <div className="font-semibold text-xs md:text-sm mb-1">{feature.label}</div>
                      <div className="text-xs opacity-80 leading-tight">{feature.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section contact confidentiel */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-6 md:p-8 text-center border border-gray-100">
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#0F5B4F] to-[#2E6653] rounded-xl md:rounded-2xl mb-4 md:mb-6">
                  <span className="text-xl md:text-2xl text-white">📧</span>
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-[#0F5B4F] mb-3 md:mb-4 leading-tight">
                  Questions sur la confidentialité ?
                </h4>
                <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
                  Notre équipe dédiée à la protection des données est à votre écoute
                </p>
                <div className="bg-gradient-to-r from-[#0F5B4F]/5 to-[#2E6653]/5 rounded-xl md:rounded-2xl p-4 md:p-6 inline-block max-w-full">
                  <p className="text-[#0F5B4F] font-semibold text-base md:text-lg break-all md:break-normal">
                    contact@bambou.tn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;