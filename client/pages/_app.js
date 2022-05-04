import "../styles/globals.css";
import Head from "next/head";
import NavigationBar from "../components/shared/NavigationBar";
import { Provider } from "next-auth/client";
import { ChakraProvider } from "@chakra-ui/react";
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
        ></link>
      </Head>
      <Provider session={pageProps.session}>
        <ChakraProvider>
          <NavigationBar />
          <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </>
  );
}

export default MyApp;
