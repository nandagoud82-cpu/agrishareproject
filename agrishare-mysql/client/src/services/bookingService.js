import api from './api.js';

const API_URL = '/bookings';

export const createBooking = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get(`${API_URL}/my`);
  return response.data;
};

export const getOwnerBookings = async () => {
  const response = await api.get(`${API_URL}/owner`);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`${API_URL}/${id}/status`, { status });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.patch(`${API_URL}/${id}/status`, { status: 'cancelled' });
  return response.data;
};

export const completeBooking = async (id) => {
  const response = await api.patch(`${API_URL}/${id}/status`, { status: 'completed' });
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get(API_URL);
  return response.data;
};