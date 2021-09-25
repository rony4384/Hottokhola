import React from "react";
import { FormattedMessage } from "react-intl";
import Carousel from "components/carousel/carousel";
import PaymentCard from "../payment-card/payment-card";
import { Plus } from "assets/icons/PlusMinus";
import { Button } from "components/button/button";
import {
  Header,
  PaymentCardList,
  IconWrapper,
  SavedCard,
  OtherPayOption,
} from "./payment-group.style";
import sslczsm from "assets/images/sslczsm.png";

interface PaymentCardType {
  id: number | string;
  type: string;
  lastFourDigit: string;
  name: string;
}

interface PaymentOptionType {
  showCard?: boolean;
  addedCard?: PaymentCardType[];
  mobileWallet?: boolean;
  cashOnDelivery?: boolean;
}

interface PaymentGroupProps {
  id?: any;
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  name: string;
  disabled?: boolean;
  label?: string;
  className?: string;
  value?: string;
  onChange: Function;
  items: any;
  onEditDeleteField: any;
  handleAddNewCard: any;
}

const PaymentGroup: React.FunctionComponent<PaymentGroupProps> = ({
  items,
  deviceType,
  className,
  name,
  onChange,
  onEditDeleteField,
  handleAddNewCard,
}) => {
  // RadioGroup State

  // Handle onChange Func
  const handleChange = (item: any) => {
    onChange(item);
  };
  return (
    <>
      {/* {deviceType === 'desktop' && ( */}
      {/* <Header>
        {items.length !== 0 && (
          <SavedCard>
            <FormattedMessage id="savedCardsId" defaultMessage="Saved Cards" />
          </SavedCard>
        )}

        <Button
          variant="text"
          type="button"
          onClick={handleAddNewCard}
          className="addCard"
        >
          <IconWrapper>
            <Plus width="10px" />
          </IconWrapper>
          <FormattedMessage id="addCardBtn" defaultMessage="Add Card" />
        </Button>
      </Header> */}
      {/* <PaymentCardList>
        <Carousel
          deviceType={deviceType}
          autoPlay={false}
          infinite={false}
          data={items}
          component={(item: any) => (
            <PaymentCard
              key={item.id}
              onChange={() => handleChange(item)}
              onDelete={() => onEditDeleteField(item, "delete")}
              {...item}
            />
          )}
        />
      </PaymentCardList> */}

      {/* {items.mobileWallet === true || items.cashOnDelivery === true ? ( */}
      <OtherPayOption>
        {/* Mobile Wallet */}
        {/* {items.mobileWallet === true ? ( */}
        <label htmlFor="card" key="online-card" className="other-pay-radio">
          <input
            type="radio"
            id="card"
            name={name}
            value="online"
            onChange={handleChange}
          />
          <span>Card</span>
        </label>
        {/* ) : (
            ""
          )} */}

        {/* Cash On Delivery */}
        {/* {items.cashOnDelivery === true ? ( */}
        <label
          htmlFor="cash-on-delivery"
          key="cod-cash"
          className="other-pay-radio cash-on-delivery"
        >
          <input
            type="radio"
            id="cash-on-delivery"
            name={name}
            value="cod"
            onChange={handleChange}
          />
          <span>Cash On Delivery</span>
        </label>
        {/* ) : (
            ""
          )} */}

        <label
          htmlFor="mobile-wallet"
          key="mobile-wallet"
          className="other-pay-radio cash-on-delivery"
        >
          <input
            type="radio"
            id="mobile-wallet"
            name={name}
            value="online"
            onChange={handleChange}
          />
          <span>Mobile Wallet</span>
        </label>
      </OtherPayOption>
      <br />
      {/* <img src={sslczsm} width="95%" /> */}

      {/* ) : (
        ""
      )} */}
    </>
  );
};

export default PaymentGroup;
