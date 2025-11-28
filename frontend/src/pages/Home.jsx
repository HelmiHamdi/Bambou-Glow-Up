import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticipateModal from "../components/ParticipateModal.jsx";
import DoctorCard from "../components/DoctorCard";
import { Link } from "react-router-dom";
import API from "../api/axios";
import QuoteModal from "../components/QuoteModal.jsx";
import img1 from "/src/assets/femme0.png";
import img2 from "/src/assets/femme1.png";
import img3 from "/src/assets/femme2.png";

const Home = () => {
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    participants: 0,
    partners: 0,
    transformations: 0,
  });

  const [showQuoteModal, setShowQuoteModal] = useState(false);

  useEffect(() => {
    fetchPartners();
    fetchStats();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await API.get("/partners?active=true");
      setPartners(response.data.partners || []);
    } catch (error) {
      console.error("Erreur chargement partenaires:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Stats simulées pour l'instant
    setStats({
      participants: 1247,
      partners: 23,
      transformations: 89,
    });
  };

  const features = [
    {
      icon: "🎯",
      title: "Sélection Rigoureuse",
      description:
        "Notre équipe sélectionne les candidates avec soin pour garantir des transformations authentiques.",
    },
    {
      icon: "👥",
      title: "Experts Qualifiés",
      description:
        "Collaborez avec les meilleurs professionnels du bien-être et de la beauté en Tunisie.",
    },
    {
      icon: "📸",
      title: "Suivi Complet",
      description:
        "Votre transformation est documentée et partagée pour inspirer d'autres personnes.",
    },
    {
      icon: "🎁",
      title: "100% Gratuit",
      description:
        "Participez gratuitement et tentez de remporter une transformation complète.",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Inscription",
      description:
        "Remplissez le formulaire de participation en partageant votre histoire.",
    },
    {
      step: 2,
      title: "Sélection",
      description:
        "Notre jury sélectionne les candidates qui correspondent le mieux au projet.",
    },
    {
      step: 3,
      title: "Transformation",
      description:
        "Suivez un parcours personnalisé avec nos experts partenaires.",
    },
    {
      step: 4,
      title: "Révélation",
      description:
        "Découvrez votre nouvelle image et partagez votre expérience.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section id="accueil" className="bg-[#F7EFE6] py-16 pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Image en premier sur mobile, à droite sur desktop */}
              <div className="order-1 lg:order-2 flex justify-center">
                <img
                  src="/src/assets/femme0.png"
                  alt="Glow Up"
                  className="w-full max-w-2xl object-cover" 
                />
              </div>

              {/* Texte en second sur mobile, à gauche sur desktop */}
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                  Vivez la transformation<br />
                  <span className="text-[#0F5B4F]">ultime</span>
                </h1>

                <h2 className="text-3xl md:text-4xl font-semibold text-[#0F5B4F] mb-6">
                  Bamboo Glow Up Experience
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowParticipateModal(true)}
                    className="bg-[#0F5B4F] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#0a4037] transition"
                  >
                    Participer à l'émission
                  </button>

                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="bg-white border border-[#0F5B4F] text-[#0F5B4F] px-6 py-3 rounded-lg text-lg hover:bg-[#0F5B4F] hover:text-white transition"
                  >
                    Demander un devis
                  </button>
                </div>

                {/* Paragraphe ajouté après les boutons */}
                <p className="text-gray-600 mt-6 text-lg max-w-xl mx-auto lg:mx-0">
                  Pour garantir la sécurité et l'excellence des résultats, l'agence Bamboo Glow Up a sélectionné des praticiens reconnus pour leur savoir-faire technique et leur respect des normes internationales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="animate-slide-up">
                <div className="text-4xl font-bold text-primary-500 mb-2">
                  {stats.participants}+
                </div>
                <div className="text-gray-600">Participants</div>
              </div>
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="text-4xl font-bold text-primary-500 mb-2">
                  {stats.partners}
                </div>
                <div className="text-gray-600">Experts Partenaires</div>
              </div>
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="text-4xl font-bold text-primary-500 mb-2">
                  {stats.transformations}+
                </div>
                <div className="text-gray-600">Transformations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir Bambou Glow Up ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Une expérience unique qui va bien au-delà d'un simple relooking
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card p-6 text-center hover:transform hover:-translate-y-2 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comment Participer ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                4 étapes simples pour tenter de vivre une transformation
                complète
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-primary-200 -z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Preview Section */}
        <section id="praticiens" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Rencontrez Nos Experts
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Des professionnels passionnés qui vous accompagnent dans votre
                transformation
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="loading-spinner"></div>
                <span className="ml-3 text-gray-600">
                  Chargement des experts...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partners.slice(0, 6).map((partner) => (
                  <div key={partner._id} className="border-4 border-[#1F4D3E] rounded-xl overflow-hidden">
                    <DoctorCard partner={partner} />
                  </div>
                ))}
              </div>
            )}

            {partners.length > 6 && (
              <div className="text-center mt-12">
                <Link
                  to="/partners"
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  Découvrir Tous Nos Experts ({partners.length})
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Before/After Section */}
        <section id="beforeafter" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Avant / Après
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Découvrez les transformations inspirantes de nos précédentes candidates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[img1, img2, img3].map((image, index) => (
                <div key={index} className="card overflow-hidden group">
                  <div className="relative h-[350px] rounded-xl overflow-hidden bg-white p-4 border-4 border-[#1F4D3E]">
                    <img
                      src={image}
                      alt={`Transformation ${index + 1}`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prête à Révéler Votre Beauté ?
            </h2>
            <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
              Ne laissez pas passer cette opportunité unique de transformation.
              Inscrivez-vous maintenant 
            </p>
            <button
              onClick={() => setShowParticipateModal(true)}
              className="btn btn-accent text-lg px-8 py-4"
            >
              🎁 Participer Gratuitement
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Participate Modal */}
      <ParticipateModal
        open={showParticipateModal}
        onClose={() => setShowParticipateModal(false)}
      />
      <QuoteModal
        open={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
      />
    </div>
  );
};

export default Home;