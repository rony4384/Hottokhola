import React, { useContext } from "react";
import {
  LinkButton,
  Button,
  IconWrapper,
  Wrapper,
  Container,
  LogoWrapper,
  Heading,
  SubHeading,
  OfferSection,
  Offer,
  Input,
  Divider,
} from "./authentication-form.style";
import Router from "next/router";
import { AuthContext } from "contexts/auth/auth.context";
import { FormattedMessage, useIntl } from "react-intl";
import { closeModal } from "@redq/reuse-modal";
import { LOGIN, VERIFY_OTP, RESEND_OTP } from "graphql/mutation/auth";
import { useMutation } from "@apollo/react-hooks";
// import { getCookie, setCookie } from "utils/session";

export default function SignInModal(props) {
  const intl = useIntl();
  const { authDispatch } = useContext<any>(AuthContext);
  const [mobile_number, setMobileNumber] = React.useState("");
  const [otp, setOTP] = React.useState(null);
  const [loginMessage, setLoginMessage] = React.useState("");
  const [showOtpField, setShowOtpField] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [resend, setResend] = React.useState(false);
  const [timer, setTimer] = React.useState(15);

  // const toggleSignUpForm = () => {
  //   authDispatch({
  //     type: "SIGNUP",
  //   });
  // };

  // const toggleForgotPassForm = () => {
  //   authDispatch({
  //     type: "FORGOTPASS",
  //   });
  // };

  const [login] = useMutation(LOGIN, {
    onCompleted({ login }) {
      if (login) {
        setShowOtpField(true);
        setLoginMessage(
          "An OTP has been send to your mobile number. Please verify."
        );
      }
      setIsLoading(false);
    },
  });

  const [verify_otp] = useMutation(VERIFY_OTP, {
    onCompleted({ verify_otp }) {
      if (verify_otp) {
        setOTP(null);
        setShowOtpField(false);
        localStorage.setItem("api_token", verify_otp.api_token);
        localStorage.setItem("name", verify_otp.name);
        localStorage.setItem("mobile_number", verify_otp.mobile_number);
        // setCookie("api_token", verify_otp.api_token);
        if (verify_otp.name === null) {
          console.log("No Name");
          authDispatch({
            type: "UPDATE_NAME",
            id: verify_otp.id,
            api_token: verify_otp.api_token,
            name: verify_otp.name,
            mobile_number: verify_otp.mobile_number,
            props: props,
          });
        } else {
          authDispatch({
            type: "SIGNIN_SUCCESS",
            api_token: verify_otp.api_token,
            name: verify_otp.name,
            mobile_number: verify_otp.mobile_number,
          });
          if (props.redirect_to) Router.push(props.redirect_to);
          if (!props.noModal) closeModal();
        }
      } else {
        setLoginMessage("OTP didn't match!");
      }
      setIsLoading(false);
    },
  });

  const [resend_otp] = useMutation(RESEND_OTP, {
    onCompleted({ resend_otp }) {
      if (resend_otp) {
        setTimer(15);
        setShowOtpField(true);
        setResend(false);
        setLoginMessage(
          "New OTP has been send to your mobile number. Please verify."
        );
      }
      setIsLoading(false);
    },
  });

  const submitForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (otp === null) {
      login({
        variables: {
          mobile_number: mobile_number,
        },
      });
    } else {
      verify_otp({
        variables: {
          mobile_number: mobile_number,
          otp: otp,
        },
      });
    }
  };

  const submitResendOtp = () => {
    setIsLoading(true);
    resend_otp({
      variables: {
        mobile_number: mobile_number,
      },
    });
  };

  React.useEffect(() => {
    if (timer > 0 && showOtpField) {
      setTimeout(() => setTimer(timer - 1), 1000);
    } else if (showOtpField) {
      setResend(true);
    }
  });

  const updateMobileNumberState = (number) => {
    if (number.length < 12) setMobileNumber(number);
  };

  const style = props.maxWidth ? { maxWidth: props.maxWidth } : {};

  return (
    <Wrapper>
      <Container style={{ ...style }}>
        <Heading>
          <FormattedMessage id="welcomeBack" defaultMessage="Welcome" />
        </Heading>

        <SubHeading>
          <FormattedMessage
            id="loginText"
            defaultMessage="Login with your mobile number"
          />
        </SubHeading>
        <form onSubmit={(e) => submitForm(e)} style={{ paddingBottom: "50px" }}>
          <Input
            type="text"
            placeholder={intl.formatMessage({
              id: "mobileNumberPlaceholder",
              defaultMessage: "Your Mobile Number",
            })}
            value={mobile_number}
            onChange={(e) => updateMobileNumberState(e.target.value)}
            required
          />
          {showOtpField && (
            <>
              <Input
                type="password"
                placeholder={intl.formatMessage({
                  id: "otpPlaceholder",
                  defaultMessage: "OTP",
                })}
                onChange={(e) => setOTP(e.target.value)}
                required
              />
              <small>{loginMessage}</small>
            </>
          )}
          {!isLoading && resend && (
            <Button
              variant="secondary"
              size="small"
              style={{ width: "100%" }}
              type="button"
              onClick={() => submitResendOtp()}
            >
              Resend OTP
            </Button>
          )}
          {!resend && showOtpField && (
            <>
              <br />
              <small>
                Resend OTP in {timer} second{timer > 1 ? "s" : ""}
              </small>
            </>
          )}
          {/* {console.log(isLoading, otp)} */}
          {isLoading || (otp === null && showOtpField) ? (
            <Button
              variant="primary"
              size="big"
              style={{ width: "100%" }}
              type="submit"
              loading={isLoading}
              disabled
            >
              <FormattedMessage id="continueBtn" defaultMessage="Continue" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="big"
              style={{ width: "100%" }}
              type="submit"
            >
              <FormattedMessage id="continueBtn" defaultMessage="Continue" />
            </Button>
          )}
        </form>
        {/* <Divider>
          <span>
            <FormattedMessage id="orText" defaultMessage="or" />
          </span>
        </Divider>

        <Button
          variant="primary"
          size="big"
          style={{
            width: '100%',
            backgroundColor: '#4267b2',
            marginBottom: 10,
          }}
          onClick={loginCallback}
        >
          <IconWrapper>
            <Facebook />
          </IconWrapper>
          <FormattedMessage
            id="continueFacebookBtn"
            defaultMessage="Continue with Facebook"
          />
        </Button>

        <Button
          variant="primary"
          size="big"
          style={{ width: '100%', backgroundColor: '#4285f4' }}
          onClick={loginCallback}
        >
          <IconWrapper>
            <Google />
          </IconWrapper>
          <FormattedMessage
            id="continueGoogleBtn"
            defaultMessage="Continue with Google"
          />
        </Button> 

        <Offer style={{ padding: "20px 0" }}>
          <FormattedMessage
            id="dontHaveAccount"
            defaultMessage="Don't have any account?"
          />{" "}
          <LinkButton onClick={toggleSignUpForm}>
            <FormattedMessage id="signUpBtnText" defaultMessage="Sign Up" />
          </LinkButton>
        </Offer> */}
      </Container>

      {/* <OfferSection>
        <Offer>
          <FormattedMessage
            id="forgotPasswordText"
            defaultMessage="Forgot your password?"
          />{" "}
          <LinkButton onClick={toggleForgotPassForm}>
            <FormattedMessage id="resetText" defaultMessage="Reset It" />
          </LinkButton>
        </Offer>
      </OfferSection> */}
    </Wrapper>
  );
}
