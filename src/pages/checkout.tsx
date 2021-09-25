import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import { Modal, openModal } from "@redq/reuse-modal";
import { SEO } from "components/seo";
import Checkout from "features/checkouts/checkout-two/checkout-two";
import { GET_CUSTOMER_WITH_SCHEDULE } from "graphql/query/auth.query";
import { useRouter } from "next/router";
import { ProfileProvider } from "contexts/profile/profile.provider";
import ErrorMessage from "components/error-message/error-message";
import { AuthContext } from "contexts/auth/auth.context";
import AuthenticationForm from "features/authentication-form";
import { CostCalculation } from "features/user-profile/order/order-card/order-card.style";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const CheckoutPage: NextPage<Props> = ({ deviceType }) => {
  const { query } = useRouter();

  const {
    authState: { isAuthenticated, api_token },
    authDispatch,
  } = React.useContext<any>(AuthContext);

  const { data, error, loading } = useQuery(GET_CUSTOMER_WITH_SCHEDULE, {
    variables: { api_token: api_token },
  });

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) return <ErrorMessage message={error.message} />;
  const token = "true";
  const card = [
    {
      id: 1,
      type: "Online",
      cardType: "Mobile Wallet",
      name: "SSLCOMMERZ",
      lastFourDigit: "1234",
    },
    {
      id: 2,
      type: "Online",
      cardType: "Online",
      name: "SSLCOMMERZ",
      lastFourDigit: "1234",
    },
    {
      id: 3,
      type: "Online",
      cardType: "Online",
      name: "SSLCOMMERZ",
      lastFourDigit: "1234",
    },
  ];

  if (!data.customer) {
    return (
      <div style={{ background: "#fff" }}>
        <SEO
          title="Checkout Alternative - hottokhola"
          description="Checkout Details"
        />
        <div
          style={{
            marginTop: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AuthenticationForm
            redirect="/checkout"
            noModal={true}
            maxWidth="500px"
          />
        </div>
      </div>
    );
  }

  data.customer.card = card;

  return (
    <>
      <SEO
        title="Checkout Alternative - hottokhola"
        description="Checkout Details"
      />
      <ProfileProvider initData={data.customer} schedules={data.schedules}>
        <Modal>
          <Checkout
            token={token}
            deviceType={deviceType}
            message={query ? query.message : " "}
          />
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default CheckoutPage;
