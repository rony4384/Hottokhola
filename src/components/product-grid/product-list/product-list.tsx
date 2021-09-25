import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { openModal, closeModal } from "@redq/reuse-modal";
import {
  ProductsRow,
  ProductsCol,
  ButtonWrapper,
  LoaderWrapper,
  LoaderItem,
  ProductCardWrapper,
} from "./product-list.style";
import { CURRENCY } from "utils/constant";
import { useQuery } from "@apollo/react-hooks";
import { NetworkStatus } from "apollo-client";
import Placeholder from "components/placeholder/placeholder";
import Fade from "react-reveal/Fade";
import NoResultFound from "components/no-result/no-result";
import { FormattedMessage } from "react-intl";
import { Button } from "components/button/button";
import { GET_PRODUCTS } from "graphql/query/products.query";

// import "intersection-observer"; // optional polyfill
import Observer from "@researchgate/react-intersection-observer";

const ErrorMessage = dynamic(
  () => import("components/error-message/error-message")
);

const QuickView = dynamic(() => import("features/quick-view/quick-view"));

const GeneralCard = dynamic(
  import("components/product-card/product-card-one/product-card-one")
);

// const BookCard = dynamic(
//   import("components/product-card/product-card-two/product-card-two")
// );
// const FurnitureCard = dynamic(
//   import("components/product-card/product-card-three/product-card-three")
// );
// const MedicineCard = dynamic(
//   import("components/product-card/product-card-five/product-card-five")
// );

type ProductsProps = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
  fetchLimit?: number;
  loadMore?: boolean;
  type?: string;
  slug?: string;
  page?: number;
  offer?: boolean;
};
export const Products: React.FC<ProductsProps> = ({
  deviceType,
  fetchLimit = 10,
  loadMore = true,
  type,
  page = 2,
  offer = undefined,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);
  const { data, error, loading, fetchMore, networkStatus } = useQuery(
    GET_PRODUCTS,
    {
      variables: {
        type: type,
        text: router.query.text,
        category: router.query.category,
        offset: 0,
        limit: fetchLimit,
        page: 1,
        offer: offer,
        status: "ACTIVE",
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  // const loader = useRef(null);
  // useEffect(() => {
  //   var options = {
  //     root: null,
  //     rootMargin: "130px",
  //     threshold: 1.0,
  //   };
  //   // initialize IntersectionObserver
  //   // and attaching to Load More div
  //   const observer = new IntersectionObserver(handleObserver, options);
  //   if (loader.current) {
  //     observer.observe(loader.current);
  //   }
  // }, []);

  // const handleObserver = (entities) => {
  //   const target = entities[0];
  //   if (target.isIntersecting && !loadingMore) {
  //     handleLoadMore(currentPage);
  //   }
  // };

  const handleIntersection = (event) => {
    handleLoadMore(currentPage);
  };

  const options = {
    onChange: handleIntersection,
    root: null,
    rootMargin: "20px",
  };

  // === === === === === === === === === === === ===

  // Quick View Modal
  const handleModalClose = () => {
    const { pathname, query, asPath } = router;
    const as = asPath;
    router.push(
      {
        pathname,
        query,
      },
      as,
      {
        shallow: true,
      }
    );
    closeModal();
  };

  const handleQuickViewModal = (
    slug: string,
    deviceType: any,
    onModalClose: any
  ) => {
    const { pathname, query } = router;
    const as = `/product/${slug}`;
    if (pathname === "/product/[slug]") {
      router.push(pathname, as);
      return;
    }
    openModal({
      show: true,
      overlayClassName: "quick-view-overlay",
      closeOnClickOutside: false,
      component: QuickView,
      componentProps: {
        slug,
        deviceType,
        onModalClose,
      },
      closeComponent: "div",
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "quick-view-modal",
        width: 900,
        y: 30,
        height: "auto",
        transition: {
          mass: 1,
          tension: 0,
          friction: 0,
        },
      },
    });
    router.push(
      {
        pathname,
        query,
      },
      {
        pathname: as,
      },
      {
        shallow: true,
      }
    );
  };
  if (error) return <ErrorMessage message={error.message} />;
  if (loading && !loadingMore) {
    return (
      <LoaderWrapper>
        <LoaderItem>
          <Placeholder uniqueKey="1" />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey="2" />
        </LoaderItem>
        <LoaderItem>
          <Placeholder uniqueKey="3" />
        </LoaderItem>
      </LoaderWrapper>
    );
  }

  if (!data || !data.products || data.products.data.length === 0) {
    return <NoResultFound />;
  }
  var c = 1;
  const handleLoadMore = (cp) => {
    fetchMore({
      variables: {
        page: currentPage,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        setCurrentPage(fetchMoreResult.products.paginatorInfo.currentPage + 1);
        // console.log(currentPage, "currentPage");
        // console.log(previousResult, "pr");
        // console.log(fetchMoreResult, "fmr");
        return {
          products: {
            __typename: previousResult.products.__typename,
            data: [
              ...previousResult.products.data,
              ...fetchMoreResult.products.data,
            ],
            paginatorInfo: fetchMoreResult.products.paginatorInfo,
          },
        };
      },
    });
  };

  const renderCard = (productType, props) => {
    return (
      <GeneralCard
        title={props.name}
        description={props.description}
        image={props.thumbnail}
        weight={props.unit}
        currency={CURRENCY}
        price={props.price}
        sale_price={props.sale_price}
        discount_in_percent={props.discount_in_percent}
        data={props}
        deviceType={deviceType}
        type={props.type}
        slug={props.slug}
        has_variations={props.has_variations}
        onClick={
          () => handleQuickViewModal(props.slug, deviceType, handleModalClose)
          // router.push("/product/[slug]", `/product/${props.slug}`)
        }
      />
    );
  };

  return (
    <>
      <ProductsRow>
        {data.products.data.map((item: any, index: number) => (
          <ProductsCol
            key={index}
            style={type === "book" ? { paddingLeft: 0, paddingRight: 1 } : {}}
          >
            {/* {console.log(data.products.data.length)} */}
            <ProductCardWrapper>
              <Fade
                duration={400}
                delay={index * 10}
                style={{ height: "100%" }}
              >
                {renderCard(type, item)}
              </Fade>
            </ProductCardWrapper>
          </ProductsCol>
        ))}
      </ProductsRow>
      {loadMore && data.products.paginatorInfo.hasMorePages && (
        <Observer {...options}>
          <ButtonWrapper>
            <Button
              onClick={() => handleLoadMore(currentPage)}
              loading={loadingMore}
              variant="primary"
              style={{
                fontSize: 14,
              }}
              border="1px solid #f1f1f1"
            >
              <FormattedMessage
                id="loadMoreButton"
                defaultMessage="Load More"
              />
            </Button>
          </ButtonWrapper>
        </Observer>
      )}
    </>
  );
};
export default Products;
