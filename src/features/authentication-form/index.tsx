import React, { useContext } from "react";
import SignInForm from "./login";
import SignOutForm from "./register";
import ForgotPassForm from "./forgot-password";
import UpdateName from "./update-name";
import { AuthContext } from "contexts/auth/auth.context";

export default function AuthenticationForm(props) {
  const { authState } = useContext<any>(AuthContext);
  let RenderForm;

  if (authState.currentForm === "signIn") {
    RenderForm = SignInForm;
  }

  // if (authState.currentForm === "signUp") {
  //   RenderForm = SignOutForm;
  // }

  // if (authState.currentForm === "forgotPass") {
  //   RenderForm = ForgotPassForm;
  // }

  if (authState.currentForm === "updateName") {
    RenderForm = UpdateName;
  }

  return (
    <RenderForm
      redirect_to={props.redirect}
      noModal={props.noModal}
      maxWidth={props.maxWidth}
    />
  );
}
