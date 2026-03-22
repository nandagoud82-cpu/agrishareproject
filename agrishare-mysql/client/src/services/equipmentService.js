import api from './api.js';

const API_URL = '/equipment';

export const getAllEquipment = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getMyEquipment = async () => {
  const response = await api.get(`${API_URL}/my`);
  return response.data;
};

export const createEquipment = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

export const updateEquipment = async (id, data) => {
  const response = await api.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteEquipment = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

export const toggleAvailability = async (id) => {
  const response = await api.patch(`${API_URL}/${id}/toggle`);
  return response.data;
};