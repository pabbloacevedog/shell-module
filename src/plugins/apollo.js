import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';

const apolloClient = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL,
    cache: new InMemoryCache(),
});

export { apolloClient, gql };
