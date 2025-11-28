import React, { useState, useRef, useEffect } from "react";
import API from "../api/axios";

const QuoteModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    services: [],
    budget: "",
    availableDates: "",
    phone: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // États pour le calendrier amélioré
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState('days');
  const calendarRef = useRef(null);

  // Fermer le calendrier quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
        setCalendarView('days');
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  if (!open) return null;

  // Fonction pour afficher les toasts
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Fonctions pour le calendrier amélioré
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatDateForDisplay = (dates) => {
    if (dates.length === 0) return "";
    
    const dateGroups = {};
    dates.forEach(dateStr => {
      const date = new Date(dateStr);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!dateGroups[key]) {
        dateGroups[key] = [];
      }
      dateGroups[key].push(date.getDate());
    });

    const formattedGroups = Object.keys(dateGroups).map(key => {
      const [year, month] = key.split('-');
      const monthName = new Date(parseInt(year), parseInt(month)).toLocaleDateString('fr-FR', { month: 'long' });
      const days = dateGroups[key].sort((a, b) => a - b);
      
      if (days.length > 3) {
        return `${days[0]}-${days[days.length - 1]} ${monthName} ${year}`;
      } else {
        return `${days.join(', ')} ${monthName} ${year}`;
      }
    });

    return formattedGroups.join('; ');
  };

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const newSelectedDates = selectedDates.includes(dateString)
      ? selectedDates.filter(d => d !== dateString)
      : [...selectedDates, dateString].sort();
    
    setSelectedDates(newSelectedDates);
    
    const formattedDates = formatDateForDisplay(newSelectedDates);
    setFormData(prev => ({
      ...prev,
      availableDates: formattedDates
    }));
  };

  const isDateSelected = (date) => {
    return selectedDates.includes(date.toISOString().split('T')[0]);
  };

  const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isTodayDate = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const navigateYear = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(prev.getFullYear() + direction);
      return newMonth;
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const generateMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(new Date(currentMonth.getFullYear(), i, 1));
    }
    return months;
  };

  const generateYears = () => {
    const years = [];
    const currentYear = currentMonth.getFullYear();
    const startYear = currentYear - 6;
    
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return years;
  };

  const handleMonthSelect = (monthDate) => {
    setCurrentMonth(monthDate);
    setCalendarView('days');
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setCalendarView('months');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Le pays est obligatoire';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!/^[+]?[\d\s\-()]{8,}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Le budget est obligatoire';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Sélectionnez au moins un service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast("Veuillez corriger les erreurs dans le formulaire", "error");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      
      // Ajouter les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (key === 'services') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await API.post('/quotes', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          country: "",
          city: "",
          services: [],
          budget: "",
          availableDates: "",
          phone: "",
          email: ""
        });
        setSelectedDates([]);
        
        setTimeout(() => {
          setSuccess(false);
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur soumission devis:', error);
      
      if (error.response?.status === 400) {
        if (error.response.data?.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            if (err.includes('prénom')) backendErrors.firstName = err;
            else if (err.includes('nom')) backendErrors.lastName = err;
            else if (err.includes('email')) backendErrors.email = err;
            else if (err.includes('téléphone')) backendErrors.phone = err;
            else if (err.includes('budget')) backendErrors.budget = err;
          });
          setErrors(backendErrors);
        } else if (error.response.data?.message) {
          setErrors({ submit: error.response.data.message });
          showToast(error.response.data.message, 'error');
        }
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'envoi du devis. Veuillez réessayer.';
        setErrors({ submit: errorMessage });
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: "",
        lastName: "",
        country: "",
        city: "",
        services: [],
        budget: "",
        availableDates: "",
        phone: "",
        email: ""
      });
      setSelectedDates([]);
      setErrors({});
      setSuccess(false);
      setToast({ show: false, message: '', type: '' });
      setCalendarView('days');
      onClose();
    }
  };

  const calendarDays = generateCalendarDays();
  const months = generateMonths();
  const years = generateYears();
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const year = currentMonth.getFullYear();

  // Composant Calendrier Amélioré
  const EnhancedCalendar = () => (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-full max-w-md">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => calendarView === 'days' ? navigateMonth(-1) : calendarView === 'months' ? navigateYear(-1) : navigateYear(-12)}
            className="p-2 hover:bg-primary-400 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => {
              if (calendarView === 'days') setCalendarView('months');
              else if (calendarView === 'months') setCalendarView('years');
            }}
            className="font-semibold text-lg hover:bg-primary-400 px-3 py-1 rounded-lg transition-colors"
          >
            {calendarView === 'days' && monthName}
            {calendarView === 'months' && year}
            {calendarView === 'years' && `${years[0]} - ${years[years.length - 1]}`}
          </button>
          
          <button
            type="button"
            onClick={() => calendarView === 'days' ? navigateMonth(1) : calendarView === 'months' ? navigateYear(1) : navigateYear(12)}
            className="p-2 hover:bg-primary-400 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {selectedDates.length > 0 && calendarView === 'days' && (
          <div className="text-sm bg-primary-400 bg-opacity-30 rounded-lg p-2">
            <span className="font-medium">{selectedDates.length} date(s) sélectionnée(s)</span>
          </div>
        )}
      </div>

      {calendarView === 'days' && (
        <>
          <div className="grid grid-cols-7 gap-1 p-3 bg-gray-50 border-b">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 p-3">
            {calendarDays.map((date, index) => {
              const isSelected = date && isDateSelected(date);
              const isToday = date && isTodayDate(date);
              const isPast = date && isDateInPast(date);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => date && !isPast && handleDateSelect(date)}
                  disabled={!date || isPast}
                  className={`
                    h-10 rounded-lg text-sm font-medium transition-all duration-200
                    ${!date ? 'invisible' : ''}
                    ${isPast 
                      ? 'text-gray-300 cursor-not-allowed bg-gray-100' 
                      : isSelected
                        ? 'bg-primary-500 text-white shadow-md transform scale-105'
                        : isToday
                          ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                          : 'text-gray-700 hover:bg-primary-100 hover:text-primary-700 hover:shadow-sm'
                    }
                    ${date && !isPast ? 'hover:scale-110' : ''}
                  `}
                >
                  {date ? (
                    <div className="flex flex-col items-center justify-center">
                      <span>{date.getDate()}</span>
                      {isToday && !isSelected && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  ) : ''}
                </button>
              );
            })}
          </div>
        </>
      )}

      {calendarView === 'months' && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {months.map((monthDate, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleMonthSelect(monthDate)}
              className="p-4 text-sm font-medium text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors border border-gray-200 hover:border-primary-300"
            >
              {monthDate.toLocaleDateString('fr-FR', { month: 'long' })}
            </button>
          ))}
        </div>
      )}

      {calendarView === 'years' && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {years.map((year, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleYearSelect(year)}
              className={`p-4 text-sm font-medium rounded-lg transition-colors border ${
                year === currentMonth.getFullYear()
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'text-gray-700 border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}

      <div className="p-3 border-t bg-gray-50 rounded-b-xl">
        {selectedDates.length > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Vos dates:
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDates([]);
                  setFormData(prev => ({ ...prev, availableDates: "" }));
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Tout effacer
              </button>
            </div>
            
            <div className="max-h-24 overflow-y-auto space-y-1">
              {selectedDates.map(date => (
                <div key={date} className="flex justify-between items-center text-xs bg-white rounded-lg p-2 border">
                  <span className="text-gray-600">{formatDate(new Date(date))}</span>
                  <button
                    type="button"
                    onClick={() => handleDateSelect(new Date(date))}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => {
                setShowCalendar(false);
                setCalendarView('days');
              }}
              className="w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
            >
              Valider les dates
            </button>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-gray-500 text-sm">
              {calendarView === 'days' 
                ? 'Sélectionnez vos dates disponibles' 
                : 'Sélectionnez une période'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      {toast.show && (
        <div className={`fixed top-4 right-4 z-60 p-4 rounded-lg shadow-lg max-w-sm ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {toast.type === 'error' ? '❌' : '✅'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast({ show: false, message: '', type: '' })}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-primary-500 text-white p-6 flex-shrink-0 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {success ? '✅ Demande envoyée !' : 'Demander un devis'}
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>
          <p className="text-primary-100 mt-2">
            {success 
              ? 'Votre demande a été envoyée avec succès !' 
              : 'Remplissez le formulaire pour recevoir votre devis personnalisé'
            }
          </p>
        </div>

        {success && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center">
              <div className="text-green-500 text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Merci pour votre demande !
              </h3>
              <p className="text-gray-600 mb-4">
                Nous avons bien reçu votre demande de devis et nous vous contacterons dans les plus brefs délais.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <p className="text-green-800 text-sm">
                  <strong>Prochaine étape :</strong> Notre équipe analysera votre demande et vous enverra un devis personnalisé par email.
                </p>
              </div>
            </div>
          </div>
        )}

        {!success && (
          <>
            {/* Version Mobile - Tout défile */}
            <div className="flex-1 overflow-y-auto sm:hidden">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
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

                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.country ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="Votre pays"
                      />
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.country}</p>
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

                  <div className="space-y-4 mt-4">
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
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services souhaités *
                  </label>
                  {errors.services && (
                    <p className="text-red-500 text-sm mb-2">{errors.services}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {["Esthétique", "Dentaire", "Cheveux", "Mode"].map((service) => (
                      <label key={service} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          value={service}
                          checked={formData.services.includes(service)}
                          onChange={(e) => {
                            const { checked, value } = e.target;
                            setFormData({
                              ...formData,
                              services: checked
                                ? [...formData.services, value]
                                : formData.services.filter((s) => s !== value),
                            });
                          }}
                          className="accent-primary-500 w-4 h-4"
                        />
                        <span className="text-sm font-medium">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget estimé (DT) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.budget ? 'border-red-500 ring-2 ring-red-200' : ''
                      }`}
                      placeholder="Ex: 1500"
                      min="0"
                      step="100"
                    />
                  </div>
                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                  )}
                </div>

                <div className="relative" ref={calendarRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dates disponibles
                  </label>
                  
                  {/* Version Mobile - Icône intégrée dans le champ */}
                  <div className="relative">
                    <input
                      type="text"
                      name="availableDates"
                      value={formData.availableDates}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                      placeholder="Sélectionnez vos dates"
                      readOnly
                      onClick={() => setShowCalendar(!showCalendar)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <span className="text-xl">📅</span>
                    </button>
                  </div>

                  {showCalendar && <EnhancedCalendar />}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Actions MOBILE - Dans le flux de défilement */}
                <div className="border-t border-gray-200 bg-white pt-6 rounded-b-lg">
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={handleSubmit}
                      className="px-4 py-3 bg-primary-500 text-white rounded-md font-medium transition-colors hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        'Demander un devis'
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-500 text-xs text-center mt-4">
                    * Champs obligatoires
                  </p>
                  <p className="text-gray-500 text-xs text-center mt-2">
                    En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
                  </p>
                </div>
              </form>
            </div>

            {/* Version Desktop - Structure originale avec boutons fixes */}
            <div className="hidden sm:flex flex-1 overflow-hidden flex-col">
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                          Pays *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            errors.country ? 'border-red-500 ring-2 ring-red-200' : ''
                          }`}
                          placeholder="Votre pays"
                        />
                        {errors.country && (
                          <p className="text-red-500 text-sm mt-1">{errors.country}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services souhaités *
                    </label>
                    {errors.services && (
                      <p className="text-red-500 text-sm mb-2">{errors.services}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {["Esthétique", "Dentaire", "Cheveux", "Mode"].map((service) => (
                        <label key={service} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            value={service}
                            checked={formData.services.includes(service)}
                            onChange={(e) => {
                              const { checked, value } = e.target;
                              setFormData({
                                ...formData,
                                services: checked
                                  ? [...formData.services, value]
                                  : formData.services.filter((s) => s !== value),
                              });
                            }}
                            className="accent-primary-500 w-4 h-4"
                          />
                          <span className="text-sm font-medium">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget estimé (DT) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          errors.budget ? 'border-red-500 ring-2 ring-red-200' : ''
                        }`}
                        placeholder="Ex: 1500"
                        min="0"
                        step="100"
                      />
                    </div>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                    )}
                  </div>

                  <div className="relative" ref={calendarRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dates disponibles
                    </label>
                    
                    {/* Version Desktop - Bouton séparé */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        name="availableDates"
                        value={formData.availableDates}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                        placeholder="Cliquez pour sélectionner vos dates"
                        readOnly
                        onClick={() => setShowCalendar(!showCalendar)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2"
                      >
                        <span className="text-lg">📅</span>
                        <span>Calendrier</span>
                      </button>
                    </div>

                    {showCalendar && <EnhancedCalendar />}
                  </div>

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
                      'Demander un devis'
                    )}
                  </button>
                </div>
                
                <p className="text-gray-500 text-xs text-center mt-4">
                  * Champs obligatoires
                </p>
                <p className="text-gray-500 text-xs text-center mt-2">
                  En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuoteModal;