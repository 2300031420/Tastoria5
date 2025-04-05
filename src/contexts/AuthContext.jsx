import { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import axios from 'axios';
import { app } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  // Sign up function
  const signup = async (email, password, name) => {
    try {
      // First create the user in Firebase
      const firebaseResult = await createUserWithEmailAndPassword(auth, email, password);
      
      // Then create the user in your MongoDB backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        name,
        firebaseUid: firebaseResult.user.uid
      });

      if (response.data.success) {
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      // First authenticate with Firebase
      const firebaseResult = await signInWithEmailAndPassword(auth, email, password);
      
      // Then authenticate with your backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        firebaseUid: firebaseResult.user.uid
      });

      if (response.data.success) {
        // Store the backend token
        localStorage.setItem('backendToken', response.data.token);
        return { success: true, user: response.data.user };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('backendToken');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Verify the user with your backend
          const token = await firebaseUser.getIdToken();
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success) {
            setUser({ ...firebaseUser, ...response.data.user });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('User verification error:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    user,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 