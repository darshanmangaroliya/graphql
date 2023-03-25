import React from "react";
import ReactDOM from "react-dom/client";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { theme } from "./utils/theme";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-forwarded-proto": "http",
      "Access-Control-Allow-Origin": "http://localhost:5173/",
      "Access-Control-Allow-Credentials": "true",
      'Content-Type': 'application/json',
    },
  };
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  // link: authLink.concat(httpLink),
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
