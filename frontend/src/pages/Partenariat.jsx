import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DoctorCard from '../components/DoctorCard';
import ParticipateModal from '../components/ParticipateModal';
import API from '../api/axios';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showParticipateModal, setShowParticipateModal] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    filterPartners();
  }, [partners, searchTerm, specialtyFilter]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await API.get('/partners');
      setPartners(response.data.partners || []);
    } catch (error) {
      console.error('Erreur chargement partenaires:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPartners = () => {
    let filtered = partners;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(partner =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par spécialité
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(partner =>
        partner.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
      );
    }

    setFilteredPartners(filtered);
  };

  const specialties = [...new Set(partners.map(partner => partner.specialty))];

  const stats = {
    total: partners.length,
    active: partners.filter(p => p.isActive).length,
    specialties: specialties.length
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenParticipateModal={() => setShowParticipateModal(true)} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nos Experts <span className="text-accent-300">Partenaires</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Découvrez l'équipe d'experts passionnés qui rendent les transformations possibles
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm opacity-90">Experts</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{stats.specialties}</div>
                  <div className="text-sm opacity-90">Spécialités</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <div className="text-sm opacity-90">Actifs</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white py-8 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full lg:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un expert..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* Specialty Filter */}
              <div className="w-full lg:w-64">
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">Toutes les spécialités</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="text-gray-600 text-sm">
                {filteredPartners.length} expert{filteredPartners.length !== 1 ? 's' : ''} trouvé{filteredPartners.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="loading-spinner"></div>
                <span className="ml-3 text-gray-600">Chargement des experts...</span>
              </div>
            ) : filteredPartners.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun expert trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || specialtyFilter !== 'all' 
                    ? 'Aucun expert ne correspond à vos critères de recherche.'
                    : 'Aucun expert n\'est disponible pour le moment.'
                  }
                </p>
                {(searchTerm || specialtyFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSpecialtyFilter('all');
                    }}
                    className="btn btn-primary"
                  >
                    Voir tous les experts
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPartners.map((partner) => (
                    <DoctorCard 
                      key={partner._id} 
                      partner={partner}
                    />
                  ))}
                </div>

                {/* Load More (if needed) */}
                {filteredPartners.length < partners.length && (
                  <div className="text-center mt-12">
                    <button className="btn btn-outline">
                      Charger plus d'experts
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Prête à Rencontrer Nos Experts ?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Inscrivez-vous dès maintenant pour avoir la chance de travailler avec ces professionnels d'exception
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowParticipateModal(true)}
                className="btn btn-primary text-lg px-8 py-4"
              >
               Participer Maintenant
              </button>
              <Link
                to="/"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Participate Modal */}
      <ParticipateModal 
        open={showParticipateModal} 
        onClose={() => setShowParticipateModal(false)} 
      />
    </div>
  );
};

export default Partners;