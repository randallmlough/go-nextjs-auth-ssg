import Document, { Html, Head, Main, NextScript } from "next/document";
import HtmlBodyClasses from "@/utils/classes";

const css = `
    #__next {
        height: 100%;
    }
`;

export default class CustomDocument extends Document {
  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    const isFullPage = pageProps?.fullPage;
    const bgColor = pageProps?.bgColor;
    const { htmlClasses, bodyClasses } = HtmlBodyClasses({
      isFullPage,
      bgColor,
    });
    return (
      <Html className={htmlClasses}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <style>{css}</style>
        </Head>
        <body className={bodyClasses}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
