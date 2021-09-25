import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Sticky from "react-stickynode";
import { useAppDispatch, useAppState } from "contexts/app/app.provider";
import Header from "./header/header";
import { LayoutWrapper } from "./layout.style";
import { isCategoryPage } from "./is-home-page";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_SETTING = gql`
  query setting {
    setting {
      logo
      grocery_banner
      lifestyle_banner
      inside_dhaka_shipping_charge
      outside_dhaka_shipping_charge
      reward_percentage
      grocery_title
      grocery_subtitle
      lifestyle_title
      lifestyle_subtitle
      hotline
    }
  }
`;

const MobileHeader = dynamic(() => import("./header/mobile-header"), {
  ssr: false,
});

type LayoutProps = {
  className?: string;
  token?: string;
};

const Layout: React.FunctionComponent<LayoutProps> = ({
  className,
  children,
  // deviceType: { mobile, tablet, desktop },
  token,
}) => {
  const dispatch = useAppDispatch();
  const { data } = useQuery(GET_SETTING);
  React.useEffect(() => {
    data && dispatch({ type: "SET_SETTING", payload: data.setting });
  }, [data]);

  const isSticky = useAppState("isSticky");
  const { pathname, query } = useRouter();
  const type = pathname === "/restaurant" ? "restaurant" : query.type;

  const isHomePage = isCategoryPage(type);
  return (
    <LayoutWrapper className={`layoutWrapper ${className}`}>
      <Sticky enabled={isSticky} innerZ={1001}>
        <MobileHeader
          className={`${isSticky ? "sticky" : "unSticky"} ${
            isHomePage ? "home" : ""
          } desktop`}
        />

        <Header
          className={`${isSticky && isHomePage ? "sticky" : "unSticky"} ${
            isHomePage ? "home" : ""
          }`}
        />
      </Sticky>
      {children}
    </LayoutWrapper>
  );
};

export default Layout;
