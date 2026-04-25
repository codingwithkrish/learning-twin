import axios from 'axios';
import { useStore } from '../store/useStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Inject token into requests
api.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const learnApi = {
  getExplanation: (topic, level) => api.post('/learn/explain', { topic, level }),
  getQuiz: (topic, masteryLevel) => api.post('/learn/quiz', { topic, masteryLevel }),
};

export const progressApi = {
  getGraph: () => api.get('/progress/graph'),
  updateProgress: (topic, sessionData) => api.post('/progress/update', { topic, sessionData }),
  getRecommendations: () => api.get('/progress/recommendations'),
};

export default api;
