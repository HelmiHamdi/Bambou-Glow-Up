// components/PartnerCard.jsx
import React, { useState } from "react";

const PartnerCard = ({ partner, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="bg-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden flex border border-gray-200">
      
      {/* IMAGE */}
      <div className="w-40 h-40 flex-shrink-0">
        {partner.photoUrl && !imageError ? (
          <img
            src={partner.photoUrl}
            alt={partner.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-l-2xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-400 rounded-l-2xl">
            <span className="text-3xl font-extrabold text-white">
              {getInitials(partner.name)}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-3">

          {/* NOM + STATUS */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-indigo-700">
              {partner.name}
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                partner.isActive
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {partner.isActive ? "Actif" : "Inactif"}
            </span>
          </div>

          {/* SPECIALITÉ */}
          <p className="text-pink-600 font-medium">{partner.specialty}</p>

          {/* RATING */}
          {partner.rating && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < partner.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-teal-600">
                ({partner.rating}/5)
              </span>
            </div>
          )}

          {/* DESCRIPTION */}
          {partner.description && (
            <p className="text-gray-700 text-sm line-clamp-3">
              {partner.description}
            </p>
          )}

          {/* CONTACT */}
          <div className="space-y-1 pt-2 text-sm text-gray-800">
            {partner.phone && <p>📞 {partner.phone}</p>}
            {partner.email && <p>✉️ {partner.email}</p>}
            {partner.address && <p>📍 {partner.address}</p>}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="text-teal-500 hover:underline"
              >
                🌐 Site web
              </a>
            )}
          </div>

          {/* SOCIAL MEDIA */}
          {(partner.socialMedia?.facebook ||
            partner.socialMedia?.instagram ||
            partner.socialMedia?.twitter) && (
            <div className="flex gap-3 text-sm pt-1">
              {partner.socialMedia.facebook && (
                <a href={partner.socialMedia.facebook} target="_blank">📘</a>
              )}
              {partner.socialMedia.instagram && (
                <a href={partner.socialMedia.instagram} target="_blank">📸</a>
              )}
              {partner.socialMedia.twitter && (
                <a href={partner.socialMedia.twitter} target="_blank">🐦</a>
              )}
            </div>
          )}

          {/* SERVICES */}
          {partner.services?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {partner.services.map((s, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-300">
          <span className="text-xs text-gray-500">
            Ajouté le {new Date(partner.createdAt).toLocaleDateString("fr-FR")}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(partner)}
              className="px-4 py-2 text-xs rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
            >
              Modifier
            </button>

            <button
              onClick={() => onDelete(partner._id)}
              className="px-4 py-2 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              Supprimer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartnerCard;
