import Document, { Html, Head, Main, NextScript } from "next/document";
import { MagicScriptTag } from "../page-components/_document/magic-script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Work+Sans:400,500,600,700%7CArchivo:400,500,600%7CRoboto+Mono:400&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <MagicScriptTag />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
