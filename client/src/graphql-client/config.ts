import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  DocumentNode,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { setLoadingRedux } from "../features/auth/authSlice";

const URL = import.meta.env.VITE_BACKEND_URL as string;

export const graphqlClient = (accessToken: string | null = "") => {
  const httpLink = createHttpLink({
    uri: URL,
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};

export const mutationClient = async (
  accessToken: string = "",
  dispatch: Dispatch<AnyAction>,
  mutation: DocumentNode,
  variables: any,
  query: any = null
) => {
  dispatch(setLoadingRedux(true));
  try {
    const resData = (await graphqlClient(accessToken).mutate({
      mutation,
      variables,
      refetchQueries: [{ query }],
    })) as ApolloClient<NormalizedCacheObject>;
    return {resData};
  } catch (error: any) {
    console.log(error.message);
  } finally {
    dispatch(setLoadingRedux(false));
  }
};
