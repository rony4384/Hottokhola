import React, { useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Col } from "react-styled-flexboxgrid";
import { openModal } from "@redq/reuse-modal";
import RadioCard from "components/radio-card/radio-card";
import { ProfileContext } from "contexts/profile/profile.context";
import { DELETE_ADDRESS } from "graphql/mutation/address";
import { AuthContext } from "contexts/auth/auth.context";
// import { DELETE_CARD } from "graphql/mutation/card";
// import { DELETE_CONTACT } from "graphql/mutation/contact";
// import StripePaymentForm from "features/payment/stripe-form";
import Router from "next/router";
import {
  SettingsForm,
  SettingsFormContent,
  HeadingSection,
  Title,
  Input,
  Row,
  ButtonGroup,
} from "./settings.style";
import RadioGroup from "components/radio-group/radio-group";
import PaymentGroup from "components/payment-group/payment-group";
import UpdateAddress from "components/address-card/address-card";
import UpdateContact from "components/contact-card/contact-card";
import { Button } from "components/button/button";
import { UPDATE_ME } from "graphql/mutation/me";
import { FormattedMessage } from "react-intl";

type SettingsContentProps = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const SettingsContent: React.FC<SettingsContentProps> = ({ deviceType }) => {
  const { state, dispatch } = useContext(ProfileContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [updateCustomer] = useMutation(UPDATE_ME, {
    onCompleted({ updateCustomer }) {
      if (updateCustomer) {
        localStorage.setItem("api_token", updateCustomer.api_token);
        localStorage.setItem("name", updateCustomer.name);
        localStorage.setItem("mobile_number", updateCustomer.mobile_number);
        // setCookie("api_token", updateCustomer.api_token);
        // authDispatch({
        //   type: "SIGNIN_SUCCESS",
        //   api_token: updateCustomer.api_token,
        //   name: updateCustomer.name,
        //   mobile_number: updateCustomer.mobile_number,
        // });
      }
      setIsLoading(false);
      Router.reload();
    },
  });
  // const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [deleteAddressMutation] = useMutation(DELETE_ADDRESS);
  // const [deletePaymentCardMutation] = useMutation(DELETE_CARD);

  const { addresses, contact, card } = state;
  const {
    authState: { mobile_number },
    authDispatch,
  } = useContext<any>(AuthContext);

  const handleChange = (value: string, field: string) => {
    dispatch({ type: "HANDLE_ON_INPUT_CHANGE", payload: { value, field } });
  };
  // Add or edit modal
  const handleModal = (
    modalComponent: any,
    modalProps = {},
    className: string = "add-address-modal"
  ) => {
    console.log(modalProps);
    openModal({
      show: true,
      config: {
        width: 360,
        height: "auto",
        enableResizing: false,
        disableDragging: true,
        className: className,
      },
      closeOnClickOutside: true,
      component: modalComponent,
      componentProps: { item: modalProps },
    });
  };

  const handleEditDelete = async (item: any, type: string, name: string) => {
    if (type === "edit") {
      console.log(item, "item");
      const modalComponent = name === "address" ? UpdateAddress : UpdateContact;
      handleModal(
        modalComponent,
        { profileState: state, ...item },
        "add-address-modal"
      );
    } else {
      switch (name) {
        // case "payment":
        //   dispatch({ type: "DELETE_CARD", payload: item.id });

        //   return await deletePaymentCardMutation({
        //     variables: { cardId: JSON.stringify(item.id) },
        //   });
        // case "contact":
        //   dispatch({ type: "DELETE_CONTACT", payload: item.id });

        //   return await deleteContactMutation({
        //     variables: { contactId: JSON.stringify(item.id) },
        //   });
        case "address":
          dispatch({ type: "DELETE_ADDRESS", payload: item.id });

          return await deleteAddressMutation({
            variables: { id: item.id },
          });
        default:
          return false;
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    const { id, name, email } = state;
    await updateCustomer({
      variables: { id: id, name: name, email: email },
    });
  };

  return (
    <SettingsForm>
      <SettingsFormContent>
        <HeadingSection>
          <Title>
            <FormattedMessage
              id="profilePageTitle"
              defaultMessage="Your Profile"
            />
          </Title>
        </HeadingSection>
        <Row style={{ alignItems: "flex-end", marginBottom: "50px" }}>
          <Col xs={12} sm={5} md={5} lg={5}>
            <Input
              type="text"
              label="Name"
              value={state.name ? state.name : ""}
              onUpdate={(value: string) => handleChange(value, "name")}
              style={{ backgroundColor: "#F7F7F7" }}
              placeholder="Name"
              intlInputLabelId="profileNameField"
              intlPlaceholderId="profileNameField"
            />
          </Col>

          <Col xs={12} sm={5} md={5} lg={5}>
            <Input
              type="email"
              label="Email"
              value={state.email ? state.email : ""}
              onUpdate={(value: string) => handleChange(value, "email")}
              style={{ backgroundColor: "#F7F7F7" }}
              placeholder="E-mail"
              intlInputLabelId="profileEmailField"
              intlPlaceholderId="profileEmailField"
            />
          </Col>

          <Col xs={12} sm={2} md={2} lg={2}>
            <Button
              size="big"
              style={{ width: "100%" }}
              onClick={handleSave}
              loading={isLoading}
            >
              <FormattedMessage id="profileSaveBtn" defaultMessage="Save" />
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={5} md={5} lg={5}>
            <Input
              type="text"
              label="Mobile Number"
              value={mobile_number ? mobile_number : ""}
              style={{ backgroundColor: "#F7F7F7" }}
              disabled={true}
              onUpdate={() => {}}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={{ position: "relative" }}>
            <SettingsFormContent>
              <HeadingSection>
                <Title>
                  <FormattedMessage
                    id="deliveryAddresTitle"
                    defaultMessage="Addresses"
                  />
                </Title>
              </HeadingSection>
              <ButtonGroup>
                <RadioGroup
                  items={addresses}
                  component={(item: any) => (
                    <RadioCard
                      id={item.id}
                      key={item.id}
                      title={item.name}
                      footer=""
                      content={item.address}
                      name="address"
                      checked={item.type === "primary"}
                      onChange={() =>
                        dispatch({
                          type: "SET_PRIMARY_ADDRESS",
                          payload: item.id,
                        })
                      }
                      // onEdit={() => handleEditDelete(item, "edit", "address")}
                      onEdit={() => handleEditDelete(item, "edit", "address")}
                      onDelete={() =>
                        handleEditDelete(item, "delete", "address")
                      }
                    />
                  )}
                  secondaryComponent={
                    <Button
                      size="big"
                      variant="outlined"
                      type="button"
                      className="add-button"
                      onClick={() =>
                        handleModal(
                          UpdateAddress,
                          {
                            profileState: state,
                            contact_number: mobile_number,
                          },
                          "add-address-modal"
                        )
                      }
                    >
                      {console.log(mobile_number, "mobile")}
                      <FormattedMessage
                        id="addAddressBtn"
                        defaultMessage="Add Address"
                      />
                    </Button>
                  }
                />
              </ButtonGroup>
            </SettingsFormContent>
          </Col>
        </Row>
        {/*<Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <SettingsFormContent>
              <HeadingSection>
                <Title>
                  <FormattedMessage
                    id="contactNumberTItle"
                    defaultMessage="Contact Numbers"
                  />
                </Title>
              </HeadingSection>
              <ButtonGroup>
                <RadioGroup
                  items={contact}
                  component={(item: any) => (
                    <RadioCard
                      id={item.id}
                      key={item.id}
                      title={item.type}
                      content={item.number}
                      checked={item.type === "primary"}
                      onChange={() =>
                        dispatch({
                          type: "SET_PRIMARY_CONTACT",
                          payload: item.id.toString(),
                        })
                      }
                      name="contact"
                      onEdit={() => handleEditDelete(item, "edit", "contact")}
                      onDelete={() =>
                        handleEditDelete(item, "delete", "contact")
                      }
                    />
                  )}
                  secondaryComponent={
                    <Button
                      size="big"
                      variant="outlined"
                      type="button"
                      className="add-button"
                      onClick={() =>
                        handleModal(UpdateContact, {}, "add-contact-modal")
                      }
                    >
                      <FormattedMessage
                        id="addContactBtn"
                        defaultMessage="Add Contact"
                      />
                    </Button>
                  }
                />
              </ButtonGroup>
            </SettingsFormContent>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <SettingsFormContent>
              <HeadingSection>
                <Title>
                  <FormattedMessage
                    id="paymentCardTitle"
                    defaultMessage="Payments Card"
                  />
                </Title>
              </HeadingSection>
              <PaymentGroup
                name="payment"
                deviceType={deviceType}
                items={card}
                onEditDeleteField={(item: any, type: string) =>
                  handleEditDelete(item, type, "payment")
                }
                onChange={(item: any) =>
                  dispatch({
                    type: "SET_PRIMARY_CARD",
                    payload: item.id.toString(),
                  })
                }
                handleAddNewCard={() => {
                  handleModal(
                    StripePaymentForm,
                    { buttonText: "Add Card" },
                    "add-address-modal stripe-modal"
                  );
                }}
              />
            </SettingsFormContent>
          </Col>
        </Row> */}
      </SettingsFormContent>
    </SettingsForm>
  );
};

export default SettingsContent;
