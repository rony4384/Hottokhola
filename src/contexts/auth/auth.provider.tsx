import React, { useReducer } from "react";
import { AuthContext } from "./auth.context";
const isBrowser = typeof window !== "undefined";
const INITIAL_STATE = {
  isAuthenticated: isBrowser && !!localStorage.getItem("api_token"),
  currentForm: "signIn",
  api_token: isBrowser && localStorage.getItem("api_token"),
  name: isBrowser && localStorage.getItem("name"),
  mobile_number: isBrowser && localStorage.getItem("mobile_number"),
};

function reducer(state: any, action: any) {
  // console.log(action, "auth");

  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        currentForm: "signIn",
      };
    case "SIGNIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        api_token: action.api_token,
        name: action.name,
        mobile_number: action.mobile_number,
      };
    case "UPDATE_NAME":
      return {
        ...state,
        isAuthenticated: true,
        id: action.id,
        api_token: action.api_token,
        name: action.name,
        mobile_number: action.mobile_number,
        currentForm: "updateName",
        props: action.props,
      };

    case "SIGN_OUT":
      return {
        ...state,
        isAuthenticated: false,
      };
    case "SIGNUP":
      return {
        ...state,
        currentForm: "signUp",
      };
    case "FORGOTPASS":
      return {
        ...state,
        currentForm: "forgotPass",
      };
    default:
      return state;
  }
}

export const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [authState, authDispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <AuthContext.Provider value={{ authState, authDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
