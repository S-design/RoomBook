import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_API_AUTH_TOKEN || ''}`, // Optional
    },
    timeout: 10000,
    withCredentials: false,
});


// Global Error Handling (Optional)
apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default apiClient;

