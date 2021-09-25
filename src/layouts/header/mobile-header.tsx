import React from "react";
import { useRouter } from "next/router";
import { openModal, closeModal } from "@redq/reuse-modal";
import MobileDrawer from "./mobile-drawer";
import {
  MobileHeaderWrapper,
  MobileHeaderInnerWrapper,
  DrawerWrapper,
  LogoWrapper,
  SearchWrapper,
  SearchModalWrapper,
  SearchModalClose,
} from "./header.style";
import Search from "features/search/search";
// import LogoImage from "assets/images/logo.png";

import { SearchIcon } from "assets/icons/SearchIcon";
import { LongArrowLeft } from "assets/icons/LongArrowLeft";
import Logo from "layouts/logo/logo";
import StoreSwitcher from "./menu/store-switcher/store-switcher";
import { isCategoryPage } from "../is-home-page";
import useDimensions from "utils/useComponentSize";
import { useAppState } from "contexts/app/app.provider";

type MobileHeaderProps = {
  className?: string;
  closeSearch?: any;
};

const SearchModal: React.FC<{}> = () => {
  const onSubmit = () => {
    closeModal();
  };
  return (
    <SearchModalWrapper>
      <SearchModalClose type="submit" onClick={() => closeModal()}>
        <LongArrowLeft />
      </SearchModalClose>
      <Search
        className="header-modal-search"
        showButtonText={false}
        minimal={true}
        onSubmit={onSubmit}
      />
    </SearchModalWrapper>
  );
};

const MobileHeader: React.FC<MobileHeaderProps> = ({ className }) => {
  const logo = useAppState("logo");

  const { pathname, query } = useRouter();
  const [showSearch, setShowSearch] = React.useState(false);

  const [mobileHeaderRef, dimensions] = useDimensions();

  const handleSearchModal = () => {
    openModal({
      show: true,
      config: {
        enableResizing: false,
        disableDragging: true,
        className: "search-modal-mobile",
        width: "100%",
        height: "100%",
      },
      closeOnClickOutside: false,
      component: SearchModal,
      closeComponent: () => <div />,
    });
  };
  const type = pathname === "/restaurant" ? "restaurant" : query.type;

  const isHomePage = isCategoryPage(type);

  return (
    <MobileHeaderWrapper>
      <MobileHeaderInnerWrapper className={className} ref={mobileHeaderRef}>
        <DrawerWrapper>
          <MobileDrawer />
        </DrawerWrapper>

        <LogoWrapper>
          <Logo imageUrl={logo} alt="shop logo" />
        </LogoWrapper>

        {/* <StoreSwitcher /> */}

        {isHomePage ? (
          <SearchWrapper className="searchIconWrapper">
            {showSearch ? (
              <SearchModalWrapper
                style={{ position: "absolute", right: "5px", top: "5px" }}
              >
                <SearchModalClose onClick={() => setShowSearch(false)}>
                  <LongArrowLeft />
                </SearchModalClose>
                <Search
                  className="header-modal-search"
                  showButtonText={false}
                  minimal={true}
                  // onSubmit={onSubmit}
                />
              </SearchModalWrapper>
            ) : (
              <SearchIcon onClick={() => setShowSearch(true)} />
            )}
          </SearchWrapper>
        ) : null}
      </MobileHeaderInnerWrapper>
    </MobileHeaderWrapper>
  );
};

export default MobileHeader;
