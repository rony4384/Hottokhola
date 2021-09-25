// product card for furniture
import React from "react";
import Image from "components/image/image";
import {
  ProductName,
  DiscountPercent,
  ProductCardWrapper,
  ProductImageWrapper,
  ProductInfo,
} from "../product-card.style";

type ProductCardProps = {
  title: string;
  image: any;
  discount_amount?: number;
  onClick?: (e: any) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  discount_amount,
  onClick,
}) => {
  return (
    <ProductCardWrapper onClick={onClick} className="furniture-card">
      <ProductImageWrapper>
        <Image
          url={image}
          className="product-image"
          style={{ position: "relative" }}
          alt={title}
        />
        {discount_amount ? (
          <>
            <DiscountPercent>{discount_amount}%</DiscountPercent>
          </>
        ) : (
          ""
        )}
      </ProductImageWrapper>
      <ProductInfo>
        <ProductName>{title}</ProductName>
      </ProductInfo>
    </ProductCardWrapper>
  );
};

export default ProductCard;
