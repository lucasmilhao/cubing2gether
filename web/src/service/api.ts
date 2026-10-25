import axios from "axios";

export const api = axios.create({
    baseURL: "https://cubing2gether.onrender.com",
    withCredentials: true
});

api.interceptors.request.use((config) => {

    return config;
})
