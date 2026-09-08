import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getSongs = async () => {
  const response = await api.get('/songs');
  return response.data;
};

export const getSongById = async (id) => {
  const response = await api.get(`/songs/${id}`);
  return response.data;
};

export const getSongsByMood = async (mood) => {
  const response = await api.get(`/songs/mood/${mood}`);
  return response.data;
};

export const recommendSongs = async (mood, intensity, language = 'all') => {
  const response = await api.post('/songs/recommend', { mood, intensity, language });
  return response.data;
};

export default api;
