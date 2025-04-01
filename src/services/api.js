import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  updateProfilePicture: (formData) => api.put('/users/profile/picture', formData),
  getOrders: () => api.get('/users/orders'),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (itemId) => api.post('/users/favorites', { itemId }),
  removeFavorite: (itemId) => api.delete(`/users/favorites/${itemId}`),
  addAddress: (address) => api.post('/users/address', address),
  removeAddress: (addressId) => api.delete(`/users/address/${addressId}`),
  addPaymentMethod: (paymentMethod) => api.post('/users/payment-method', paymentMethod),
  removePaymentMethod: (methodId) => api.delete(`/users/payment-method/${methodId}`),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
};

export default api; 