import React from "react";
import Router from "next/router";
import { closeModal } from "@redq/reuse-modal";
import { Button } from "components/button/button";
import {
  QuickViewWrapper,
  ProductDetailsWrapper,
  ProductPreview,
  DiscountPercent,
  ProductInfoWrapper,
  ProductInfo,
  ProductTitlePriceWrapper,
  ProductTitle,
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
  ModalClose,
} from "./quick-view.style";
import { CloseIcon } from "assets/icons/CloseIcon";
import { CartIcon } from "assets/icons/CartIcon";
import { CURRENCY } from "utils/constant";

import ReadMore from "components/truncate/truncate";
import CarouselWithCustomDots from "components/multi-carousel/multi-carousel";
import { useLocale } from "contexts/language/language.provider";
import { useCart } from "contexts/cart/use-cart";
import { Counter } from "components/counter/counter";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import { GET_PRODUCT_DETAILS } from "graphql/query/product.query";
import { useQuery } from "@apollo/react-hooks";

type QuickViewProps = {
  slug: string;
  deviceType: any;
  onModalClose: any;
};

const QuickView: React.FunctionComponent<QuickViewProps> = ({
  slug,
  deviceType,
  onModalClose,
}) => {
  const [qSlug, setQSlug] = React.useState(slug);
  const { addItem, removeItem, isInCart, getItem } = useCart();
  const [message, setMessage] = React.useState(null);

  const { data, loading } = useQuery(GET_PRODUCT_DETAILS, {
    variables: {
      slug: qSlug,
    },
  });

  if (loading)
    return (
      <ModalClose onClick={onModalClose}>
        <CloseIcon />
      </ModalClose>
    );

  const {
    id,
    type,
    name,
    unit,
    price,
    thumbnail,
    discount_in_percent,
    sale_price,
    description,
    images,
    parent_images,
    categories,
    has_variations,
    parent_id,
    variation_options,
    variant,
    childrens,
    siblings,
    parent,
  } = data.product;

  var defaultImage = [{ img_path: thumbnail }];

  var options = JSON.parse(variation_options);
  var variation = JSON.parse(variant);

  const changeVariant = (key, value) => {
    const currentVariation = variation;
    let variantFound = false;
    const variations = parent === null ? childrens : siblings;

    if (variation === null) variation = {};
    variation[key] = value;

    for (let i = 0; i < variations.length; i++) {
      let sv = JSON.parse(variations[i].variant);
      if (_.isMatch(sv, variation)) {
        variantFound = true;
        setQSlug(variations[i].slug);
        break;

        // Router.push("/product/[slug]", `/product/${variations[i].slug}`);
      }
    }
    if (!variantFound) {
      setMessage("Variant Not Found");
      variation = currentVariation;
    } else setMessage(null);
  };

  const { isRtl } = useLocale();

  const handleAddClick = (e: any) => {
    if (has_variations && !parent_id) {
      setMessage("Please select variation.");
      return;
    }
    e.stopPropagation();
    addItem(data.product);
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItem(data.product);
  };
  function onCategoryClick(slug) {
    Router.push({
      pathname: `/${type.toLowerCase()}`,
      query: { category: slug },
    }).then(() => window.scrollTo(0, 0));
    closeModal();
  }

  return (
    <>
      <ModalClose onClick={onModalClose}>
        <CloseIcon />
      </ModalClose>
      <QuickViewWrapper>
        <ProductDetailsWrapper className="product-card" dir="ltr">
          {!isRtl && (
            <ProductPreview>
              <CarouselWithCustomDots
                items={
                  images.length
                    ? images
                    : parent_images.length
                    ? parent_images
                    : defaultImage
                }
                deviceType={deviceType}
              />
              {!!discount_in_percent && (
                <>
                  <DiscountPercent>{discount_in_percent}%</DiscountPercent>
                </>
              )}
            </ProductPreview>
          )}
          <ProductInfoWrapper dir={isRtl ? "rtl" : "ltr"}>
            <ProductInfo>
              <ProductTitlePriceWrapper>
                <ProductTitle>{name}</ProductTitle>
                <ProductPriceWrapper>
                  {discount_in_percent ? (
                    <SalePrice>
                      {CURRENCY}
                      {price}
                    </SalePrice>
                  ) : (
                    ""
                  )}

                  <ProductPrice>
                    {CURRENCY}
                    {sale_price ? sale_price : price}
                  </ProductPrice>
                  <ProductWeight>
                    {" "}
                    &nbsp; <small>/</small> {unit}
                  </ProductWeight>
                </ProductPriceWrapper>
              </ProductTitlePriceWrapper>

              {/* <ReadMore character={600}> </ReadMore> */}
              {description ? (
                <ProductDescription>
                  {/* <ReadMore character={600}>{description}</ReadMore> */}

                  <div dangerouslySetInnerHTML={{ __html: description }}></div>
                  <br />
                  {/* Variant: {variant} */}
                </ProductDescription>
              ) : (
                ""
              )}

              {has_variations || parent_id ? (
                <ProductOptions>
                  {Object.keys(options).map((key) => (
                    <div key={key}>
                      <div>
                        {key}:
                        {options[key].map((i) =>
                          (variation && variation[key]) === i ? (
                            <button
                              className="option-button"
                              key={key + i}
                              style={{
                                background: "#ff793f",
                                color: "white",
                              }}
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
                  {!isInCart(id) ? (
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
                      value={getItem(id).quantity}
                      onDecrement={handleRemoveClick}
                      onIncrement={handleAddClick}
                    />
                  )}
                </ProductCartBtn>
              </ProductCartWrapper>

              <ProductMeta>
                <MetaSingle>
                  {categories
                    ? categories.map((item: any) => (
                        <MetaItem
                          onClick={() => onCategoryClick(item.slug)}
                          key={item.id}
                        >
                          {item.title}
                        </MetaItem>
                      ))
                    : ""}
                </MetaSingle>
              </ProductMeta>
            </ProductInfo>
          </ProductInfoWrapper>

          {isRtl && (
            <ProductPreview>
              <CarouselWithCustomDots
                items={
                  images.length
                    ? images
                    : parent_images.length
                    ? parent_images
                    : defaultImage
                }
                deviceType={deviceType}
              />
              {!!discount_in_percent && (
                <>
                  <DiscountPercent>{discount_in_percent}%</DiscountPercent>
                </>
              )}
            </ProductPreview>
          )}
        </ProductDetailsWrapper>
      </QuickViewWrapper>
    </>
  );
};

export default QuickView;
