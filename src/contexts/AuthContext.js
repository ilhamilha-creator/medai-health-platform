import React, { createContext, useState, useContext } from 'react';
import apiService from '../services/apiService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier s'il y a une session existante au démarrage
  React.useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('medai_current_user');
    
    if (accessToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('medai_current_user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Utiliser le backend-unified pour l'authentification
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const data = await response.json();
      
      // Sauvegarder les tokens
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      
      // Déterminer le rôle à partir de l'email (demo users)
      const userType = email.includes('doctor') || email.includes('medai') ? 'doctor' : 'patient';
      
      // Créer l'objet utilisateur
      const userData = {
        id: data.access_token ? 1 : 1, // Le backend renverra l'ID réel
        email: email,
        name: email.split('@')[0],
        userType: userType,
        role: userType
      };
      
      setUser(userData);
      localStorage.setItem('medai_current_user', JSON.stringify(userData));
      setIsAuthenticated(true);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur de connexion. Veuillez vérifier que le backend est démarré (http://localhost:8000).' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('medai_current_user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Utiliser le backend-unified pour l'inscription
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'inscription');
      }

      const registeredUser = await response.json();
      
      // Connecter automatiquement après l'inscription
      const loginResult = await login(userData.email, userData.password);
      
      if (loginResult.success) {
        return { success: true, user: registeredUser };
      } else {
        return { success: false, error: 'Inscription réussie mais erreur de connexion automatique' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (profileData) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...profileData
      };
      setUser(updatedUser);
      localStorage.setItem('medai_current_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      register,
      updateProfile,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
