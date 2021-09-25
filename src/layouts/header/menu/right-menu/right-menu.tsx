import React from "react";
import dynamic from "next/dynamic";
import NavLink from "components/nav-link/nav-link";
import {
  OFFER_PAGE,
  // HELP_PAGE,
  REQUEST_PRODUCT_PAGE,
} from "constants/navigation";
import Phone from "assets/images/phone.png";
import gysl from "assets/images/gysl.jpg";

// import StoreSwitcher from "../store-switcher/store-switcher";
// import { HelpIcon } from "assets/icons/HelpIcon";
// import { SmartPhone } from "assets/icons/SmartPhone";
import { RightMenuBox } from "./right-menu.style";
const AuthMenu = dynamic(() => import("../auth-menu"), { ssr: false });

type Props = {
  onLogout: () => void;
  onJoin: () => void;
  avatar: string;
  isAuthenticated: boolean;
  hotline: string;
};

export const RightMenu: React.FC<Props> = ({
  onLogout,
  avatar,
  isAuthenticated,
  onJoin,
  hotline,
}) => {
  return (
    <RightMenuBox>
      <img src={Phone} alt="" width="23.602px" />
      &nbsp;
      <NavLink className="menu-item" href="/" label={hotline} />
      {/* icon={<SmartPhone />} */}
      <NavLink
        className="menu-item"
        href={OFFER_PAGE + "/all"}
        label="Offer"
        intlId="navlinkOffer"
      />
      <img src={gysl} alt="" width="15.602px" style={{ marginTop: "-7px" }} />
      &nbsp;
      <NavLink
        className="menu-item"
        href={REQUEST_PRODUCT_PAGE}
        label="Product Request"
        intlId="navlinkProductReq"
        iconClass="menu-icon"
      />
      {/* icon={<HelpIcon />} */}
      {/* <StoreSwitcher /> */}
      <AuthMenu
        avatar={avatar}
        onJoin={onJoin}
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
      />
    </RightMenuBox>
  );
};
