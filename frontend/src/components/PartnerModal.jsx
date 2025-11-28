// components/PartnerModal.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const PartnerModal = ({ isOpen, onClose, partner = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    address: '',
    description: '',
    website: '',
    services: '',
    isActive: true
  });
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || '',
        specialty: partner.specialty || '',
        phone: partner.phone || '',
        address: partner.address || '',
        description: partner.description || '',
        website: partner.website || '',
        services: partner.services?.join(', ') || '',
        isActive: partner.isActive !== undefined ? partner.isActive : true
      });
      setPreviewUrl(partner.photoUrl || '');
    } else {
      resetForm();
    }
  }, [partner]);

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      phone: '',
      address: '',
      description: '',
      website: '',
      services: '',
      isActive: true
    });
    setPhoto(null);
    setPreviewUrl('');
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          photo: 'Type de fichier non autorisé. Formats acceptés: JPEG, JPG, PNG, WEBP'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          photo: 'Fichier trop volumineux. Taille maximale: 5MB'
        }));
        return;
      }

      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          submitData.append(key, formData[key]);
        }
      });

      // Ajouter la photo si elle existe
      if (photo) {
        submitData.append('photo', photo);
      }

      let response;
      if (partner) {
        // Modification
        response = await API.put(`/partners/${partner._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Création
        response = await API.post('/partners', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response?.data?.errors) {
        // Convert array errors to object
        const errorObj = {};
        error.response.data.errors.forEach(err => {
          const field = err.path || 'general';
          errorObj[field] = err.msg;
        });
        setErrors(errorObj);
      } else {
        setErrors({ general: error.response?.data?.message || 'Une erreur est survenue' });
      }
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreviewUrl('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {partner ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photo du partenaire
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats: JPEG, JPG, PNG, WEBP. Max: 5MB
                </p>
                {errors.photo && (
                  <p className="text-red-600 text-xs mt-1">{errors.photo}</p>
                )}
              </div>
            </div>
          </div>

          {/* Grid de champs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom du partenaire *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nom du partenaire"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Spécialité */}
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité *
              </label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.specialty ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Spécialité"
              />
              {errors.specialty && (
                <p className="text-red-600 text-xs mt-1">{errors.specialty}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Numéro de téléphone"
              />
            </div>

            {/* Site web */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Adresse complète"
            />
          </div>

          {/* Services */}
          <div>
            <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-2">
              Services (séparés par des virgules)
            </label>
            <input
              type="text"
              id="services"
              name="services"
              value={formData.services}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Service 1, Service 2, Service 3"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Description du partenaire..."
            />
          </div>

          {/* Statut actif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Partenaire actif
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>
                {loading 
                  ? (partner ? 'Modification...' : 'Création...') 
                  : (partner ? 'Modifier' : 'Créer le partenaire')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerModal;