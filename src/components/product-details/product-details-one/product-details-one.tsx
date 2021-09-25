import React, { useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { Button } from "components/button/button";
import {
  Option,
  ProductDetailsWrapper,
  ProductPreview,
  ProductInfo,
  ProductTitlePriceWrapper,
  ProductTitle,
  BackButton,
  ProductWeight,
  ProductDescription,
  ButtonText,
  ProductMeta,
  ProductCartWrapper,
  ProductPriceWrapper,
  ProductPrice,
  ProductOptions,
  SalePrice,
  ProductCartBtn,
  MetaSingle,
  MetaItem,
  RelatedItems,
} from "./product-details-one.style";
import { LongArrowLeft } from "assets/icons/LongArrowLeft";
import { CartIcon } from "assets/icons/CartIcon";
import ReadMore from "components/truncate/truncate";
import CarouselWithCustomDots from "components/multi-carousel/multi-carousel";
import Products from "components/product-grid/product-list/product-list";
import { CURRENCY } from "utils/constant";
import { FormattedMessage } from "react-intl";
import { useLocale } from "contexts/language/language.provider";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import _ from "lodash";

type ProductDetailsProps = {
  product: any;
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const ProductDetails: React.FunctionComponent<ProductDetailsProps> = ({
  product,
  deviceType,
}) => {
  const { isRtl } = useLocale();
  const { addItem, removeItem, isInCart, getItem } = useCart();
  const data = product;
  const options = JSON.parse(product.variation_options);
  var variant = JSON.parse(product.variant);
  const [message, setMessage] = React.useState(null);

  const handleAddClick = (e) => {
    e.stopPropagation();
    addItem(data);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeItem(data);
  };

  const changeVariant = (key, value) => {
    const currentVariation = variant;
    let variantFound = false;
    const variations =
      product.parent === null ? product.childrens : product.siblings;

    if (variant === null) variant = {};
    variant[key] = value;


    for (let i = 0; i < variations.length; i++) {
      let sv = JSON.parse(variations[i].variant);
      if (_.isMatch(sv, variant)) {
        variantFound = true;
        Router.push("/product/[slug]", `/product/${variations[i].slug}`);
      }
    }
    if (!variantFound) {
      setMessage("Variant Not Found");
      variant = currentVariation;
    } else setMessage(null);
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
  }, []);

  return (
    <>
      <ProductDetailsWrapper className="product-card" dir="ltr">
        {!isRtl && (
          <ProductPreview>
            <BackButton>
              <Button
                type="button"
                size="small"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #f1f1f1",
                  color: "#77798c",
                }}
                onClick={Router.back}
              >
                <LongArrowLeft style={{ marginRight: 5 }} />
                <FormattedMessage id="backBtn" defaultMessage="Back" />
              </Button>
            </BackButton>

            <CarouselWithCustomDots
              items={
                product.images.length ? product.images : product.parent_images
              }
              deviceType={deviceType}
            />
          </ProductPreview>
        )}

        <ProductInfo dir={isRtl ? "rtl" : "ltr"}>
          <ProductTitlePriceWrapper>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPriceWrapper>
              {product.discount_in_percent ? (
                <SalePrice>
                  {CURRENCY}
                  {product.price}
                </SalePrice>
              ) : null}

              <ProductPrice>
                {CURRENCY}
                {product.sale_price ? product.sale_price : product.price}
              </ProductPrice>
              <ProductWeight>
                {" "}
                &nbsp; <small>/</small> {product.unit}
              </ProductWeight>
            </ProductPriceWrapper>
          </ProductTitlePriceWrapper>

          {/* <ProductWeight>/ {product.unit}</ProductWeight> */}
          {product.has_variations || product.parent_id ? (
            <ProductOptions>
              {Object.keys(options).map((key) => (
                <div key={key}>
                  <div>
                    {key}:
                    {options[key].map((i) =>
                      (variant && variant[key]) === i ? (
                        <button
                          className="option-button"
                          key={key + i}
                          style={{ background: "#ff793f", color: "white" }}
                        >
                          {i}
                        </button>
                      ) : (
                        <button
                          key={key + i}
                          className="option-button"
                          onClick={() => changeVariant(key, i)}
                        >
                          {i}
                        </button>
                      )
                    )}
                  </div>
                  <br />
                </div>
              ))}
              {message ? <small>{message}</small> : ""}
            </ProductOptions>
          ) : (
            ""
          )}

          <ProductCartWrapper>
            <ProductCartBtn>
              {!isInCart(data.id) ? (
                <Button
                  className="cart-button"
                  variant="secondary"
                  borderRadius={100}
                  onClick={handleAddClick}
                >
                  <CartIcon mr={2} />
                  <ButtonText>
                    <FormattedMessage
                      id="addCartButton"
                      defaultMessage="Cart"
                    />
                  </ButtonText>
                </Button>
              ) : (
                <Counter
                  value={getItem(data.id).quantity}
                  onDecrement={handleRemoveClick}
                  onIncrement={handleAddClick}
                />
              )}
            </ProductCartBtn>
          </ProductCartWrapper>

          <ProductMeta>
            <MetaSingle>
              {product?.categories?.map((item: any) => (
                <Link
                  href={`/${product.type.toLowerCase()}?category=${item.slug}`}
                  key={`link-${item.id}`}
                >
                  {
                    <a>
                      <MetaItem>{item.title}</MetaItem>
                    </a>
                  }
                </Link>
              ))}
            </MetaSingle>
          </ProductMeta>
        </ProductInfo>

        {isRtl && (
          <ProductPreview>
            <BackButton>
              <Button
                title="Back"
                intlButtonId="backBtn"
                iconPosition="left"
                size="small"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #f1f1f1",
                  color: "#77798c",
                }}
                icon={<LongArrowLeft />}
                onClick={Router.back}
              />
            </BackButton>
            <CarouselWithCustomDots
              items={
                product.images.length ? product.images : product.parent_images
              }
              deviceType={deviceType}
            />
          </ProductPreview>
        )}

        {product.description ? (
          <ProductDescription>
            {/* <ReadMore character={600}>{product.description}</ReadMore> */}

            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
            <br />
            {/* Variant: {variant} */}
          </ProductDescription>
        ) : (
          ""
        )}
      </ProductDetailsWrapper>

      {/* <RelatedItems>
        <h2>
          <FormattedMessage
            id="intlReletedItems"
            defaultMessage="Related Items"
          />
        </h2>
        <Products
          type={product.type.toLowerCase()}
          deviceType={deviceType}
          loadMore={false}
          fetchLimit={10}
        />
      </RelatedItems> */}
    </>
  );
};

export default ProductDetails;
