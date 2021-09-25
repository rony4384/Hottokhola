import React, { useContext } from "react";
import {
  Wrapper,
  Container,
  LogoWrapper,
  Heading,
  SubHeading,
  Input,
  Button,
  LinkButton,
  Offer,
} from "./authentication-form.style";
import { FormattedMessage, useIntl } from "react-intl";
import { AuthContext } from "contexts/auth/auth.context";
import { UPDATE_ME } from "graphql/mutation/me";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import { closeModal } from "@redq/reuse-modal";

export default function ForgotPasswordModal() {
  const {
    authState: { id, isAuthenticated, api_token, mobile_number, props },
    authDispatch,
  } = useContext<any>(AuthContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [name, setName] = React.useState("");

  const [updateCustomer] = useMutation(UPDATE_ME, {
    onCompleted({ updateCustomer }) {
      if (updateCustomer) {
        localStorage.setItem("name", updateCustomer.name);
        authDispatch({
          type: "SIGNIN_SUCCESS",
          api_token: updateCustomer.api_token,
          name: updateCustomer.name,
          mobile_number: updateCustomer.mobile_number,
        });
        if (props.redirect_to) Router.push(props.redirect_to);
        if (!props.noModal) closeModal();
      }
      setIsLoading(false);
    },
  });

  const handleSave = async () => {
    setIsLoading(true);
    await updateCustomer({
      variables: { id: id, name: name },
    });
  };

  const intl = useIntl();
  const toggleSignInForm = () => {
    authDispatch({
      type: "SIGNIN",
    });
  };
  return (
    <Wrapper>
      <Container style={{ paddingBottom: 30 }}>
        <Heading>
          <FormattedMessage
            id="updateNameText"
            defaultMessage="Add Your Name"
          />
        </Heading>

        {/* <SubHeading>
          <FormattedMessage
            id="sendResetPassText"
            defaultMessage="We'll send you a link to reset your password"
          />
        </SubHeading> */}

        <Input
          type="text"
          placeholder={intl.formatMessage({
            id: "yourName",
            defaultMessage: "Your Name",
          })}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          variant="primary"
          size="big"
          style={{ width: "100%" }}
          type="submit"
          loading={isLoading}
          onClick={handleSave}
        >
          <FormattedMessage id="submitRequest" defaultMessage="Submit" />
        </Button>
        {/* <Offer style={{ padding: "20px 0 0" }}>
          <FormattedMessage id="backToSign" defaultMessage="Back to" />{" "}
          <LinkButton onClick={toggleSignInForm}>
            <FormattedMessage id="loginBtnText" defaultMessage="Login" />
          </LinkButton>
        </Offer> */}
      </Container>
    </Wrapper>
  );
}
