import {axiosInstance, clearLocalStorage} from "./AxiosService";
import env from "react-dotenv";

const Login = (username, password) => {
  return axiosInstance
    .post(env.AUTH_API_URL + "/login", {
      username,
      password,
    })
    .then((response) => {
      console.log(JSON.stringify(response.data))
      if (response.data.auth_token!=="") {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const Logout = () => {
  clearLocalStorage()
};

export default {
  Login,
  Logout,
};