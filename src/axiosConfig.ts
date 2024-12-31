import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
});

axiosInstance.interceptors.request.use(
    (config: any) => {
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
