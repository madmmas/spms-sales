import {axiosInstance, clearLocalStorage} from "./AxiosService";
import env from "react-dotenv";

const Login = async (username, password) => {
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

const GetUsername = (id) => {
  return axiosInstance.get(env.APP_API_URL + "/users/" + id).then((response) => {
    return response.data;
  });
}

export default {
  Login,
  Logout,
  GetUsername,
};