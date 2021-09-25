import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { Button } from "components/button/button";
import RadioCard from "components/radio-card/radio-card";
import RadioGroup from "components/radio-group/radio-group";
import PaymentGroup from "components/payment-group/payment-group";
import UpdateAddress from "components/address-card/address-card";
import UpdateContact from "components/contact-card/contact-card";
import StripePaymentForm from "features/payment/stripe-form";
import { DELETE_ADDRESS } from "graphql/mutation/address";
import { DELETE_CARD } from "graphql/mutation/card";
import { DELETE_CONTACT } from "graphql/mutation/contact";
import { PLACE_ORDER } from "graphql/mutation/order";
import { UPDATE_ME } from "graphql/mutation/me";
import { CURRENCY } from "utils/constant";
import { openModal } from "@redq/reuse-modal";
import { useMutation } from "@apollo/react-hooks";
import { Scrollbars } from "react-custom-scrollbars";
import CheckoutWrapper, {
  CheckoutContainer,
  CheckoutInformation,
  InformationBox,
  DeliverySchedule,
  Heading,
  ButtonGroup,
  CheckoutSubmit,
  HaveCoupon,
  CouponBoxWrapper,
  CouponInputBox,
  Input,
  CouponCode,
  RemoveCoupon,
  ErrorMsg,
  TermConditionText,
  TermConditionLink,
  CartWrapper,
  CalculationWrapper,
  OrderInfo,
  Title,
  ItemsWrapper,
  Items,
  Quantity,
  Multiplier,
  ItemInfo,
  Price,
  TextWrapper,
  Text,
  Bold,
  Small,
  NoProductMsg,
  IconWrapper,
} from "./checkout-two.style";

import { Plus } from "assets/icons/PlusMinus";

import Sticky from "react-stickynode";
// import { HeaderContext } from 'contexts/header/header.context';

import { ProfileContext } from "contexts/profile/profile.context";
import { FormattedMessage } from "react-intl";
import { useCart } from "contexts/cart/use-cart";
import { APPLY_COUPON } from "graphql/mutation/coupon";
import { useLocale } from "contexts/language/language.provider";
import { useWindowSize } from "utils/useWindowSize";
import { useAppState } from "contexts/app/app.provider";
import { AuthContext } from "contexts/auth/auth.context";
import { Row, Col } from "react-styled-flexboxgrid";

// The type of props Checkout Form receives
interface MyFormProps {
  token: string;
  deviceType: any;
  message?: any;
}

type CartItemProps = {
  product: any;
};

const OrderItem: React.FC<CartItemProps> = ({ product }) => {
  const { id, quantity, title, name, unit, price, sale_price } = product;
  const displayPrice = sale_price ? sale_price : price;
  return (
    <Items key={id}>
      <Quantity>{quantity}</Quantity>
      <Multiplier>x</Multiplier>
      <ItemInfo>
        {name ? name : title} {unit ? `| ${unit}` : ""}
      </ItemInfo>
      <Price>
        {CURRENCY}
        {(displayPrice * quantity).toFixed(2)}
      </Price>
    </Items>
  );
};

