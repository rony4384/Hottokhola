import React, { useEffect } from "react";
import { NextPage } from "next";
import { SEO } from "components/seo";
import Order from "features/user-profile/order/order";
import { useRouter } from "next/router";
import {
  PageWrapper,
  SidebarSection,
} from "features/user-profile/user-profile.style";
import Sidebar from "features/user-profile/sidebar/sidebar";
import { Modal, openModal } from "@redq/reuse-modal";

type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};

const PopUp = (props) => (
  <div style={{ textAlign: "center", paddingTop: "50px" }}>
    <h1 style={{ color: "#ff793f" }}>
      Congratulations <i>!</i>{" "}
    </h1>
    <p>Your order has been placed.</p>
  </div>
);
const OrderPage: NextPage<Props> = ({ deviceType }) => {
  const { query } = useRouter();

  useEffect(() => {
    if (query && query.message === "success") {
      console.log(query);
      openModal({
        config: {
          className: "successModal",
          disableDragging: false,
          width: 480,
          height: 180,
          animationFrom: { transform: "scale(0.3)" }, // react-spring <Spring from={}> props value
          animationTo: { transform: "scale(1)" }, //  react-spring <Spring to={}> props value
          transition: {
            mass: 1,
            tension: 130,
            friction: 26,
          }, // react-spring config props
        },
        withRnd: false,
        overlayClassName: "customeOverlayClass",
        closeOnClickOutside: false,
        component: PopUp,
      });
    }
  });

  return (
    <>
      <SEO title="Order - hottokhola" description="Order Details" />
      <Modal>
        <PageWrapper>
          {deviceType.desktop && (
            <SidebarSection>
              <Sidebar />
            </SidebarSection>
          )}

          <Order deviceType={deviceType} />
        </PageWrapper>
      </Modal>
    </>
  );
};

export default OrderPage;
