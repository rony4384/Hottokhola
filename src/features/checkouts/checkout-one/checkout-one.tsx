import React, { useContext, useState, useEffect } from "react";
import Router from "next/router";
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
import { openModal } from "@redq/reuse-modal";
import { useMutation } from "@apollo/react-hooks";
import CheckoutWrapper, {
  CheckoutContainer,
  OrderSummary,
  OrderSummaryItem,
  OrderLabel,
  OrderAmount,
  DeliverySchedule,
  Heading,
  DeliveryAddress,
  ButtonGroup,
  Contact,
  PaymentOption,
  CheckoutSubmit,
  CouponBoxWrapper,
  ErrorMsg,
} from "./checkout-one.style";

import CouponBox, { CouponDisplay } from "components/coupon-box/coupon-box";
import { ProfileContext } from "contexts/profile/profile.context";
import { FormattedMessage } from "react-intl";
import { useCart } from "contexts/cart/use-cart";
import { APPLY_COUPON } from "graphql/mutation/coupon";
import { useAppState } from "contexts/app/app.provider";
import { AuthContext } from "contexts/auth/auth.context";

// The type of props Checkout Form receives
interface MyFormProps {
  token: string;
  deviceType: any;
  message?: any;
}

const Checkout: React.FC<MyFormProps> = ({ token, deviceType, message }) => {
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
  const inside_dhaka_shipping_charge = useAppState(
    "inside_dhaka_shipping_charge"
  );
  const outside_dhaka_shipping_charge = useAppState(
    "outside_dhaka_shipping_charge"
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setError] = useState("");
  const { state, dispatch } = useContext(ProfileContext);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState([]);
  const { addresses, card, schedules } = state;
  const {
    authState: { mobile_number },
    authDispatch,
  } = useContext<any>(AuthContext);

  const [deleteContactMutation] = useMutation(DELETE_CONTACT);
  const [deleteAddressMutation] = useMutation(DELETE_ADDRESS);
  const [deletePaymentCardMutation] = useMutation(DELETE_CARD);
  const [appliedCoupon] = useMutation(APPLY_COUPON);
  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted({ placeOrder }) {
      if (placeOrder) {
        if (placeOrder.payment_method === "COD") {
          Router.push("/order?message=success");
        } else {
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
      !errors.length
    ) {
      setIsValid(true);
    }
  }, [state]);
  useEffect(() => {
    if (addresses.length == 1) {
      handleApplyShipping(addresses[0]);
    }
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

  const handleApplyShipping = (address) => {
    if (address.district.toLowerCase() === "dhaka") {
      applyShipping(parseFloat(inside_dhaka_shipping_charge));
    } else {
      applyShipping(parseFloat(outside_dhaka_shipping_charge));
    }
  };

  const handleOnUpdate = (couponCode: any) => {
    setCouponCode(couponCode);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CheckoutWrapper>
        <CheckoutContainer>
          {message && (
            <Button
              disabled={true}
              size="big"
              style={{ width: "100%" }}
              variant="primary"
            >
              {message}
            </Button>
          )}
          <OrderSummary>
            <OrderSummaryItem style={{ marginBottom: 15 }}>
              <OrderLabel>
                <FormattedMessage id="subTotal" defaultMessage="Subtotal" /> (
                {cartItemsCount}{" "}
                <FormattedMessage id="itemsText" defaultMessage="items" />)
              </OrderLabel>
              <OrderAmount>৳{calculateSubTotalPrice()}</OrderAmount>
            </OrderSummaryItem>

            <OrderSummaryItem style={{ marginBottom: 30 }}>
              <OrderLabel>
                <FormattedMessage
                  id="shippinFeeText"
                  defaultMessage="Shipping Fee"
                />
              </OrderLabel>
              <OrderAmount>৳{shipping}</OrderAmount>
            </OrderSummaryItem>

            <OrderSummaryItem
              style={{ marginBottom: 30 }}
              className="voucherWrapper"
            >
              <OrderLabel>
                <FormattedMessage id="voucherText" defaultMessage="Voucher" />
              </OrderLabel>
              {coupon ? (
                <CouponDisplay
                  code={coupon.code}
                  sign="-"
                  currency="৳"
                  price={calculateDiscount()}
                  onClick={(e) => {
                    e.preventDefault();
                    removeCoupon();
                  }}
                />
              ) : (
                <>
                  <CouponBoxWrapper>
                    <CouponBox
                      buttonTitle="Apply"
                      intlCouponBoxPlaceholder="couponPlaceholder"
                      onClick={handleApplyCoupon}
                      value={couponCode}
                      onUpdate={handleOnUpdate}
                      style={{ maxWidth: 350, height: 50 }}
                      intlCouponApplyButton="voucherApply"
                    />
                    {couponError && (
                      <ErrorMsg>
                        <FormattedMessage
                          id="couponError"
                          defaultMessage={couponError}
                        />
                      </ErrorMsg>
                    )}
                  </CouponBoxWrapper>
                </>
              )}
            </OrderSummaryItem>

            <OrderSummaryItem>
              <OrderLabel>
                <FormattedMessage id="totalText" defaultMessage="Total" />
              </OrderLabel>
              <OrderAmount>৳{calculatePrice()}</OrderAmount>
            </OrderSummaryItem>
          </OrderSummary>
          {/* DeliverySchedule */}
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
                  title={item.title}
                  footer={"asdf"}
                  content={item.time_slot}
                  name="schedule"
                  checked={item.type === "primary"}
                  withActionButtons={false}
                  onChange={() =>
                    dispatch({
                      type: "SET_PRIMARY_SCHEDULE",
                      payload: item.id.toString(),
                    })
                  }
                />
              )}
            />
          </DeliverySchedule>
          {/* DeliveryAddress */}
          <DeliveryAddress>
            <Heading>
              <FormattedMessage
                id="checkoutDeliveryAddress"
                defaultMessage="Select Your Delivery Address"
              />
            </Heading>
            <ButtonGroup>
              <RadioGroup
                items={addresses}
                component={(item: any) => (
                  <RadioCard
                    id={item.id}
                    key={item.id}
                    title={item.contact_number}
                    content={item.address}
                    footer=""
                    name="address"
                    checked={item.type === "primary" || addresses.length == 1}
                    onChange={() => {
                      dispatch({
                        type: "SET_PRIMARY_ADDRESS",
                        payload: item.id.toString(),
                      });
                      handleApplyShipping(item);
                    }}
                    onEdit={() => handleEditDelete(item, "edit", "address")}
                    onDelete={() => handleEditDelete(item, "delete", "address")}
                  />
                )}
                secondaryComponent={
                  // <Button
                  //   title="Add Address"
                  //   iconPosition="right"
                  //   colors="primary"
                  //   size="small"
                  //   variant="outlined"
                  //   type="button"
                  //   intlButtonId="addAddressBtn"
                  //   onClick={() =>
                  //     handleModal(UpdateAddress, 'add-address-modal')
                  //   }
                  // />

                  <Button
                    size="big"
                    variant="outlined"
                    type="button"
                    className="add-button"
                    onClick={() =>
                      handleModal(
                        UpdateAddress,
                        { profileState: state, contact_number: mobile_number },
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
          </DeliveryAddress>
          <PaymentOption>
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
              onEditDeleteField={(item: any, type: string) => console.log("")}
              onChange={(item: any) =>
                dispatch({
                  type: "SET_PRIMARY_CARD",
                  payload: item.id,
                })
              }
              handleAddNewCard={() => {
                console.log("");
              }}
            />
          </PaymentOption>
          {/* <PaymentOption>
            <Heading>
              <FormattedMessage
                id="selectPaymentText"
                defaultMessage="Select Payment Option"
              />
            </Heading>
            <RadioCard
              id="online"
              key="online"
              title="Pay Now"
              subTitle=""
              content=""
              name="payment_option"
              checked={true}
              value="online"
              onChange={() =>
                dispatch({
                  type: "SET_PRIMARY_CARD",
                  payload: "online",
                })
              }
            />
            <RadioCard
              id="cash_on_delivery"
              key="cash_on_delivery"
              title="Cash on Delivery"
              subTitle=""
              content=""
              name="payment_option"
              checked={false}
              value="cash_on_delivery"
              onChange={() =>
                dispatch({
                  type: "SET_PRIMARY_CARD",
                  payload: "cash_on_delivery",
                })
              }
            />
          </PaymentOption> */}
          {/* CheckoutSubmit */}
          <CheckoutSubmit>
            {/* <Button
              onClick={handleSubmit}
              type='button'
              disabled={!isValid}
              title='Proceed to Checkout'
              // size='small'
              intlButtonId='proceesCheckout'
              loader={<Loader />}
              isLoading={loading}
            /> */}
            {errors}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isValid}
              size="big"
              loading={loading}
              style={{ width: "100%" }}
            >
              <FormattedMessage
                id="proceesCheckout"
                defaultMessage="Checkout"
              />
            </Button>
          </CheckoutSubmit>
        </CheckoutContainer>
      </CheckoutWrapper>
    </form>
  );
};

export default Checkout;
