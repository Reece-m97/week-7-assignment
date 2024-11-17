import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Add user registration API call
export const register = (userData) => api.post(`/register`, userData);

// Add login API call
export const login = (credentials) => api.post(`/login`, credentials);

// Example: Fetch user profile
export const getUserProfile = (id) => api.get(`/users/${id}`);

// Example: Fetch deeds
export const getDeeds = () => api.get(`/deeds`);

// Example: Add a new deed
export const addDeed = (deed) => api.post(`/deeds`, deed);

// Example: Add reaction
export const addReaction = (reaction) => api.post(`/reactions`, reaction);

// Example: Fetch leaderboard
export const getLeaderboard = () => api.get(`/leaderboard`);

export default api;
