// src/config/axios.js
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axios;