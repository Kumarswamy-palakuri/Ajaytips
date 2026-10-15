import api from './api.js';

const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, id, password) =>
    api.post(`/auth/reset-password?token=${token}&id=${id}`, { password }),
  verifyEmail: (token, id) => api.get(`/auth/verify-email?token=${token}&id=${id}`),
};

export default authService;
