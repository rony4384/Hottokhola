import React, { useState, useEffect } from "react";
import { Button } from "components/button/button";
import Input from "components/input/input";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_PRODUCT_REQUEST } from "graphql/mutation/order";
import { openModal } from "@redq/reuse-modal";

import FormWrapper, {
  Row,
  Col,
  Container,
  FormTitleWrapper,
  FormTitle,
  NoteText,
  Heading,
  SubmitBtnWrapper,
} from "./request-product.style";
import { FormattedMessage } from "react-intl";

const PopUp = (props) => (
  <div style={{ textAlign: "center", paddingTop: "40px" }}>
    <h1 style={{ color: "#ff793f" }}>
      Success <i>!</i>{" "}
    </h1>
    <p>
      Successfully Submitted Product List <br />
      You will receive a phone call shortly
    </p>
  </div>
);

const Checkout: React.FC<any> = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [productName, setProductName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [addAddressMutation] = useMutation(CREATE_PRODUCT_REQUEST);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const createProductRequest = await addAddressMutation({
      variables: {
        product_name: productName,
        contact_number: contactNumber,
        product_description: productDescription,
      },
    });
    if (createProductRequest) {
      // setMessage("Successfully submitted product request.");
      openModal({
        config: {
          className: "successModal",
          disableDragging: false,
          width: 480,
          height: 180,
          animationFrom: { transform: "scale(0.3)" }, // react-spring <Spring from={}> props value
          animationTo: { transform: "scale(1)" }, //  react-spring <Spring to={}> props value
          transition: {
            mass: 1,
            tension: 130,
            friction: 26,
          }, // react-spring config props
        },
        withRnd: false,
        overlayClassName: "customeOverlayClass",
        closeOnClickOutside: false,
        component: PopUp,
      });

      setProductName("");
      setContactNumber("");
      setProductDescription("");
    }
    setLoading(false);
  };

  // Add or edit modal

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <FormWrapper>
        <Container>
          <FormTitleWrapper>
            <FormTitle>
              <FormattedMessage
                id="reqProduct"
                defaultMessage="Request Product"
              />
            </FormTitle>
          </FormTitleWrapper>

          <Row>
            <Col xs={12} sm={6} md={6} lg={6}>
              <Input
                type="text"
                label="Your Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={{ backgroundColor: "#F7F7F7" }}
                intlPlaceholderId="yourName"
                required
              />
            </Col>

            <Col xs={12} sm={6} md={6} lg={6}>
              <Input
                type="text"
                label="Contact Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                style={{ backgroundColor: "#F7F7F7" }}
                intlPlaceholderId="contactNumberTItle"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Input
                type="textarea"
                label="Product List"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                style={{ backgroundColor: "#F7F7F7" }}
                intlPlaceholderId="productDescription"
                required
              />
            </Col>
          </Row>
          <br />

          <Heading>
            <FormattedMessage id="noteHead" defaultMessage="Note" />
          </Heading>

          <NoteText>
            <FormattedMessage
              id="noteDescription"
              defaultMessage="After you giving us the shopping list, you will get a phone call from our support team to let you know the individual product prices and then confirm the order."
            />
          </NoteText>
          <strong style={{ color: "red" }}>{message}</strong>

          {/* 
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Heading>
                <FormattedMessage
                  id="rmProductImage"
                  defaultMessage="Upload product image"
                />
              </Heading>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Uploader onChange="" intlUploadText="rmUploadText" />
            </Col>
          </Row> */}

          <SubmitBtnWrapper>
            <Button
              type="submit"
              size="big"
              loading={loading}
              style={{ width: "100%" }}
            >
              <FormattedMessage
                id="submitRequest"
                defaultMessage="Submit Request"
              />
            </Button>
          </SubmitBtnWrapper>
        </Container>
      </FormWrapper>
    </form>
  );
};

export default Checkout;
