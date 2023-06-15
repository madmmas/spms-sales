import axios from "axios";
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
   timeout: 1000,
});

axiosInstance.interceptors.request.use(function(config) {
   config.headers = {
      ...config.headers,
      Authorization: getAuthToken()
   };
   return config;
}, function(error) {
   return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function(response) {
   console.log(response.status)
   return response;
}, function(error) {
   if(error.response) {
      if (error.response.status === 401 || (error.response.status === 400)) {
         clearLocalStorage();
         window.location.href = "/login";
      }
   }
   return Promise.reject(error);
});

export default axiosInstance;