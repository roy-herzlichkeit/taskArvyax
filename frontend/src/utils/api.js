import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || import.meta.env.VITE_PRODUCTION_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token)
        config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const userAPI = {
    login: (credentials) => api.post('/login', credentials),
    register: (userData) => api.post('/register', userData)
};

export const sessionAPI = {
    getSessions: () => api.get('/sessions'),
    getMySessions: () => api.get('/my-sessions'),
    getSession: (id) => api.get(`/my-sessions/${id}`),
    saveDraft: (sessionData) => api.post('/my-sessions/save-draft', sessionData),
    publishSession: (sessionData) => api.post('/my-sessions/publish', sessionData),
};

export default api;