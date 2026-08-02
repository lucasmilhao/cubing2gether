import axios from "axios";

export const api = axios.create({
    baseURL: "https://cubing2gether.onrender.com"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})