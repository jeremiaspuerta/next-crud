import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import Layout from "components/Layout";
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
