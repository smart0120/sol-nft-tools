import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* eslint-disable-next-line @next/next/no-title-in-document-head */}
          <title>Solana NFT Tools</title>
          <meta name="description" content="Solana NFT Tools" />
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⭐</text></svg>"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@pentaclexyz" />
          <meta name="twitter:creator" content="@pentaclexyz" />
          <meta property="og:site_name" content="Solana NFT Tools" />
          <meta
            name="twitter:image"
            content="https://arweave.net/wEL_2xrc-tZRKvnd2I8DvFdL3q_Yw69ORZ4CeRfxwtk"
          />
          <meta
            name="twitter:image:alt"
            content="Solana NFT Tools, made by @pentaclexyz"
          />
          <meta name="twitter:title" content="Pentacle SOL NFT Tools" />
          <meta
            name="twitter:description"
            content="Solana NFT Tools, made by @pentaclexyz"
          />
          <meta name="og:url" content="https://sol-nft.tools" />
          <meta name="og:title" content="Solana NFT Tools" />
          <meta
            name="og:image"
            content="https://arweave.net/wEL_2xrc-tZRKvnd2I8DvFdL3q_Yw69ORZ4CeRfxwtk"
          />
          <meta
            property="og:description"
            content="Solana NFT Tools, made by @pentaclexyz"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/brands.min.css"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
            integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
          <html data-theme="dark" />
          <link
            rel="stylesheet"
            href="https://use.typekit.net/aqh6ylh.css"
          ></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
