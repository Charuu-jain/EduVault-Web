import axios from 'axios';

// ---- Global axios defaults (covers ANY direct axios.get/post in components) ----
const BASE_URL = '/api'; // via Vite proxy → backend on port 8080
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true; // ensure JSESSIONID is sent on every request

// ---- Shared axios instance (preferred) ----
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach the same error normalizer to BOTH the instance and global axios
const normalizeError = (error) => {
  const message = error?.response?.data?.message || error?.response?.data || error?.message || 'Request failed';
  return Promise.reject(new Error(message));
};

api.interceptors.response.use((r) => r, normalizeError);
axios.interceptors.response.use((r) => r, normalizeError);

// ===== Auth APIs =====
export const signup = (email, password, fullName) =>
  api.post('/auth/signup', { email, password, fullName });

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const me = () => api.get('/auth/me').then((r) => r.data);
export const logout = () => api.post('/auth/logout');

// ===== Domain APIs =====
export const getSubjects = async () => {
  const { data } = await api.get('/subjects');
  return data;
};

export const getReminders = async () => {
  const { data } = await api.get('/reminders');
  return data;
};

export const listFiles = async (params) => {
  const { data } = await api.get('/files', { params });
  return data;
};

export const uploadFile = async (file, { subjectId, onUploadProgress } = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  if (subjectId) formData.append('subjectId', subjectId);

  const { data } = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return data;
};

// Export the configured axios as default so any `import axios from 'axios'` elsewhere
// also uses the baseURL + withCredentials settings.
export default axios;
