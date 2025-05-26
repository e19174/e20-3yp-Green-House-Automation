import axios from "axios";
import { get } from "../Storage/secureStorage";

export const Axios = axios.create({
    // baseURL: "http://192.168.129.83:8080/api/v1/",
    baseURL: "http://10.30.10.242:8080/api/v1/",
})

Axios.interceptors.request.use(async config => {
    const token = await get('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
})