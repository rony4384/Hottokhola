import React from "react";
import { SearchBox } from "components/search-box/search-box";
import { useAppState, useAppDispatch } from "contexts/app/app.provider";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { GET_PRODUCTS } from "graphql/query/products.query";
import { useLazyQuery } from "@apollo/react-hooks";

interface Props {
  minimal?: boolean;
  showButtonText?: boolean;
  onSubmit?: () => void;
  [key: string]: unknown;
}

const Search: React.FC<Props> = ({ onSubmit, ...props }) => {
  const searchTerm = useAppState("searchTerm");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const intl = useIntl();
  const [items, setItems] = React.useState(null);
  const { pathname, query } = router;

  const [getProducts, { loading, data }] = useLazyQuery(GET_PRODUCTS, {
    onCompleted: (data) => {
      if (data && data.products) setItems(data.products.data);
    },
  });

  const handleOnChange = (e) => {
    const { value } = e.target;
    if (value === "") {
      setItems(null);
    } else {
      getProducts({
        variables: {
          type: query.type,
          text: value,
        },
      });
      if (items === null && data && data.products) setItems(data.products.data);
    }
    dispatch({ type: "SET_SEARCH_TERM", payload: value });
  };

  const onSelect = (item) => {
    const { type, ...rest } = query;
    dispatch({ type: "SET_SEARCH_TERM", payload: item });
    router.push(
      {
        pathname,
        query: { text: item },
      },
      {
        pathname: `/${type}`,
        query: { text: item },
      }
    );
    setItems(null);
    if (onSubmit) {
      onSubmit();
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    const { type, ...rest } = query;
    router.push(
      {
        pathname,
        query: { text: searchTerm },
      },
      {
        pathname: `/${type}`,
        query: { text: searchTerm },
      }
    );
    dispatch({ type: "SET_SEARCH_TERM", payload: searchTerm });
    setItems(null);
    if (onSubmit) {
      onSubmit();
    }
  };
  return (
    <SearchBox
      onEnter={onSearch}
      onChange={handleOnChange}
      value={searchTerm}
      name="search"
      placeholder={intl.formatMessage({
        id: "searchPlaceholder",
        defaultMessage: "Search your products from here",
      })}
      categoryType={query.type}
      buttonText={intl.formatMessage({
        id: "searchButtonText",
        defaultMessage: "Search",
      })}
      {...props}
      onSelect={onSelect}
      items={items}
    />
  );
};

export default Search;
