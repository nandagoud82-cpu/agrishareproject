import api from './api.js';

const API_URL = '/auth';

export const loginUser = async (credentials) => {
  const response = await api.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(`${API_URL}/profile`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put(`${API_URL}/profile`, data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put(`${API_URL}/change-password`, data);
  return response.data;
};