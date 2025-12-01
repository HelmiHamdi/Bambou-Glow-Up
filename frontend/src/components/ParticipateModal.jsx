import React, { useState } from 'react';
import API from '../api/axios';

const ParticipateModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  if (!open) return null;

  // Fonction pour afficher les toasts
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation de l'image
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Format non supporté. Utilisez JPEG, PNG ou WEBP.'
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'L\'image est trop volumineuse (max 5MB).'
        }));
        return;
      }

      setImage(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Créer une preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Champs obligatoires selon vos besoins
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!/^[+]?[\d\s\-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!image) {
      newErrors.image = 'La photo est obligatoire';
    }

    // Validation optionnelle pour l'âge
    if (formData.age) {
      const age = parseInt(formData.age);
      if (age < 16 || age > 80) {
        newErrors.age = 'L\'âge doit être entre 16 et 80 ans';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      
      // Ajouter les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (formData[key]) { // N'envoyer que les champs remplis
          submitData.append(key, formData[key]);
        }
      });
      
      // Ajouter l'image si elle existe
      if (image) {
        submitData.append('image', image);
      }

      const response = await API.post('/participants', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '',
          city: '',
          description: ''
        });
        setImage(null);
        setImagePreview(null);
        
        // Fermer le modal après 3 secondes
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      
      // CORRECTION : Gestion améliorée de l'erreur 409
      if (error.response?.status === 409) {
        const errorMessage = error.response.data?.message || 'Cet email est déjà inscrit à notre plateforme. Veuillez utiliser un autre email.';
        
        // Afficher l'erreur dans le champ email
        setErrors(prev => ({
          ...prev,
          email: errorMessage
        }));
        
        // Afficher le toast
        showToast(errorMessage, 'error');
      } 
      // Gestion des erreurs de validation du backend
      else if (error.response?.status === 400) {
        // Si le backend renvoie des erreurs structurées
        if (error.response.data?.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.includes('email')) backendErrors.email = err;
            else if (err.includes('prénom')) backendErrors.firstName = err;
            else if (err.includes('nom')) backendErrors.lastName = err;
            else if (err.includes('téléphone')) backendErrors.phone = err;
          });
          setErrors(backendErrors);
        } 
        // Si le backend renvoie un message simple
        else if (error.response.data?.message) {
          setErrors({ submit: error.response.data.message });
          showToast(error.response.data.message, 'error');
        }
      }
      // Erreur réseau ou autre
      else {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        setErrors({ submit: errorMessage });
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      // Reset form when closing
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        city: '',
        description: ''
      });
      setImage(null);
      setImagePreview(null);
      setErrors({});
      setSuccess(false);
      setToast({ show: false, message: '', type: '' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" onClick={handleClose}>
      {/* Toast Notification - Amélioré pour mobile */}
      {toast.show && (
        <div className={`fixed top-2 left-2 right-2 sm:top-4 sm:right-4 sm:left-auto z-60 p-4 rounded-lg shadow-lg max-w-sm mx-auto sm:mx-0 ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2 flex-shrink-0">
              {toast.type === 'error' ? '❌' : '✅'}
            </span>
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className="ml-4 text-white hover:text-gray-200 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div 
        className="bg-white w-full max-w-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Fixe */}
        <div className="bg-primary-500 text-white p-4 sm:p-6 flex-shrink-0 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold">
              {success ? '🎉 Félicitations !' : 'Participer Maintenant'}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl sm:text-3xl"
              disabled={loading}
            >
              ×
            </button>
          </div>
          <p className="text-primary-100 mt-2 text-sm sm:text-base">
            {success 
              ? 'Votre participation a été enregistrée avec succès !' 
              : 'Rejoignez l\'aventure Bambou Glow '
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="text-center">
              <div className="text-green-500 text-4xl sm:text-6xl mb-4">✅</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Merci pour votre participation !
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Un email de confirmation vous a été envoyé. Nous vous contacterons si vous êtes sélectionnée.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-left">
                <p className="text-green-800 text-xs sm:text-sm">
                  <strong>Prochaine étape :</strong> Notre équipe examine toutes les candidatures. 
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire - STRUCTURE DIFFÉRENTE POUR MOBILE ET DESKTOP */}
        {!success && (
          <>
            {/* Version Mobile - Tout défile */}
            <div className="flex-1 overflow-y-auto sm:hidden">
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Informations Personnelles
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="Votre nom"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.email ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="+216 XX XXX XXX"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Âge
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.age ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="25"
                        min="16"
                        max="80"
                      />
                      {errors.age && (
                        <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Votre ville"
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-300'
                  }`}>
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-24 w-24 object-cover rounded-lg"
                        />
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 px-3 py-1 border border-red-300 rounded-md"
                          >
                            Changer la photo
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-gray-400 text-2xl">📷</div>
                        <p className="text-gray-600 text-sm">
                          Cliquez pour sélectionner votre photo
                        </p>
                        <p className="text-gray-500 text-xs">
                          JPEG, PNG, WEBP - Max 5MB
                        </p>
                        <label className="inline-flex items-center px-3 py-2 text-xs border border-primary-500 text-primary-600 rounded-md font-medium cursor-pointer transition-colors hover:bg-primary-50">
                          Choisir une photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pourquoi souhaitez-vous un relooking ?
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                      errors.description ? 'border-red-500 ring-2 ring-red-200' : ''
                    }`}
                    placeholder="Partagez votre histoire, vos motivations et ce que cette transformation représenterait pour vous..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    {formData.description.length}/1000 caractères
                  </p>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-xs">{errors.submit}</p>
                  </div>
                )}

                {/* Actions MOBILE - Dans le flux de défilement */}
                <div className="border-t border-gray-200 bg-white pt-6">
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium transition-colors hover:bg-gray-50 disabled:opacity-50 text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={handleSubmit}
                      className="px-4 py-3 bg-primary-500 text-white rounded-md font-medium transition-colors hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        'Participer'
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-500 text-xs text-center mt-4">
                    * Champs obligatoires
                  </p>
                  <p className="text-gray-500 text-xs text-center mt-2">
                    En participant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                  </p>
                </div>
              </form>
            </div>

            {/* Version Desktop - Structure originale avec boutons fixes */}
            <div className="hidden sm:flex flex-1 overflow-hidden flex-col">
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Informations Personnelles
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.firstName ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="Votre prénom"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.lastName ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="Votre nom"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.email ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.phone ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="+216 XX XXX XXX"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Âge
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.age ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="25"
                          min="16"
                          max="80"
                        />
                        {errors.age && (
                          <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Votre ville"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-300'
                    }`}>
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-lg"
                          />
                          <div className="flex justify-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                              }}
                              className="text-sm text-red-500 hover:text-red-700"
                            >
                              Changer la photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-gray-400 text-4xl mb-2">📷</div>
                          <p className="text-gray-600 mb-2">
                            Glissez-déposez votre photo ou cliquez pour parcourir
                          </p>
                          <p className="text-gray-500 text-sm mb-4">
                            JPEG, PNG, WEBP - Max 5MB
                          </p>
                          <label className="inline-flex items-center px-4 py-2 border border-primary-500 text-primary-600 rounded-md font-medium cursor-pointer transition-colors hover:bg-primary-50">
                            Choisir une photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourquoi souhaitez-vous un relooking ?
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                        errors.description ? 'border-red-500 ring-2 ring-red-200' : ''
                      }`}
                      placeholder="Partagez votre histoire, vos motivations et ce que cette transformation représenterait pour vous..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.description.length}/1000 caractères
                    </p>
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{errors.submit}</p>
                    </div>
                  )}
                </form>
              </div>

              {/* Actions DESKTOP - Fixes en bas */}
              <div className="border-t border-gray-200 bg-white p-6 flex-shrink-0 rounded-b-lg">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-md font-medium transition-colors hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      'Participer'
                    )}
                  </button>
                </div>
                
                <p className="text-gray-500 text-xs text-center mt-4">
                  * Champs obligatoires
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  En participant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParticipateModal;