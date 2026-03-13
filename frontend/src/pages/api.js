import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  } catch {}
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const createResume = (data) => API.post('/resume/create', data);
export const getResumes = () => API.get('/resume/get');
export const getResumeById = (id) => API.get(`/resume/${id}`);
export const updateResume = (id, data) => API.put(`/resume/${id}`, data);
export const deleteResume = (id) => API.delete(`/resume/${id}`);
export const generateAI = (data) => API.post('/ai/generate', data);
