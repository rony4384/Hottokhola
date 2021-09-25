// product card for general
import React from "react";
import Image from "components/image/image";
import { Button } from "components/button/button";
import {
  ProductCardWrapper,
  ProductImageWrapper,
  ProductInfo,
  DiscountPercent,
  ButtonText,
} from "../product-card.style";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import { cartAnimation } from "utils/cart-animation";
import { FormattedMessage } from "react-intl";
import { CartIcon } from "assets/icons/CartIcon";

type ProductCardProps = {
  title: string;
  image: any;
  weight: string;
  currency: string;
  description: string;
  price: number;
  sale_price?: number;
  discount_in_percent?: number;
  data: any;
  type: string;
  slug: string;
  has_variations: number;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void;
  increment?: (e: any) => void;
  decrement?: (e: any) => void;
  cartProducts?: any;
  addToCart?: any;
  updateCart?: any;
  value?: any;
  deviceType?: any;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  weight,
  price,
  sale_price,
  discount_in_percent,
  cartProducts,
  addToCart,
  updateCart,
  value,
  currency,
  type,
  slug,
  has_variations,
  onChange,
  increment,
  decrement,
  data,
  deviceType,
  onClick,
  ...props
}) => {
  const { addItem, removeItem, getItem, isInCart, items } = useCart();
  const handleAddClick = (e) => {
    e.stopPropagation();
    addItem(data);
    if (!isInCart(data.id)) {
      cartAnimation(e);
    }
  };
  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeItem(data);
  };
  return (
    <ProductCardWrapper
      onClick={onClick}
      className="product-card"
      // onClick={type === "lifestyle" ? onClick : handleAddClick}
    >
      <ProductImageWrapper>
        <Image
          url={image}
          className="product-image"
          style={{ position: "relative" }}
          alt={title}
        />
        {discount_in_percent ? (
          <>
            <DiscountPercent>{discount_in_percent}%</DiscountPercent>
          </>
        ) : (
          ""
        )}
      </ProductImageWrapper>
      <ProductInfo>
        <h3 className="product-title">{title}</h3>
        <span className="product-weight">{weight}</span>
        <div className="product-meta">
          <div className="productPriceWrapper">
            {discount_in_percent ? (
              <span className="discountedPrice">
                {currency}
                {price}
              </span>
            ) : (
              ""
            )}

            <span className="product-price">
              {currency}
              {sale_price ? sale_price : price}
            </span>
          </div>

          {!isInCart(data.id) ? (
            has_variations ? (
              <Button
                className="cart-button"
                variant="secondary"
                borderRadius={100}
                onClick={onclick}
              >
                <CartIcon mr={2} />
                <ButtonText>
                  <FormattedMessage
                    id="selectVariationButton"
                    defaultMessage="Select Option"
                  />
                </ButtonText>
              </Button>
            ) : (
              <Button
                className="cart-button"
                variant="secondary"
                borderRadius={100}
                onClick={handleAddClick}
              >
                <CartIcon mr={2} />
                <ButtonText>
                  <FormattedMessage id="addCartButton" defaultMessage="Cart" />
                </ButtonText>
              </Button>
            )
          ) : (
            <Counter
              value={getItem(data.id).quantity}
              onDecrement={handleRemoveClick}
              onIncrement={handleAddClick}
            />
          )}
        </div>
      </ProductInfo>
    </ProductCardWrapper>
  );
};

export default ProductCard;