const CheckoutWithSidebar: React.FC<MyFormProps> = ({
  token,
  deviceType,
  message,
}) => {
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setError] = useState("");
  const { state, dispatch } = useContext(ProfileContext);
  const { isRtl } = useLocale();
  const {
    items,
    removeCoupon,
    coupon,
    shipping,
    applyCoupon,
    applyShipping,
    clearCart,
    cartItemsCount,
    calculatePrice,
    calculateDiscount,
    calculateSubTotalPrice,
    isRestaurant,
    toggleRestaurant,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);
  const { addresses, contact, card, schedules } = state;
  const {
    authState: { name, mobile_number },
    authDispatch,
  } = useContext<any>(AuthContext);

  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [deleteAddressMutation] = useMutation(DELETE_ADDRESS);
  const [deletePaymentCardMutation] = useMutation(DELETE_CARD);
  const [appliedCoupon] = useMutation(APPLY_COUPON);
  const size = useWindowSize();

  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted({ placeOrder }) {
      if (placeOrder) {
        if (placeOrder.payment_method === "COD") {
          Router.push("/order?message=success");
        } else {
          console.log(placeOrder.redirect_url);
          window.location.replace(placeOrder.redirect_url);
        }
        clearCart();
        removeCoupon();
      } else {
        setErrors(["Something went wrong! Please refresh your cart."]);
      }
      setLoading(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return false;
    setLoading(true);
    let newErrors = [];
    if (e.target.address.value === "") newErrors.push("Please Select Address");
    if (e.target.schedule.value === "")
      newErrors.push("Please Select Delivery Schedule");
    if (e.target.payment.value === "")
      newErrors.push("Please Select Payment Method");

    if (newErrors.length == 0 && isValid) {
      placeOrder({
        variables: {
          coupon_id: coupon ? coupon.id : null,
          sub_total: calculateSubTotalPrice(),
          discount_amount: calculateDiscount(),
          shipping_charge: shipping,
          total: calculatePrice(),
          address: e.target.address.value,
          schedule: e.target.schedule.value,
          details: items.map((x) => ({
            id: x.id,
            quantity: x.quantity,
            price:
              x.sale_price && x.sale_price > 0
                ? Math.min(x.price, x.sale_price)
                : x.price,
          })),
          // products: items,
          payment_method: e.target.payment.value,
        },
      });
    } else {
      setLoading(false);
    }

    setErrors(newErrors);
  };

  useEffect(() => {
    if (
      calculatePrice() > 0 &&
      cartItemsCount > 0 &&
      addresses.length &&
      // contact.length &&
      !errors.length &&
      schedules.length
    ) {
      setIsValid(true);
    }
  }, [state]);
  useEffect(() => {
    return () => {
      if (isRestaurant) {
        toggleRestaurant();
        clearCart();
      }
    };
  }, []);
  // Add or edit modal
  const handleModal = (
    modalComponent: any,
    modalProps = {},
    className: string = "add-address-modal"
  ) => {
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
      const modalComponent = name === "address" ? UpdateAddress : UpdateContact;
      handleModal(
        modalComponent,
        { profileState: state, ...item },
        "add-address-modal"
      );
    } else {
      switch (name) {
        case "payment":
          dispatch({ type: "DELETE_CARD", payload: item.id });

          return await deletePaymentCardMutation({
            variables: { cardId: JSON.stringify(item.id) },
          });
        case "contact":
          dispatch({ type: "DELETE_CONTACT", payload: item.id });

          return await deleteContactMutation({
            variables: { contactId: JSON.stringify(item.id) },
          });
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

  const handleApplyCoupon = async () => {
    const { data }: any = await appliedCoupon({
      variables: { code: couponCode },
    });

    if (data.coupon && data.coupon.discount_amount) {
      if (
        data.coupon.minimum_purchase_amount > 0 &&
        data.coupon.minimum_purchase_amount > calculatePrice()
      ) {
        setError("Invalid Coupon");
      } else {
        applyCoupon(data.coupon);
        setCouponCode("");
      }
    } else {
      setError("Invalid Coupon");
    }
  };

  const handleApplyShipping = (item) => {
    applyShipping(item.shipping_charge);
  };

  const handleOnUpdate = (code: any) => {
    setCouponCode(code);
  };

  const handleChange = (value: string, field: string) => {
    dispatch({ type: "HANDLE_ON_INPUT_CHANGE", payload: { value, field } });
  };

  const [updateCustomer] = useMutation(UPDATE_ME);

  const handleSave = async () => {
    setIsLoading(true);
    const { id, email } = state;
    await updateCustomer({
      variables: { id: id, email: email },
    });
    setIsLoading(false);
  };

  const info = [
    { key: "Name", value: name },
    { key: "Mobile Number", value: mobile_number },
  ];

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CheckoutWrapper>
        <CheckoutContainer>
          <CheckoutInformation>
            {/* DeliveryAddress */}
            <InformationBox>
              <Heading>
                <FormattedMessage id="na" defaultMessage="Your Info" />
              </Heading>

              <RadioGroup
                items={info}
                component={(item: any) => (
                  <RadioCard
                    id={item.key}
                    key={item.key}
                    footer=""
                    title={item.key}
                    content={item.value}
                    name="info"
                    checked={false}
                    withActionButtons={false}
                    onChange={() => {}}
                  />
                )}
              />
            </InformationBox>
            <InformationBox>
              <Heading>
                <FormattedMessage
                  id="checkoutDeliveryAddress"
                  defaultMessage="Delivery Address"
                />
              </Heading>
              <ButtonGroup>
                <RadioGroup
                  items={addresses}
                  component={(item: any) => (
                    <RadioCard
                      id={item.id}
                      key={item.id}
                      footer=""
                      title={item.name}
                      content={item.address}
                      name="address"
                      checked={item.type === "primary" || addresses.length == 1}
                      onChange={() =>
                        dispatch({
                          type: "SET_PRIMARY_ADDRESS",
                          payload: item.id.toString(),
                        })
                      }
                      onEdit={() => handleEditDelete(item, "edit", "address")}
                      onDelete={() =>
                        handleEditDelete(item, "delete", "address")
                      }
                    />
                  )}
                  secondaryComponent={
                    // <Button
                    //   className="addButton"
                    //   variant="text"
                    //   type="button"
                    //   onClick={() =>
                    //     handleModal(UpdateAddress, "add-address-modal")
                    //   }
                    // >
                    //   <IconWrapper>
                    //     <Plus width="10px" />
                    //   </IconWrapper>
                    //   <FormattedMessage id="addNew" defaultMessage="Add New" />
                    // </Button>
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
                      style={{ borderStyle: "dashed" }}
                    >
                      <FormattedMessage
                        id="addAddressBtn"
                        defaultMessage="Add Address"
                      />
                    </Button>
                  }
                />
              </ButtonGroup>
            </InformationBox>

            {/* DeliverySchedule */}
            <InformationBox>
              <DeliverySchedule>
                <Heading>
                  <FormattedMessage
                    id="deliverySchedule"
                    defaultMessage="Select Your Delivery Schedule"
                  />
                </Heading>
                <RadioGroup
                  items={schedules}
                  component={(item: any) => (
                    <RadioCard
                      id={item.id}
                      key={item.id}
                      footer={CURRENCY + item.shipping_charge}
                      title={item.title}
                      content={item.time}
                      name="schedule"
                      checked={item.type === "primary"}
                      withActionButtons={false}
                      onChange={() => {
                        dispatch({
                          type: "SET_PRIMARY_SCHEDULE",
                          payload: item.id.toString(),
                        });
                        handleApplyShipping(item);
                      }}
                    />
                  )}
                />
              </DeliverySchedule>
            </InformationBox>

            <InformationBox>
              <Heading>
                <FormattedMessage
                  id="emailUpdateText"
                  defaultMessage="Update E-mail"
                />
              </Heading>
              <Row>
                <Col xs={12} sm={8} md={8} lg={8}>
                  <Input
                    type="email"
                    // label="Email"
                    value={state.email ? state.email : ""}
                    onUpdate={(value: string) => handleChange(value, "email")}
                    style={{
                      backgroundColor: "#F7F7F7",
                      width: "100%",
                    }}
                    placeholder="E-mail"
                    intlInputLabelId="profileEmailField"
                    intlPlaceholderId="profileEmailField"
                  />
                </Col>
                <Col xs={12} sm={2} md={2} lg={2}>
                  <Button size="big" onClick={handleSave} loading={isLoading}>
                    <FormattedMessage
                      id="profileSaveBtn"
                      defaultMessage="Save"
                    />
                  </Button>
                </Col>
              </Row>
            </InformationBox>

            {/* Contact number */}
            {/* <InformationBox>
              <Heading>
                <FormattedMessage
                  id="contactNumberText"
                  defaultMessage="Select Your Contact Number"
                />
              </Heading>
              <ButtonGroup>
                <RadioGroup
                  items={contact}
                  component={(item: any) => (
                    <RadioCard
                      id={item.id}
                      key={item.id}
                      footer=""
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
                      className="addButton"
                      variant="text"
                      type="button"
                      onClick={() =>
                        handleModal(UpdateContact, "add-contact-modal")
                      }
                    >
                      <IconWrapper>
                        <Plus width="10px" />
                      </IconWrapper>
                      <FormattedMessage
                        id="addContactBtn"
                        defaultMessage="Add Contact"
                      />
                    </Button>
                  }
                />
              </ButtonGroup>
            </InformationBox> */}
            {/* PaymentOption */}

            <InformationBox
              className="paymentBox"
              style={{ paddingBottom: 30 }}
            >
              <Heading>
                <FormattedMessage
                  id="selectPaymentText"
                  defaultMessage="Select Payment Option"
                />
              </Heading>
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
                    payload: item.id,
                  })
                }
                handleAddNewCard={() => {
                  // handleModal(
                  //   StripePaymentForm,
                  //   { totalPrice: calculatePrice() },
                  //   "add-address-modal stripe-modal"
                  // );
                }}
              />

              {/* Coupon start */}
              {coupon ? (
                <CouponBoxWrapper>
                  <CouponCode>
                    <FormattedMessage id="couponApplied" />
                    <span>{coupon.code}</span>

                    <RemoveCoupon
                      onClick={(e) => {
                        e.preventDefault();
                        removeCoupon();
                        setHasCoupon(false);
                      }}
                    >
                      <FormattedMessage id="removeCoupon" />
                    </RemoveCoupon>
                  </CouponCode>
                </CouponBoxWrapper>
              ) : (
                <CouponBoxWrapper>
                  {!hasCoupon ? (
                    <HaveCoupon onClick={() => setHasCoupon((prev) => !prev)}>
                      <FormattedMessage
                        id="specialCode"
                        defaultMessage="Have a special code?"
                      />
                    </HaveCoupon>
                  ) : (
                    <>
                      <CouponInputBox>
                        <Input
                          onUpdate={handleOnUpdate}
                          value={couponCode}
                          intlPlaceholderId="couponPlaceholder"
                        />
                        {/* <Button
                          onClick={handleApplyCoupon}
                          title='Apply'
                          intlButtonId='voucherApply'
                        /> */}
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          size="big"
                        >
                          <FormattedMessage
                            id="voucherApply"
                            defaultMessage="Apply"
                          />
                        </Button>
                      </CouponInputBox>

                      {couponError && (
                        <ErrorMsg>
                          <FormattedMessage
                            id="couponError"
                            defaultMessage={couponError}
                          />
                        </ErrorMsg>
                      )}
                    </>
                  )}
                </CouponBoxWrapper>
              )}

              <TermConditionText>
                <FormattedMessage
                  id="termAndConditionHelper"
                  defaultMessage="By making this purchase you agree to our"
                />
                <Link href="#">
                  <TermConditionLink>
                    <FormattedMessage
                      id="termAndCondition"
                      defaultMessage="terms and conditions."
                    />
                  </TermConditionLink>
                </Link>
              </TermConditionText>

              {/* CheckoutSubmit */}
              <CheckoutSubmit>
                {/* <Button
                  onClick={handleSubmit}
                  type='button'
                  disabled={!isValid}
                  title='Proceed to Checkout'
                  intlButtonId='proceesCheckout'
                  loader={<Loader />}
                  isLoading={loading}
                /> */}
                {errors.length ? (
                  <ul style={{ padding: "10px" }}>
                    {errors.map((i) => (
                      <small>
                        <li>{i}</li>
                      </small>
                    ))}
                  </ul>
                ) : (
                  ""
                )}

                <Button
                  type="submit"
                  // onClick={handleSubmit}
                  disabled={!isValid}
                  size="big"
                  loading={loading}
                  style={{ width: "100%" }}
                >
                  <FormattedMessage
                    id="proceesCheckout"
                    defaultMessage="Proceed to Checkout"
                  />
                </Button>
              </CheckoutSubmit>
            </InformationBox>
          </CheckoutInformation>

          <CartWrapper>
            {/* <Sticky enabled={true} top={totalHeight} innerZ={999}> */}
            <Sticky
              enabled={size.width >= 768 ? true : false}
              top={120}
              innerZ={999}
            >
              <OrderInfo>
                <Title>
                  <FormattedMessage
                    id="cartTitle"
                    defaultMessage="Your Order"
                  />
                </Title>

                <Scrollbars
                  universal
                  autoHide
                  autoHeight
                  autoHeightMax="390px"
                  renderView={(props) => (
                    <div
                      {...props}
                      style={{
                        ...props.style,
                        marginLeft: isRtl ? props.style.marginRight : 0,
                        marginRight: isRtl ? 0 : props.style.marginRight,
                        paddingLeft: isRtl ? 15 : 0,
                        paddingRight: isRtl ? 0 : 15,
                      }}
                    />
                  )}
                >
                  <ItemsWrapper>
                    {cartItemsCount > 0 ? (
                      items.map((item) => (
                        <OrderItem key={`cartItem-${item.id}`} product={item} />
                      ))
                    ) : (
                      <NoProductMsg>
                        <FormattedMessage
                          id="noProductFound"
                          defaultMessage="No products found"
                        />
                      </NoProductMsg>
                    )}
                  </ItemsWrapper>
                </Scrollbars>

                <CalculationWrapper>
                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id="subTotal"
                        defaultMessage="Subtotal"
                      />
                    </Text>
                    <Text>
                      {CURRENCY}
                      {calculateSubTotalPrice()}
                    </Text>
                  </TextWrapper>

                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id="shippinFeeText"
                        defaultMessage="Shipping Fee"
                      />
                    </Text>
                    <Text>{CURRENCY + shipping}</Text>
                  </TextWrapper>

                  <TextWrapper>
                    <Text>
                      <FormattedMessage
                        id="discountText"
                        defaultMessage="Discount"
                      />
                    </Text>
                    <Text>
                      {CURRENCY}
                      {calculateDiscount()}
                    </Text>
                  </TextWrapper>

                  <TextWrapper style={{ marginTop: 20 }}>
                    <Bold>
                      <FormattedMessage id="totalText" defaultMessage="Total" />{" "}
                      <Small>
                        (
                        <FormattedMessage
                          id="vatText"
                          defaultMessage="Incl. VAT"
                        />
                        )
                      </Small>
                    </Bold>
                    <Bold>
                      {CURRENCY}
                      {calculatePrice()}
                    </Bold>
                  </TextWrapper>
                </CalculationWrapper>
              </OrderInfo>
            </Sticky>
          </CartWrapper>
        </CheckoutContainer>
      </CheckoutWrapper>
    </form>
  );
};

export default CheckoutWithSidebar;
