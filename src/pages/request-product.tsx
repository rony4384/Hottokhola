import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import { Modal } from "@redq/reuse-modal";
import { SEO } from "components/seo";
import RequestProduct from "features/request-product/request-product";
// import { GET_LOGGED_IN_CUSTOMER } from "graphql/query/customer.query";

import { ProfileProvider } from "contexts/profile/profile.provider";
import ErrorMessage from "components/error-message/error-message";

type Props = {
  deviceType: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const RequestProductPage: NextPage<Props> = ({ deviceType }) => {
  // const { data, error, loading } = useQuery(GET_LOGGED_IN_CUSTOMER);
  // if (loading) {
  //   return <div>loading...</div>;
  // }
  // if (error) return <ErrorMessage message={error.message} />;
  const token = true;

  return (
    <>
      <SEO
        title="Request Product - hottokhola"
        description="Request Product Details"
      />
      {/* <ProfileProvider initData={data.me}> */}
      <Modal>
        <RequestProduct token={token} deviceType={deviceType} />
      </Modal>
      {/* </ProfileProvider> */}
    </>
  );
};

export default RequestProductPage;
