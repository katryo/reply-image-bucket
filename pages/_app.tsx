import "../styles/globals.css";
import * as React from "react";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { ChakraProvider } from "@chakra-ui/react";
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../src/aws-exports";
Amplify.configure(awsconfig);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
