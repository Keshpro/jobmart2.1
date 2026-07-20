import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5183', 
    // Content-Type මෙතනින් ඉවත් කළා, එවිට Axios ඉබේම අදාළ විදියට Header එක හදාගන්නවා
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;