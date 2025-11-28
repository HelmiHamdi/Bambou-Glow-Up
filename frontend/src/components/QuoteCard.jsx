// components/QuoteCard.js
import React, { useState } from "react";

const QuoteCard = ({ quote, onDelete, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        gradient: 'from-amber-400 to-orange-500',
        glow: 'shadow-amber-200',
        icon: '⏳'
      },
      contacted: { 
        gradient: 'from-blue-400 to-cyan-500',
        glow: 'shadow-blue-200',
        icon: '💬'
      },
      treated: { 
        gradient: 'from-emerald-400 to-green-500',
        glow: 'shadow-emerald-200',
        icon: '✅'
      }
    };
    return config[status] || config.pending;
  };

  const statusConfig = getStatusConfig(quote.status);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Effet de brillance au survol */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${statusConfig.gradient} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 ${
        isHovered ? 'scale-105' : 'scale-100'
      }`}></div>
      
      {/* Carte principale */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-3xl">
        
        {/* Header avec gradient animé */}
        <div className={`bg-gradient-to-r ${statusConfig.gradient} p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex justify-between items-start">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">
                {quote.firstName} {quote.lastName}
              </h3>
              <p className="text-white/80 text-sm font-light">
                {formatDate(quote.createdAt)}
              </p>
            </div>
            
            {/* Badge de statut premium */}
            <div className={`flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 shadow-lg`}>
              <span className="text-lg">{statusConfig.icon}</span>
              <span className="text-white font-semibold text-sm capitalize">
                {quote.status}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-6 space-y-6">
          
          {/* Grille d'informations avec icônes animées */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { icon: '📧', value: quote.email, type: 'email' },
              { icon: '📱', value: quote.phone, type: 'phone' },
              { icon: '🌍', value: `${quote.country}${quote.city ? `, ${quote.city}` : ''}`, type: 'location' },
              { icon: '💰', value: `${quote.budget} DT`, type: 'budget', highlight: true }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm mr-3">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <span className={`text-sm ${item.highlight ? 'font-bold text-green-600' : 'text-gray-700'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Services avec tags animés */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Services demandés
            </h4>
            <div className="flex flex-wrap gap-2">
              {quote.services.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Dates disponibles avec design amélioré */}
          {quote.availableDates && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
              <h4 className="text-sm font-semibold text-amber-900 mb-2 flex items-center">
                <span className="mr-2">📅</span>
                Dates disponibles
              </h4>
              <p className="text-sm text-amber-700 font-medium">{quote.availableDates}</p>
            </div>
          )}

          {/* Galerie de photos améliorée */}
          {quote.photos && quote.photos.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Galerie photos
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {quote.photos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="relative group/image aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer"
                    onClick={() => window.open(photo.url, '_blank')}
                  >
                    <img
                      src={photo.url}
                      alt={`Référence ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                      onLoad={() => setImageLoading(prev => ({ ...prev, [index]: true }))}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover/image:opacity-100 transform translate-y-4 group-hover/image:translate-y-0 transition-all duration-300">
                        <span className="text-white text-2xl">👁️</span>
                      </div>
                    </div>
                    {!imageLoading[index] && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barre d'actions premium */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200/50 space-y-4 sm:space-y-0">
            <div className="flex space-x-3">
              <button
                onClick={() => window.open(`mailto:${quote.email}`)}
                className="inline-flex items-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2 text-lg">✉️</span>
                Répondre par email
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(quote.phone);
                  // Vous pouvez ajouter un toast de confirmation ici
                }}
                className="inline-flex items-center px-5 py-3 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-300"
              >
                <span className="mr-2 text-lg">📞</span>
                Copier le numéro
              </button>
            </div>

            <button
              onClick={() => onDelete(quote._id)}
              disabled={isLoading}
              className="inline-flex items-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Suppression en cours...
                </>
              ) : (
                <>
                  <span className="mr-2 text-lg">🗑️</span>
                  Supprimer la demande
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;