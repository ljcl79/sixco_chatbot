// ===================================
// Configuración de Axios Instance
// ===================================

/**
* @fileoverview Configuración centralizada de Axios para las peticiones HTTP
* @description Crea y configura una instancia de Axios con interceptores para
* manejar requests y responses de manera global
*/

import axios from 'axios';

/** 
* Instancia personalizada de Axios con URL base configurada
* @constant {AxiosInstance}
*/
const axiosInstance = axios.create({
   baseURL: import.meta.env.VITE_URL_API,
});

// ===================================
// Interceptores de Request
// ===================================

/**
* Interceptor para peticiones salientes
* @param {AxiosRequestConfig} config - Configuración de la petición
* @returns {AxiosRequestConfig} Configuración modificada
*/
axiosInstance.interceptors.request.use(
   (config: any) => {
       return config;
   },
   (error: any) => {
       return Promise.reject(error);
   }
);

// ===================================
// Interceptores de Response
// ===================================

/**
* Interceptor para respuestas entrantes
* @param {AxiosResponse} response - Respuesta del servidor
* @returns {AxiosResponse} Respuesta procesada
*/
axiosInstance.interceptors.response.use(
   (response: any) => response,
   (error: any) => {
       // Manejo de errores de autenticación
       if (error.response && error.response.status === 401) {
           // Redirige al login si la sesión expiró
           window.location.href = '/login';
       }
       return Promise.reject(error);
   }
);

export default axiosInstance;