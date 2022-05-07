import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache, ApolloLink } from "@apollo/client";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import fetch from "cross-fetch";
import { LENS_API } from "../lensApi/config";
import { getAuthenticationToken } from "../lensApi/state";
import { onError } from "@apollo/client/link/error";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient;

const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthenticationToken();

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "x-access-token": token ? `Bearer ${token}` : "",
    },
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const link = ApolloLink.from([
  onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }

    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      );
    }
  }),
  authLink,
  new HttpLink({
    uri: LENS_API,
    fetch,
  }),
]);

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
