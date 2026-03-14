import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setAuthToken, setUser, getUser, getAuthToken, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();
        const savedUser = getUser();

        if (token && savedUser) {
          setUserState(savedUser);
          // Verify token is still valid by fetching current user
          try {
            const response = await authAPI.getProfile();
            setUserState(response.user);
            setUser(response.user);
          } catch (err) {
            // Token is invalid, clear auth state
            setAuthToken(null);
            setUser(null);
            setUserState(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response;
      
      // Save token and user data
      setAuthToken(token);
      setUser(userData);
      setUserState(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.signup(userData);
      const { user: newUser, token } = response;
      
      // Save token and user data
      setAuthToken(token);
      setUser(newUser);
      setUserState(newUser);
      
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    setUserState(null);
    setError(null);
    apiLogout();
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.getProfile();
      const updatedUser = response.user;
      
      setUser(updatedUser);
      setUserState(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
