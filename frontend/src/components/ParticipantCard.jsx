import React from "react";

const ParticipantCard = ({ 
  participant, 
  onToggleSelect, 
  onDelete, 
  isAdmin = false,
  isLoading = false 
}) => {
  const {
    _id,
    firstName,
    lastName,
    email,
    phone,
    age,
    city,
    description,
    imageUrl,
    selected,
    status,
    createdAt,
  } = participant;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "rejected":
        return "Rejeté";
      default:
        return "En attente";
    }
  };

  // 🎨 Liste des dégradés doux & attractifs
  const gradients = [
    "from-blue-500 to-blue-700",
    "from-pink-400 to-pink-600",
    "from-purple-500 to-purple-700",
    "from-cyan-400 to-cyan-600",
    "from-emerald-400 to-emerald-600",
    "from-orange-400 to-orange-600",
  ];

  // ✔️ Gradient choisi UNE seule fois (pas d'impure function dans un render)
  const [gradient] = React.useState(() => {
    const index = Math.floor(Math.random() * gradients.length);
    return gradients[index];
  });

  return (
    <div className={`w-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 ${isLoading ? 'opacity-50' : ''}`}>

      {/* HEADER AVEC COULEUR ALÉATOIRE */}
      <div className={`bg-gradient-to-br ${gradient} p-10 relative`}>

        {/* Avatar (agrandi + cercle plus large) */}
        {imageUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={imageUrl}
              alt={`${firstName} ${lastName}`}
              className="w-50 h-80 rounded-full border-4 border-white shadow-xl object-cover"
            />
          </div>
        )}

        {/* Nom */}
        <h3 className="text-center text-white text-2xl font-bold">
          {firstName} {lastName}
        </h3>

        <p className="text-center text-white/80 text-sm">
          {getStatusText(status)}
        </p>
      </div>

      {/* BODY DES INFORMATIONS */}
      <div className="p-6 space-y-4">

      {/* Email */}
{email && (
  <div className="flex flex-wrap items-start gap-2">
    <span className="text-gray-600 font-medium w-24 flex-shrink-0">Email:</span>
    <p className="text-gray-900 break-all">{email}</p>
  </div>
)}

{/* Téléphone */}
{phone && (
  <div className="flex flex-wrap items-start gap-2">
    <span className="text-gray-600 font-medium w-24 flex-shrink-0">Téléphone:</span>
    <p className="text-gray-900 break-all">{phone}</p>
  </div>
)}

        {/* Âge */}
        {age && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 font-medium">Âge:</span>
            <p className="text-gray-900">{age} ans</p>
          </div>
        )}

        {/* Ville */}
        {city && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 font-medium">Ville:</span>
            <p className="text-gray-900">{city}</p>
          </div>
        )}

        {/* Motivation */}
        {description && (
          <div>
            <span className="text-gray-600 font-medium">Motivation :</span>
            <p className="text-gray-900 mt-1">{description}</p>
          </div>
        )}

        {/* Date */}
        <p className="text-sm text-gray-500">
          Inscrite le {formatDate(createdAt)}
        </p>
      </div>

      {/* FOOTER (Boutons Admin) */}
      {isAdmin && (
        <div className="flex justify-center gap-4 p-4 border-t bg-gray-50">

          {/* Bouton Sélection */}
          <button
            onClick={() => !isLoading && onToggleSelect(_id)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg shadow font-medium transition
              ${selected ? "bg-yellow-200 text-yellow-800" : "bg-gray-100 text-gray-700"}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isLoading ? '⏳' : (selected ? "★ Sélectionné" : "☆ Sélectionner")}
          </button>

          {/* Bouton Supprimer */}
          <button
            onClick={() => !isLoading && onDelete(_id)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg bg-red-200 text-red-700 shadow transition
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-300 hover:scale-105'}`}
          >
            {isLoading ? '⏳' : '🗑️ Supprimer'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantCard;