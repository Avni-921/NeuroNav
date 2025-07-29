import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Problem API
export const problemsAPI = {
  getAll: (params = {}) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  create: (data) => api.post('/problems', data),
  update: (id, data) => api.put(`/problems/${id}`, data),
  delete: (id) => api.delete(`/problems/${id}`),
  getTestCases: (id) => api.get(`/problems/${id}/testcases`)
};

// Submission API
export const submissionsAPI = {
  submit: (data) => api.post('/submissions', data),
  getById: (id) => api.get(`/submissions/${id}`),
  getUserSubmissions: (params = {}) => api.get('/submissions/user/me', { params }),
  getProblemSubmissions: (problemId, params = {}) => 
    api.get(`/submissions/problem/${problemId}`, { params }),
  getAllSubmissions: (params = {}) => api.get('/submissions/admin/all', { params })
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: (params = {}) => api.get('/leaderboard', { params }),
  getUserStats: (userId) => api.get(`/leaderboard/user/${userId}`),
  getProblemStats: () => api.get('/leaderboard/problems'),
  getRecentActivity: (params = {}) => api.get('/leaderboard/activity/recent', { params })
};

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export default api;