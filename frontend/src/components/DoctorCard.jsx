import React from "react";
import { MapPin, PhoneCall, Star } from "lucide-react";

const DoctorCard = ({ partner }) => {
  const { name, specialty, photoUrl, phone, address, rating, description } = partner;

  return (
    <div
      className="
        bg-white border border-gray-200 
        shadow-md hover:shadow-xl 
        transition-all duration-300 
        rounded-lg
        max-w-sm w-full
        hover:-translate-y-1
      "
    >
      {/* IMAGE FULL WIDTH & COMPLETE */}
      <div className="w-150 h-60 bg-gray-50 rounded-t-lg flex items-center justify-center overflow-hidden">
        <img
          src={photoUrl}
          alt={name}
          className="
            w-full h-full
            object-contain
            p-2
            transition-transform duration-700
            hover:scale-[1.03]
          "
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">

        {/* NAME + STAR */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>

          <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-sm font-semibold">
            <Star className="w-4 h-4 mr-1 fill-yellow-500" />
            {rating}
          </div>
        </div>

        {/* SPECIALTY */}
        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-semibold mb-2">
          {specialty}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {description ||
            `Expert en ${specialty?.toLowerCase()} avec une approche professionnelle.`}
        </p>

        {/* CONTACT - SAME LINE */}
        <div className="grid grid-cols-2 gap-3">

          {/* PHONE */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md hover:bg-green-50 transition">
            <div className="w-9 h-9 bg-green-500 rounded-md flex items-center justify-center shadow-sm">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700 truncate">
              {phone}
            </span>
          </div>

          {/* ADDRESS */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md hover:bg-yellow-50 transition">
            <div className="w-9 h-9 bg-yellow-500 rounded-md flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700 line-clamp-2">
              {address}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
