import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase/config.js';
import axios from "axios";
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password
      });

      if (response.data.success) {
        toast.success('Registration successful! Please verify your email.');
        return { success: true };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      if (response.data.token) {
        const userData = response.data.user;
        setUser(userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login successful!');
        
        // The navigation will be handled in the SignIn component
        return { success: true, user: userData };
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/sign-in');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
