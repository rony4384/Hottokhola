import React from "react";
import { NextPage, GetStaticProps } from "next";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { SEO } from "components/seo";
import CartPopUp from "features/carts/cart-popup";
import { Modal } from "@redq/reuse-modal";
import { useRouter } from "next/router";
import { Button } from "components/button/button";
import NavLink from "components/nav-link/nav-link";
import { OFFER_PAGE } from "constants/navigation";
import { RightMenuBox } from "layouts/header/menu/right-menu/right-menu.style";

import {
  OfferPageWrapper,
  ProductsRow,
  MainContentArea,
  ProductsCol,
} from "assets/styles/pages.style";
import GiftCard from "components/gift-card/gift-card";
import Footer from "layouts/footer";
import { initializeApollo } from "utils/apollo";
import dynamic from "next/dynamic";
const ErrorMessage = dynamic(
  () => import("components/error-message/error-message")
);
const Products = dynamic(
  () => import("components/product-grid/product-list/product-list")
);

type GiftCardProps = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const GiftCardPage: NextPage<GiftCardProps> = ({ deviceType }) => {
  const { query } = useRouter();
  const PAGE_TYPE: any = query.catType === "all" ? undefined : query.catType;
  return (
    <Modal>
      <SEO title="Offer - hottokhola" description="Offer Details" />
      <OfferPageWrapper>
        <MainContentArea>
          <div style={{ width: "100%" }}>
            <RightMenuBox>
              <NavLink
                className="menu-item cart-button"
                href={OFFER_PAGE + "/all"}
                label="All"
              />

              <NavLink
                className="menu-item cart-button"
                href={OFFER_PAGE + "/grocery"}
                label="Grocery"
              />

              <NavLink
                className="menu-item cart-button"
                href={OFFER_PAGE + "/lifestyle"}
                label="Life Style"
              />
            </RightMenuBox>
            <br />
            <Products
              type={PAGE_TYPE}
              offer={true}
              deviceType={deviceType}
              fetchLimit={20}
            />

            {/* <ProductsRow>
              {data && data.coupons
                ? data.coupons.map((coupon) => (
                    <ProductsCol key={coupon.id}>
                      <GiftCard image={coupon.img_path} code={coupon.code} />
                    </ProductsCol>
                  ))
                : null}
            </ProductsRow> */}
          </div>
        </MainContentArea>

        <Footer />
      </OfferPageWrapper>
      <CartPopUp deviceType={deviceType} />
    </Modal>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: GET_COUPON,
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// };
export default GiftCardPage;
