// src/api/axiosClient.js
import axios from "axios";
import { appConfig } from "../config/env";

const axiosClient = axios.create({
  baseURL: appConfig.apiUrl,
  withCredentials: true,
});
axiosClient.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("user-storage"))?.state?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
