import { useMemo } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { HttpLink } from "apollo-link-http";
import { setContext } from "@apollo/client/link/context";

import { createUploadLink } from "apollo-upload-client";

let apolloClient;

let headers = {
  Accept: "application/json",
};

// if (typeof window !== "undefined" && localStorage.getItem("api_token")) {
//   headers["Authorization"] = `Bearer ` + localStorage.getItem("api_token");
// }

function createApolloClient() {
  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT,
    credentials: "same-origin",
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // console.log(
    //   typeof window !== "undefined" && localStorage.getItem("api_token"),
    //   "aat"
    // );

    const api_token =
      typeof window !== "undefined" && localStorage.getItem("api_token");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: api_token ? `Bearer ${api_token}` : "",
      },
    };
  });

  // const link = createUploadLink({
  //   uri: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT, // Server URL (must be absolute)
  //   headers: {
  //     ...headers,
  //   },
  // });
  // const cache = new InMemoryCache();

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  // return new ApolloClient({ cache, link });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
