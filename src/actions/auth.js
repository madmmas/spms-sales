import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
  } from "./types";
  
  import AuthService from "../services/AuthService";
    
  export const login = (username, password) => (dispatch) => {
    return AuthService.Login(username, password).then(
      (data) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: { user: data },
        });
        
        dispatch({
          type: SET_MESSAGE,
          payload: "Login successful",
        });

        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: LOGIN_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const logout = () => (dispatch) => {
    AuthService.Logout();
  
    dispatch({
      type: LOGOUT,
    });

    dispatch({
      type: SET_MESSAGE,
      payload: "Loout successful",
    });

  };