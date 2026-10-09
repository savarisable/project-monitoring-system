import axios from 'axios';

let rawApiUrl = import.meta.env.VITE_API_URL || 'https://project-monitoring-system-rsab.onrender.com/api';
// Clean any trailing slashes or duplicate /api
rawApiUrl = rawApiUrl.replace(/\/+$/, '');
if (!rawApiUrl.endsWith('/api')) {
  rawApiUrl = rawApiUrl + '/api';
}

const api = axios.create({
  baseURL: rawApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Remove leading /api if passed in endpoint path
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.substring(4);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Auto logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;