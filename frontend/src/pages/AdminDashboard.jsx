import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import API from "../api/axios";
import ParticipantCard from "../components/ParticipantCard";
import PartnerCard from "../components/PartnerCard";
import PartnerModal from "../components/PartnerModal";
import QuoteCard from "../components/QuoteCard";

// Composant de notification moderne
const Notification = ({ message, type = "info", onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, 0);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(id);
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const getStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border-l-4 p-4 transform transition-all duration-300 ease-in-out";
    const typeStyles = {
      success: "border-green-500 bg-green-50",
      error: "border-red-500 bg-red-50",
      warning: "border-yellow-500 bg-yellow-50",
      info: "border-blue-500 bg-blue-50",
    };
    const visibility = isVisible
      ? "translate-x-0 opacity-100"
      : "translate-x-full opacity-0";

    return `${baseStyles} ${typeStyles[type]} ${visibility}`;
  };

  const getIcon = () => {
    const icons = {
      success: "✅",
      error: "❌",
      warning: "⚠️",
      info: "💡",
    };
    return icons[type];
  };

  return (
    <div className={getStyles()}>
      <div className="flex items-start space-x-3">
        <span className="text-xl flex-shrink-0">{getIcon()}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// Composant de modal de confirmation moderne
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "warning",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsVisible(isOpen);
    }, 0);

    return () => clearTimeout(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getTypeStyles = () => {
    const styles = {
      warning: "bg-yellow-50 border-yellow-200",
      danger: "bg-red-50 border-red-200",
      info: "bg-blue-50 border-blue-200",
    };
    return styles[type] || styles.warning;
  };

  const getButtonStyles = () => {
    const styles = {
      warning: "bg-yellow-600 hover:bg-yellow-700",
      danger: "bg-red-600 hover:bg-red-700",
      info: "bg-blue-600 hover:bg-blue-700",
    };
    return styles[type] || styles.warning;
  };

  const getIcon = () => {
    const icons = {
      warning: "⚠️",
      danger: "🚨",
      info: "💡",
    };
    return icons[type] || icons.warning;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black bg-opacity-50" : "bg-black bg-opacity-0"
      }`}
    >
      <div
        className={`transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl border ${getTypeStyles()} max-w-md w-full mx-auto overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getIcon()}</span>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-white rounded-xl transition-colors font-medium ${getButtonStyles()}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { admin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("participants");
  const [participants, setParticipants] = useState([]);
  const [partners, setPartners] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingActions, setLoadingActions] = useState({});
  const [stats, setStats] = useState({
    totalParticipants: 0,
    selectedParticipants: 0,
    totalPartners: 0,
    activePartners: 0,
    pendingParticipants: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
  });

  const [quotesStats, setQuotesStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    treated: 0
  });

  // États pour la gestion des partenaires
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // États pour les notifications
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  // Fonction pour afficher les notifications
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
  };

  // Fonction pour afficher les modals de confirmation
  const showConfirmation = (title, message, onConfirm, type = "warning") => {
    setConfirmationModal({
      show: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmationModal({ ...confirmationModal, show: false });
      },
      type,
    });
  };

  // Fonction pour récupérer les quotes
  const fetchQuotes = async () => {
    try {
      const quotesRes = await API.get("/quotes");
      const quotesData = quotesRes.data?.quotes || [];
      setQuotes(quotesData);

      // Calculer les statistiques des quotes
      const totalQuotes = quotesData.length;
      const pendingQuotes = quotesData.filter(q => q.status === "pending").length;
      const contactedQuotes = quotesData.filter(q => q.status === "contacted").length;
      const treatedQuotes = quotesData.filter(q => q.status === "treated").length;

      setQuotesStats({
        total: totalQuotes,
        pending: pendingQuotes,
        contacted: contactedQuotes,
        treated: treatedQuotes
      });

      // Mettre à jour les stats globales
      setStats(prev => ({
        ...prev,
        totalQuotes,
        pendingQuotes
      }));

    } catch (error) {
      console.error("Erreur chargement des devis:", error);
      showNotification("Erreur lors du chargement des demandes de devis", "error");
    }
  };

  // Gestion de la suppression des quotes
  const handleDeleteQuote = async (quoteId) => {
    showConfirmation(
      "Supprimer la demande de devis",
      "Êtes-vous sûr de vouloir supprimer cette demande de devis ? Cette action est irréversible.",
      async () => {
        let deletedQuote = null;

        try {
          setLoadingActions((prev) => ({ ...prev, [quoteId]: true }));

          // Sauvegarder pour revert si besoin
          deletedQuote = quotes.find((q) => q._id === quoteId);

          // Mise à jour optimiste
          setQuotes((prev) => prev.filter((q) => q._id !== quoteId));
          setQuotesStats(prev => ({
            ...prev,
            total: prev.total - 1,
            [deletedQuote.status]: prev[deletedQuote.status] - 1
          }));

          await API.delete(`/quotes/${quoteId}`);
          showNotification("Demande de devis supprimée avec succès", "success");
        } catch (error) {
          console.error("Erreur suppression devis:", error);
          // Revert en cas d'erreur
          if (deletedQuote) {
            setQuotes((prev) => [...prev, deletedQuote]);
            setQuotesStats(prev => ({
              ...prev,
              total: prev.total + 1,
              [deletedQuote.status]: prev[deletedQuote.status] + 1
            }));
          }
          showNotification(
            "Erreur lors de la suppression de la demande de devis",
            "error"
          );
        } finally {
          setLoadingActions((prev) => ({ ...prev, [quoteId]: false }));
        }
      },
      "danger"
    );
  };

  // Vérifier l'authentification
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Construire les query params pour les partenaires
        const partnerParams = new URLSearchParams();
        if (filterSpecialty !== "all")
          partnerParams.append("specialty", filterSpecialty);
        if (filterStatus !== "all")
          partnerParams.append("active", filterStatus === "active");

        const [participantsRes, partnersRes, quotesRes] = await Promise.all([
          API.get("/participants"),
          API.get(`/partners?${partnerParams.toString()}`),
          API.get("/quotes")
        ]);

        setParticipants(
          participantsRes.data?.participants || participantsRes.data || []
        );

        // Filtrer les partenaires localement par recherche
        let filteredPartners =
          partnersRes.data?.partners || partnersRes.data || [];
        if (searchTerm) {
          filteredPartners = filteredPartners.filter(
            (partner) =>
              partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              partner.specialty
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              partner.services?.some((service) =>
                service?.toLowerCase().includes(searchTerm.toLowerCase())
              )
          );
        }
        setPartners(filteredPartners);

        // Gestion des quotes
        const quotesData = quotesRes.data?.quotes || [];
        setQuotes(quotesData);

        // Calculer les statistiques
        const participantsData =
          participantsRes.data?.participants || participantsRes.data || [];
        const partnersData = partnersRes.data?.partners || partnersRes.data || [];

        const totalParticipants = participantsData.length || 0;
        const selectedParticipants =
          participantsData.filter((p) => p.selected).length || 0;
        const pendingParticipants =
          participantsData.filter((p) => p.status === "pending").length || 0;
        const totalPartners = partnersData.length || 0;
        const activePartners = partnersData.filter((p) => p.isActive).length || 0;
        const totalQuotes = quotesData.length;
        const pendingQuotes = quotesData.filter(q => q.status === "pending").length;

        // Stats détaillées pour les quotes
        const pendingQuotesCount = quotesData.filter(q => q.status === "pending").length;
        const contactedQuotesCount = quotesData.filter(q => q.status === "contacted").length;
        const treatedQuotesCount = quotesData.filter(q => q.status === "treated").length;

        setQuotesStats({
          total: totalQuotes,
          pending: pendingQuotesCount,
          contacted: contactedQuotesCount,
          treated: treatedQuotesCount
        });

        setStats({
          totalParticipants,
          selectedParticipants,
          totalPartners,
          activePartners,
          pendingParticipants,
          totalQuotes,
          pendingQuotes,
        });
      } catch (error) {
        console.error("Erreur chargement données:", error);
        showNotification("Erreur lors du chargement des données", "error");
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated || !isAuthenticated()) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate, filterSpecialty, filterStatus, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Construire les query params pour les partenaires
      const partnerParams = new URLSearchParams();
      if (filterSpecialty !== "all")
        partnerParams.append("specialty", filterSpecialty);
      if (filterStatus !== "all")
        partnerParams.append("active", filterStatus === "active");

      const [participantsRes, partnersRes, quotesRes] = await Promise.all([
        API.get("/participants"),
        API.get(`/partners?${partnerParams.toString()}`),
        API.get("/quotes")
      ]);

      setParticipants(
        participantsRes.data?.participants || participantsRes.data || []
      );

      // Filtrer les partenaires localement par recherche
      let filteredPartners =
        partnersRes.data?.partners || partnersRes.data || [];
      if (searchTerm) {
        filteredPartners = filteredPartners.filter(
          (partner) =>
            partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.specialty
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            partner.services?.some((service) =>
              service?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }
      setPartners(filteredPartners);

      // Gestion des quotes
      const quotesData = quotesRes.data?.quotes || [];
      setQuotes(quotesData);

      // Calculer les statistiques
      const participantsData =
        participantsRes.data?.participants || participantsRes.data || [];
      const partnersData = partnersRes.data?.partners || partnersRes.data || [];

      const totalParticipants = participantsData.length || 0;
      const selectedParticipants =
        participantsData.filter((p) => p.selected).length || 0;
      const pendingParticipants =
        participantsData.filter((p) => p.status === "pending").length || 0;
      const totalPartners = partnersData.length || 0;
      const activePartners = partnersData.filter((p) => p.isActive).length || 0;
      const totalQuotes = quotesData.length;
      const pendingQuotes = quotesData.filter(q => q.status === "pending").length;

      // Stats détaillées pour les quotes
      const pendingQuotesCount = quotesData.filter(q => q.status === "pending").length;
      const contactedQuotesCount = quotesData.filter(q => q.status === "contacted").length;
      const treatedQuotesCount = quotesData.filter(q => q.status === "treated").length;

      setQuotesStats({
        total: totalQuotes,
        pending: pendingQuotesCount,
        contacted: contactedQuotesCount,
        treated: treatedQuotesCount
      });

      setStats({
        totalParticipants,
        selectedParticipants,
        totalPartners,
        activePartners,
        pendingParticipants,
        totalQuotes,
        pendingQuotes,
      });
    } catch (error) {
      console.error("Erreur chargement données:", error);
      showNotification("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  };

  // Gestion des participants avec mise à jour optimiste
  const handleToggleSelect = async (participantId) => {
    let oldParticipants = [];

    try {
      setLoadingActions((prev) => ({ ...prev, [participantId]: true }));

      // Sauvegarder l'ancien état pour revert si besoin
      oldParticipants = [...participants];
      const participant = participants.find((p) => p._id === participantId);
      const wasSelected = participant?.selected;

      // Mise à jour optimiste de l'UI
      setParticipants((prev) =>
        prev.map((p) =>
          p._id === participantId ? { ...p, selected: !p.selected } : p
        )
      );

      // Mettre à jour les stats localement
      setStats((prev) => ({
        ...prev,
        selectedParticipants: wasSelected
          ? prev.selectedParticipants - 1
          : prev.selectedParticipants + 1,
      }));

      // Appel API en arrière-plan
      await API.patch(`/participants/${participantId}/select`);

      showNotification(
        wasSelected
          ? "Participant retiré de la sélection"
          : "Participant ajouté à la sélection",
        "success"
      );
    } catch (error) {
      console.error("Erreur toggle selection:", error);
      // Revert en cas d'erreur
      setParticipants(oldParticipants);
      showNotification(
        "Erreur lors de la modification de la sélection",
        "error"
      );
      fetchData();
    } finally {
      setLoadingActions((prev) => ({ ...prev, [participantId]: false }));
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    showConfirmation(
      "Supprimer le participant",
      "Êtes-vous sûr de vouloir supprimer ce participant ? Cette action ne peut pas être annulée.",
      async () => {
        let deletedParticipant = null;

        try {
          setLoadingActions((prev) => ({ ...prev, [participantId]: true }));

          // Sauvegarder l'élément supprimé pour pouvoir le restaurer en cas d'erreur
          deletedParticipant = participants.find(
            (p) => p._id === participantId
          );
          const wasSelected = deletedParticipant?.selected;
          const wasPending = deletedParticipant?.status === "pending";

          // Mise à jour optimiste
          setParticipants((prev) =>
            prev.filter((p) => p._id !== participantId)
          );

          // Mettre à jour les stats localement
          setStats((prev) => ({
            ...prev,
            totalParticipants: prev.totalParticipants - 1,
            selectedParticipants: wasSelected
              ? prev.selectedParticipants - 1
              : prev.selectedParticipants,
            pendingParticipants: wasPending
              ? prev.pendingParticipants - 1
              : prev.pendingParticipants,
          }));

          // Appel API en arrière-plan
          await API.delete(`/participants/${participantId}`);

          showNotification("Participant supprimé avec succès", "success");
        } catch (error) {
          console.error("Erreur suppression participant:", error);
          showNotification(
            "Erreur lors de la suppression du participant",
            "error"
          );

          // Restaurer le participant en cas d'erreur
          if (deletedParticipant) {
            setParticipants((prev) => [...prev, deletedParticipant]);
          }
          fetchData();
        } finally {
          setLoadingActions((prev) => ({ ...prev, [participantId]: false }));
        }
      },
      "danger"
    );
  };

  // Gestion des partenaires
  const handleAddPartner = () => {
    setEditingPartner(null);
    setShowPartnerModal(true);
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setShowPartnerModal(true);
  };

  const handleDeletePartner = async (partnerId) => {
    showConfirmation(
      "Supprimer le partenaire",
      "Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est irréversible.",
      async () => {
        let deletedPartner = null;

        try {
          // Sauvegarder pour revert si besoin
          deletedPartner = partners.find((p) => p._id === partnerId);
          const wasActive = deletedPartner?.isActive;

          // Mise à jour optimiste
          setPartners((prev) => prev.filter((p) => p._id !== partnerId));

          // Mettre à jour les stats localement
          setStats((prev) => ({
            ...prev,
            totalPartners: prev.totalPartners - 1,
            activePartners: wasActive
              ? prev.activePartners - 1
              : prev.activePartners,
          }));

          await API.delete(`/partners/${partnerId}`);
          showNotification("Partenaire supprimé avec succès", "success");
        } catch (error) {
          console.error("Erreur suppression partenaire:", error);
          // Revert en cas d'erreur
          if (deletedPartner) {
            setPartners((prev) => [...prev, deletedPartner]);
          }
          showNotification(
            "Erreur lors de la suppression du partenaire",
            "error"
          );
        }
      },
      "danger"
    );
  };

  const handlePartnerSuccess = () => {
    showNotification(
      editingPartner
        ? "Partenaire modifié avec succès"
        : "Partenaire ajouté avec succès",
      "success"
    );
    fetchData(); // Recharger les données après ajout/modification
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    showNotification("Déconnexion réussie", "info");
  };

  // Récupérer les spécialités uniques pour le filtre
  const specialties = [
    ...new Set(partners.map((p) => p.specialty).filter(Boolean)),
  ];

  // Effet pour recharger les données quand les filtres changent
  useEffect(() => {
    if (activeTab === "partners") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSpecialty, filterStatus, activeTab]);

  // Effet pour la recherche
  useEffect(() => {
    if (activeTab === "partners") {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500); // Délai de 500ms pour éviter trop de requêtes

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Admin
                </h1>
                <p className="text-sm text-gray-500">
                  Connecté en tant que{" "}
                  {admin?.name || admin?.email || "Administrateur"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <span>🌐</span>
                <span>Voir le site</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
              >
                <span>🚪</span>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-2xl text-blue-600">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Participants
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalParticipants}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-2xl text-green-600">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Sélectionnés
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.selectedParticipants}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <span className="text-2xl text-purple-600">🤝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Partenaires
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPartners}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-2xl text-green-600">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Partenaires Actifs
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activePartners}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <span className="text-2xl text-yellow-600">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingParticipants}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-2xl text-green-600">💬</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Demandes Devis</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuotes}</p>
                {stats.pendingQuotes > 0 && (
                  <p className="text-xs text-yellow-600 font-medium">
                    {stats.pendingQuotes} en attente
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("participants")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "participants"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                👥 Participants ({participants.length})
              </button>
              <button
                onClick={() => setActiveTab("partners")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "partners"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                🤝 Partenaires ({partners.length})
              </button>
              <button
                onClick={() => setActiveTab("quotes")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "quotes"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                💬 Demandes de Devis ({quotes.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Participants Tab */}
            {activeTab === "participants" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Gestion des Participants
                  </h2>
                  <button
                    onClick={fetchData}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Actualiser</span>
                  </button>
                </div>

                {participants.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucun participant
                    </h3>
                    <p className="text-gray-600">
                      Aucun participant n'a encore postulé.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {participants.map((participant) => (
                      <ParticipantCard
                        key={participant._id}
                        participant={participant}
                        onToggleSelect={handleToggleSelect}
                        onDelete={handleDeleteParticipant}
                        isAdmin={true}
                        isLoading={loadingActions[participant._id]}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Partners Tab */}
            {activeTab === "partners" && (
              <div>
                {/* Header avec filtres et actions */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    {/* Bloc gauche : recherche + filtres */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                      {/* Barre de recherche */}
                      <div className="relative w-full sm:w-80">
                        <input
                          type="text"
                          placeholder="Rechercher un partenaire..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-gray-700 shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Filtres */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <select
                          value={filterSpecialty}
                          onChange={(e) => setFilterSpecialty(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 shadow-sm"
                        >
                          <option value="all">Toutes spécialités</option>
                          {specialties.map((specialty) => (
                            <option key={specialty} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </select>

                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 shadow-sm"
                        >
                          <option value="all">Tous statuts</option>
                          <option value="active">Actifs</option>
                          <option value="inactive">Inactifs</option>
                        </select>
                      </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-4">
                      <button
                        onClick={fetchData}
                        className="px-5 py-3 bg-gray-100 text-gray-800 border border-gray-200 rounded-2xl
                        hover:bg-gray-200 transition-all font-medium flex items-center gap-2 shadow-sm"
                      >
                        <span>Actualiser</span>
                      </button>

                      <button
                        onClick={handleAddPartner}
                        className="px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700
                        transition-all font-medium flex items-center gap-2 shadow-md"
                      >
                        <span>Ajouter</span>
                      </button>
                    </div>

                  </div>
                </div>

                {partners.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucun partenaire trouvé
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm ||
                      filterSpecialty !== "all" ||
                      filterStatus !== "all"
                        ? "Aucun partenaire ne correspond à vos critères de recherche."
                        : "Aucun partenaire n'a encore été ajouté."}
                    </p>
                    {!searchTerm &&
                      filterSpecialty === "all" &&
                      filterStatus === "all" && (
                        <button
                          onClick={handleAddPartner}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          ➕ Ajouter le premier partenaire
                        </button>
                      )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partners.map((partner) => (
                      <PartnerCard
                        key={partner._id}
                        partner={partner}
                        onEdit={handleEditPartner}
                        onDelete={handleDeletePartner}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Gestion des Demandes de Devis
                    </h2>
                    <p className="text-gray-600">
                      Gérez les demandes de devis reçues de vos clients
                    </p>
                  </div>
                  <button
                    onClick={fetchQuotes}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Actualiser</span>
                  </button>
                </div>

                {/* Stats des quotes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold">{quotesStats.total}</div>
                    <div className="text-sm opacity-90">Total</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold">{quotesStats.pending}</div>
                    <div className="text-sm opacity-90">En attente</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold">{quotesStats.contacted}</div>
                    <div className="text-sm opacity-90">Contactés</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold">{quotesStats.treated}</div>
                    <div className="text-sm opacity-90">Traités</div>
                  </div>
                </div>

                {quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Aucune demande de devis
                    </h3>
                    <p className="text-gray-600">
                      Aucune demande de devis n'a encore été reçue.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {quotes.map((quote) => (
                      <QuoteCard
                        key={quote._id}
                        quote={quote}
                        onDelete={handleDeleteQuote}
                        isLoading={loadingActions[quote._id]}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actions Rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab("participants")}
              className="text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-3">📊</div>
              <div className="font-semibold text-gray-900 mb-1">
                Voir les statistiques
              </div>
              <div className="text-sm text-gray-600">
                Analyser les données des participants
              </div>
            </button>

            <button
              onClick={() => {
                showNotification("Fonctionnalité d'export à venir", "info");
              }}
              className="text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-3">📤</div>
              <div className="font-semibold text-gray-900 mb-1">
                Exporter les données
              </div>
              <div className="text-sm text-gray-600">
                Télécharger en CSV/Excel
              </div>
            </button>

            <button
              onClick={() => {
                showNotification(
                  "Paramètres disponibles prochainement",
                  "info"
                );
              }}
              className="text-left p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-3">⚙️</div>
              <div className="font-semibold text-gray-900 mb-1">Paramètres</div>
              <div className="text-sm text-gray-600">
                Configurer l'application
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Partenaire */}
      <PartnerModal
        isOpen={showPartnerModal}
        onClose={() => {
          setShowPartnerModal(false);
          setEditingPartner(null);
        }}
        partner={editingPartner}
        onSuccess={handlePartnerSuccess}
      />

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      {/* Modal de Confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.show}
        onClose={() =>
          setConfirmationModal({ ...confirmationModal, show: false })
        }
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
      />
    </div>
  );
};

export default AdminDashboard;