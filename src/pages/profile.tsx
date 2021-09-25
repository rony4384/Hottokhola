import React from "react";
import { NextPage } from "next";
import { useQuery } from "@apollo/react-hooks";
import { Modal } from "@redq/reuse-modal";
import { GET_CUSTOMER } from "graphql/query/auth.query";
import { ProfileProvider } from "contexts/profile/profile.provider";
import SettingsContent from "features/user-profile/settings/settings";
import {
  PageWrapper,
  SidebarSection,
  ContentBox,
} from "features/user-profile/user-profile.style";
import Sidebar from "features/user-profile/sidebar/sidebar";
import { SEO } from "components/seo";
import Footer from "layouts/footer";
import ErrorMessage from "components/error-message/error-message";
import { AuthContext } from "contexts/auth/auth.context";

type Props = {
  deviceType?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
};
const ProfilePage: NextPage<Props> = ({ deviceType }) => {
  const {
    authState: { api_token },
  } = React.useContext<any>(AuthContext);

  const { data, error, loading } = useQuery(GET_CUSTOMER, {
    variables: { api_token: api_token },
  });
  if (!data || loading) {
    return <div>loading...</div>;
  }
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <SEO title="Profile - hottokhola" description="Profile Details" />
      <ProfileProvider initData={data.customer}>
        <Modal>
          <PageWrapper>
            <SidebarSection>
              <Sidebar />
            </SidebarSection>
            <ContentBox>
              <SettingsContent deviceType={deviceType} />
            </ContentBox>

            <Footer />
          </PageWrapper>
        </Modal>
      </ProfileProvider>
    </>
  );
};

export default ProfilePage;
