import axios from 'axios';

const BASE_URL=import.meta.env.MODE==="development"? "http://localhost:5001/api":"/api";
export const axiosInstance = axios.create({
    baseURL: BASE_URL, // Adjust the base URL as needed
    withCredentials: true, // Include credentials for CORS requests and send cookies
});