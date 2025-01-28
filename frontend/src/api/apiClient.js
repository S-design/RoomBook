import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Set base API URL from environment variables
    headers: {
        'Content-Type': 'application/json', // Default headers
    },
});

export default apiClient; // Export the configured Axios instance

