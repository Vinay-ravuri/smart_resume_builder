import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  } catch {}
  return req;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Resume
export const createResume = (data) => API.post('/resume', data);
export const getResumes = () => API.get('/resume');
export const getResumeById = (id) => API.get(`/resume/${id}`);
export const updateResume = (id, data) => API.put(`/resume/${id}`, data);
export const deleteResume = (id) => API.delete(`/resume/${id}`);

// AI Features
export const generateAI = (data) => API.post('/ai/generate', data);
export const checkATS = (data) => API.post('/ai/ats-check', data);
export const generateCoverLetter = (data) => API.post('/ai/cover-letter', data);
export const matchJob = (data) => API.post('/ai/match-job', data);
export const analyzeSkillGap = (data) => API.post('/ai/skill-gap', data);
export const generateInterviewQuestions = (data) => API.post('/ai/interview-questions', data);