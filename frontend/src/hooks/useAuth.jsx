import React, { createContext, useContext, useState, useEffect } from 'react';
import API, { setAuthToken, removeAuthToken, getAuthToken } from '../api/axios';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/verify');
        setAdmin(response.data.admin);
      } catch (err) {
        console.error('Erreur vérification auth:', err);
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await API.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, admin } = response.data;
        setAuthToken(token);
        setAdmin(admin);
        localStorage.setItem('bambou_admin', JSON.stringify(admin));
        return { success: true, data: response.data };
      } else {
        throw new Error(response.data.message || 'Erreur de connexion');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur de connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setAdmin(null);
    setError(null);
  };

  const isAuthenticated = () => {
    return !!admin && !!getAuthToken();
  };

  const clearError = () => setError(null);

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    clearError,
  };

  // CORRECTION : Utiliser JSX au lieu de React.createElement
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};