import axios from "axios";
import { setupCache } from 'axios-cache-interceptor';
import env from "react-dotenv";

const getAuthToken = () => {
    let token = localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).auth_token
                : "";
    return 'Bearer ' + token;
}

export const clearLocalStorage = () => {
   localStorage.removeItem("user");
}

export const axiosInstance = axios.create({
   baseURL: env.APP_API_URL,
   timeout: 2000,
});

axiosInstance.interceptors.request.use(function(config) {
   config.headers = {
      ...config.headers,
      Authorization: getAuthToken(),
      "Accept-content": "gzip, deflate, br",
   };
   return config;
}, function(error) {
   return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function(response) {
   console.log("Is-Cached",response.cached)
   console.log(response.status)
   return response;
}, function(error) {
   console.log("AXIOS-ERROR:::", error)
   if(error.response) {
      if (error.response.status === 401) {
         clearLocalStorage();
         window.location.href = "#/login";
      }
   }
   return error
});

setupCache(axiosInstance, {
   // debug: console.log 
});

export default axiosInstance;