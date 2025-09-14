// utils/axiosInstance.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const api: AxiosInstance & { isAxiosError: typeof AxiosError.isAxiosError } = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://192.168.1.16:3000',
}) as any;

// Add isAxiosError helper
api.isAxiosError = axios.isAxiosError;

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

