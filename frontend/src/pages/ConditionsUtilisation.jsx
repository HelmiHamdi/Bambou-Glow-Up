import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ConditionsUtilisation = () => {
  const conditions = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      title: "Acceptation des conditions",
      content: "L'utilisation du site Bambou Glow  implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après décrites.",
      color: "from-[#0F5B4F] to-[#1F4D3E]"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      title: "Conditions de participation",
      items: [
        "Être majeur(e) selon la législation tunisienne",
        "Fournir des informations exactes et complètes",
        "Accepter d'être photographié(e) avant et après la transformation",
        "Respecter les rendez-vous avec les praticiens"
      ],
      color: "from-[#1F4D3E] to-[#2E6653]"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      title: "Engagements des participants",
      subtitle: "Les participants s'engagent à :",
      items: [
        "Respecter les praticiens et leur équipe",
        "Suivre les conseils et traitements prescrits",
        "Informer de tout problème de santé",
        "Respecter les délais convenus"
      ],
      color: "from-[#2E6653] to-[#0F5B4F]"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      ),
      title: "Propriété des contenus",
      content: "En participant au programme, vous acceptez que Bambou Glow  utilise vos photos et témoignages à des fins promotionnelles.",
      color: "from-[#0F5B4F] to-[#2E6653]"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EFE6]">
      <Header />
      
      <main className="flex-grow py-16 pt-24">
        {/* Hero Section avec design élégant */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F5B4F]/10 to-[#2E6653]/10 transform -skew-y-2 origin-top-left"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] rounded-full mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F5B4F] mb-4">
                Conditions d'Utilisation
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Content Grid Moderne */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Introduction Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 text-center border border-gray-100">
              <p className="text-xl text-gray-700 leading-relaxed">
                Bienvenue chez <span className="font-bold text-[#0F5B4F]">Bambou Glow </span>. 
                En utilisant nos services, vous acceptez les conditions générales d'utilisation décrites ci-dessous.
              </p>
            </div>

            {/* Conditions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {conditions.map((condition, index) => (
                <div 
                  key={index}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                >
                  {/* Gradient Border Top */}
                  <div className={`h-2 bg-gradient-to-r ${condition.color}`}></div>
                  
                  <div className="p-8">
                    {/* Icon & Title */}
                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${condition.color} text-white mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        {condition.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-[#0F5B4F]">
                        {condition.title}
                      </h2>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      {condition.content && (
                        <p className="text-gray-700 leading-relaxed">
                          {condition.content}
                        </p>
                      )}
                      
                      {condition.subtitle && (
                        <p className="text-gray-600 font-medium">
                          {condition.subtitle}
                        </p>
                      )}
                      
                      {condition.items && (
                        <ul className="space-y-3">
                          {condition.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${condition.color} mt-2 mr-3 flex-shrink-0`}></div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Decorative Element */}
                    <div className={`absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-r ${condition.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-[#0F5B4F] to-[#2E6653] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Respect mutuel et confiance</h3>
                <p className="text-lg opacity-90">
                  Ces conditions ont été établies pour garantir une expérience exceptionnelle 
                  et transparente pour tous nos participants.
                </p>
                <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mt-4"></div>
              </div>
              
              <p className="text-gray-600 text-sm mt-6">
                Ces conditions peuvent être modifiées à tout moment. Les versions précédentes restent disponibles sur demande.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConditionsUtilisation;