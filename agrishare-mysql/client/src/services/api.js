import axios from 'axios';
import { LS_TOKEN } from '../utils/constants.js'; 
import { getLS } from '../utils/helpers.js';       

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to ensure every request carries the security token
api.interceptors.request.use((config) => {
  // getLS ensures we pull the exact 'agrishare_token' saved by AppContext
  const token = getLS(LS_TOKEN); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;