import React from "react";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Modal } from "@redq/reuse-modal";
import StoreNav from "components/store-nav/store-nav";
import Carousel from "components/carousel/carousel";
import { Banner } from "components/banner/banner";
import {
  MainContentArea,
  SidebarSection,
  ContentSection,
  OfferSection,
  MobileCarouselDropdown,
} from "assets/styles/pages.style";
// Static Data Import Here
// import OFFERS from "data/offers";
import { PAGES_DATA } from "data/pages";
import storeType from "constants/storeType";
import { SEO } from "components/seo";
import { useRefScroll } from "utils/use-ref-scroll";
import { initializeApollo } from "utils/apollo";
import { GET_PRODUCTS } from "graphql/query/products.query";
import { GET_CATEGORIES } from "graphql/query/category.query";
import { useAppState } from "contexts/app/app.provider";

const Sidebar = dynamic(() => import("layouts/sidebar/sidebar"));
const Products = dynamic(
  () => import("components/product-grid/product-list/product-list")
);
const CartPopUp = dynamic(() => import("features/carts/cart-popup"), {
  ssr: false,
});

const CategoryPage: React.FC<any> = ({ deviceType }) => {
  const { query } = useRouter();
  const grocery_banner = useAppState("grocery_banner");
  const grocery_title = useAppState("grocery_title");
  const grocery_subtitle = useAppState("grocery_subtitle");
  const lifestyle_banner = useAppState("lifestyle_banner");
  const lifestyle_title = useAppState("lifestyle_title");
  const lifestyle_subtitle = useAppState("lifestyle_subtitle");
  const { elRef: targetRef, scroll } = useRefScroll({
    percentOfElement: 0,
    percentOfContainer: 0,
    offsetPX: -110,
  });
  React.useEffect(() => {
    if (query.text || query.category) {
      scroll();
    }
  }, [query.text, query.category]);
  const PAGE_TYPE: any = query.type;
  const page = PAGES_DATA[PAGE_TYPE];
  return (
    <>
      <SEO title={page?.page_title} description={page?.page_description} />

      <Modal>
        <Banner
          title={PAGE_TYPE == "grocery" ? grocery_title : lifestyle_title}
          subtitle={
            PAGE_TYPE == "grocery" ? grocery_subtitle : lifestyle_subtitle
          }
          imageUrl={PAGE_TYPE == "grocery" ? grocery_banner : lifestyle_banner}
        />
        <MobileCarouselDropdown>
          <StoreNav items={storeType} />
          <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
        </MobileCarouselDropdown>
        <OfferSection>
          <div style={{ margin: "0 -10px" }}>
            <Carousel deviceType={deviceType} />
          </div>
        </OfferSection>
        <MainContentArea>
          <SidebarSection>
            <Sidebar type={PAGE_TYPE} deviceType={deviceType} />
          </SidebarSection>
          <ContentSection>
            <div ref={targetRef}>
              <Products
                type={PAGE_TYPE}
                deviceType={deviceType}
                fetchLimit={20}
              />
            </div>
          </ContentSection>
        </MainContentArea>
        <CartPopUp deviceType={deviceType} />
      </Modal>
    </>
  );
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GET_PRODUCTS,
    variables: {
      type: params.type,
      page: 1,
    },
  });
  await apolloClient.query({
    query: GET_CATEGORIES,
    variables: {
      type: params.type,
    },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { type: "grocery" } },
      // { params: { type: "makeups" } },
      // { params: { type: "bags" } },
      // { params: { type: "book" } },
      // { params: { type: "medicine" } },
      // { params: { type: "furniture" } },
      // { params: { type: "clothing" } },
      { params: { type: "lifestyle" } },
    ],
    fallback: false,
  };
}
export default CategoryPage;
