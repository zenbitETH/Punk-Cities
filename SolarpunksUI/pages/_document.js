import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html className="bg-fixed bg-gradient-to-t from-night-100 to-cyber-100">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Web site created using create-react-app" />
      </Head>
      <body >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
