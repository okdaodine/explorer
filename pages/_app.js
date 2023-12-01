import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SWRConfig } from 'swr';
import Head from 'next/head';

const theme = extendTheme({
  breakpoints: {
    base: "0px",
    sm: "960px",
    md: "960px",
    lg: "960px",
    xl: "960px",
    '2xl': "960px",
  }
});

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{
      revalidateOnMount: true,
      revalidateOnFocus: false,
      refreshInterval: 0,
    }}>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Blockchain Explorer</title>
        </Head>
        <Box bg='gray.900' color='gray.100' w='100vw' minH='100vh'>
          <Component {...pageProps} />
        </Box>
      </ChakraProvider>
    </SWRConfig>
  );
}
