import axios from "axios";

export const API_URL = "http://localhost:8080";

export const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})