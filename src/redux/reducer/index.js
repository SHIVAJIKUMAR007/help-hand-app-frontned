import { authReducer } from "./auth";
import { combineReducers } from "redux";

export const allReducer = combineReducers({
  user: authReducer,
});
