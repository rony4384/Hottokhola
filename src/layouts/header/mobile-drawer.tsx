import React, { useContext } from "react";
import { openModal } from "@redq/reuse-modal";
import Router from "next/router";
import { Scrollbars } from "react-custom-scrollbars";
import Drawer from "components/drawer/drawer";
import { Button } from "components/button/button";
import NavLink from "components/nav-link/nav-link";
import { CloseIcon } from "assets/icons/CloseIcon";
import { AuthContext } from "contexts/auth/auth.context";
import AuthenticationForm from "features/authentication-form";
import { FormattedMessage } from "react-intl";
import {
  HamburgerIcon,
  DrawerContentWrapper,
  DrawerClose,
  DrawerProfile,
  LogoutView,
  LoginView,
  UserAvatar,
  UserDetails,
  DrawerMenu,
  DrawerMenuItem,
  UserOptionMenu,
} from "./header.style";
import UserImage from "assets/images/user.jpg";
import sslcz from "assets/images/sslcz.png";

import {
  PROCEED_TO_CHECKOUT_PAGE,
  // ALTERNATIVE_CHECKOUT_PAGE,
  PROFILE_PAGE,
  YOUR_ORDER,
  COUPONS,
  ORDER_RECEIVED,
  HELP_PAGE,
  OFFER_PAGE,
  TERMS,
  PRIVACY,
  ABOUT,
  REQUEST_PRODUCT_PAGE,
} from "constants/navigation";
import { useAppState, useAppDispatch } from "contexts/app/app.provider";

const DrawerMenuItems = [
  {
    id: 1,
    intlLabelId: "navLinkHome",
    label: "Home",
    href: "/",
  },
  // {
  //   id: 2,
  //   intlLabelId: "navlinkCheckout",
  //   label: "Checkout",
  //   href: PROCEED_TO_CHECKOUT_PAGE,
  // },
  // {
  //   id: 3,
  //   label: "Checkout Second",
  //   intlLabelId: "alternativeCheckout",
  //   href: ALTERNATIVE_CHECKOUT_PAGE,
  // },
  // {
  //   id: 4,
  //   intlLabelId: "navlinkProfile",
  //   label: "Profile",
  //   href: PROFILE_PAGE,
  // },
  // {
  //   id: 5,
  //   intlLabelId: "sidebarYourOrder",
  //   label: "Order",
  //   href: YOUR_ORDER,
  // },
  // {
  //   id: 6,
  //   intlLabelId: "navlinkOrderReceived",
  //   label: "Received",
  //   href: ORDER_RECEIVED,
  // },
  {
    id: 7,
    intlLabelId: "navlinkProductReq",
    label: "Product Request",
    href: REQUEST_PRODUCT_PAGE,
  },
  {
    id: 8,
    intlLabelId: "navlinkOffer",
    label: "Offer",
    href: OFFER_PAGE + "/all",
  },
  {
    id: 9,
    label: "Coupons",
    href: COUPONS,
    intlLabelId: "sidebarYourCoupon",
  },
  {
    id: 10,
    href: TERMS,
    label: "Terms and Services",
    intlLabelId: "navlinkTermsAndServices",
  },
  {
    id: 11,
    href: PRIVACY,
    label: "Privacy Policy",
    intlLabelId: "navlinkPrivacyPolicy",
  },
  {
    id: 12,
    href: ABOUT,
    label: "About Us",
    intlLabelId: "navlinkAbout",
  },
];

const MobileDrawer: React.FunctionComponent = () => {
  const isDrawerOpen = useAppState("isDrawerOpen");
  const dispatch = useAppDispatch();
  const {
    authState: { isAuthenticated, name, mobile_number },
    authDispatch,
  } = useContext<any>(AuthContext);
  // Toggle drawer
  const toggleHandler = React.useCallback(() => {
    dispatch({
      type: "TOGGLE_DRAWER",
    });
  }, [dispatch]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("api_token");
      authDispatch({ type: "SIGN_OUT" });
      Router.push("/");
    }
  };

  const signInOutForm = () => {
    dispatch({
      type: "TOGGLE_DRAWER",
    });

    authDispatch({
      type: "SIGNIN",
    });

    openModal({
      show: true,
      overlayClassName: "quick-view-overlay",
      closeOnClickOutside: true,
      component: AuthenticationForm,
      closeComponent: "",
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "quick-view-modal",
        width: 458,
        height: "auto",
      },
    });
  };

  return (
    <Drawer
      width="316px"
      drawerHandler={
        <HamburgerIcon>
          <span />
          <span />
          <span />
        </HamburgerIcon>
      }
      open={isDrawerOpen}
      toggleHandler={toggleHandler}
      closeButton={
        <DrawerClose>
          <CloseIcon />
        </DrawerClose>
      }
    >
      <Scrollbars autoHide>
        <DrawerContentWrapper>
          <DrawerProfile>
            {isAuthenticated ? (
              <LoginView>
                {/* <UserAvatar>
                  <img src={UserImage} alt="user_avatar" />
                </UserAvatar> */}
                <UserDetails>
                  <h3>
                    {name == "null" || name == null ? "Dear Guest" : name}
                  </h3>
                  <span>{mobile_number}</span>
                </UserDetails>
              </LoginView>
            ) : (
              <LogoutView>
                <Button variant="primary" onClick={signInOutForm}>
                  <FormattedMessage
                    id="mobileSignInButtonText"
                    defaultMessage="join"
                  />
                </Button>
              </LogoutView>
            )}
          </DrawerProfile>
          <DrawerMenu>
            {DrawerMenuItems.map((item) => (
              <DrawerMenuItem key={item.id}>
                <NavLink
                  onClick={toggleHandler}
                  href={item.href}
                  label={item.label}
                  intlId={item.intlLabelId}
                  className="drawer_menu_item"
                />
              </DrawerMenuItem>
            ))}
          </DrawerMenu>
          {isAuthenticated && (
            <UserOptionMenu>
              <DrawerMenuItem>
                <NavLink
                  href="/profile"
                  label="Your Account Settings"
                  className="drawer_menu_item"
                  intlId="navlinkAccountSettings"
                />
                <NavLink
                  href="/order"
                  label="Your Orders"
                  className="drawer_menu_item"
                  intlId="navlinkAccountSettings"
                />
              </DrawerMenuItem>
              <DrawerMenuItem>
                <div onClick={handleLogout} className="drawer_menu_item">
                  <span className="logoutBtn">
                    <FormattedMessage
                      id="navlinkLogout"
                      defaultMessage="Logout"
                    />
                  </span>
                </div>
              </DrawerMenuItem>
            </UserOptionMenu>
          )}
          <br />
          {/* <img src={sslcz} width="95%" /> */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "#77798C",
              }}
            >
              <strong> support@hottokhola.com </strong> <br />© Copyright Buy &
              Bazar
            </p>
          </div>
        </DrawerContentWrapper>
      </Scrollbars>
    </Drawer>
  );
};

export default MobileDrawer;
