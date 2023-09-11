import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import product from "./product";
export default combineReducers({
  auth,
  message,
  product,
});