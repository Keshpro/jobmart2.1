import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5183', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// මේ කොටස අනිවාර්යයෙන්ම තිබිය යුතුයි! (මෙයින් තමයි Token එක යවන්නේ)
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