import { ColorModeScript, extendTheme } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
});

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.initialColorMode}  />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}