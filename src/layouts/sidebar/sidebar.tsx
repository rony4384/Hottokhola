import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@apollo/react-hooks";
import Sticky from "react-stickynode";
import { Scrollbars } from "react-custom-scrollbars";
import Popover from "components/popover/popover";
import { ArrowDropDown } from "assets/icons/ArrowDropDown";
import { CategoryIcon } from "assets/icons/CategoryIcon";
import { useLocale } from "contexts/language/language.provider";
import { useAppState } from "contexts/app/app.provider";
import {
  SidebarMobileLoader,
  SidebarLoader,
} from "components/placeholder/placeholder";
import { FormattedMessage } from "react-intl";
import {
  CategoryWrapper,
  TreeWrapper,
  PopoverHandler,
  PopoverWrapper,
  SidebarWrapper,
  RequestMedicine,
} from "./sidebar.style";

import { TreeMenu } from "components/tree-menu/tree-menu";

import { GET_CATEGORIES } from "graphql/query/category.query";

import { REQUEST_PRODUCT_PAGE } from "constants/navigation";
import sslcz from "assets/images/sslcz.png";

type SidebarCategoryProps = {
  deviceType: {
    mobile: string;
    tablet: string;
    desktop: boolean;
  };
  type: string;
};

const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  deviceType: { mobile, tablet, desktop },
  type,
}) => {
  const router = useRouter();
  const { data, loading } = useQuery(GET_CATEGORIES, {
    variables: { type: type, parent_id: null, status: "ACTIVE" },
  });
  const { pathname, query } = router;
  const selectedQueries = query.category;

  const { isRtl } = useLocale();

  const onCategoryClick = (slug: string) => {
    const { type, ...rest } = query;
    router.push(
      {
        pathname,
        query: { category: slug },
      },
      {
        pathname: `/${type}`,
        query: { category: slug },
      }
    );
  };
  const isSidebarSticky = useAppState("isSidebarSticky");

  if (!data || loading) {
    if (mobile || tablet) {
      return <SidebarMobileLoader />;
    }
    return <SidebarLoader />;
  }
  return (
    <CategoryWrapper>
      <PopoverWrapper
      // className={`${mobile || tablet ? 'mobileView' : ''}`}
      >
        <Popover
          handler={
            <PopoverHandler>
              <div>
                <CategoryIcon />
                Select your Category
              </div>
              <div>
                <ArrowDropDown />
              </div>
            </PopoverHandler>
          }
          className="category-popover"
          content={
            <>
              {type === "medicine" && (
                <Link href={REQUEST_PRODUCT_PAGE}>
                  <RequestMedicine>
                    <FormattedMessage id="reqProduct" />
                  </RequestMedicine>
                </Link>
              )}
              <TreeMenu
                data={data.categories}
                onClick={onCategoryClick}
                active={selectedQueries}
              />
            </>
          }
        />
      </PopoverWrapper>

      <SidebarWrapper
        // className={`${mobile || tablet ? 'mobileView' : ''}`}
        style={{ paddingTop: type === "medicine" ? 0 : 45 }}
      >
        <Sticky enabled={isSidebarSticky} top={type === "medicine" ? 89 : 110}>
          {type === "medicine" && (
            <Link href={REQUEST_PRODUCT_PAGE}>
              <RequestMedicine>
                <FormattedMessage id="reqProduct" />
              </RequestMedicine>
            </Link>
          )}

          <Scrollbars
            universal
            autoHide
            autoHeight
            autoHeightMax={688}
            renderView={(props) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  marginLeft: isRtl ? props.style.marginRight : 0,
                  marginRight: isRtl ? 0 : props.style.marginRight,
                }}
              />
            )}
          >
            <TreeWrapper>
              <TreeMenu
                data={data.categories}
                onClick={onCategoryClick}
                active={selectedQueries}
              />
            </TreeWrapper>
          </Scrollbars>
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
        </Sticky>
      </SidebarWrapper>
    </CategoryWrapper>
  );
};

export default SidebarCategory;
