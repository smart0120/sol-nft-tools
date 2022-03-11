import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { ModalProvider } from "../providers/modal-provider";
import React from "react";
import { AlertProvider } from "../providers/alert-provider";
import TopMenu from "../components/top-menu";
import SideMenu from "../components/side-menu";
import Footer from "../components/footer";
import Head from "next/head";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useEndpoint } from "../hooks/use-endpoint";

const WalletProvider = dynamic(
  () => import("../contexts/ClientWalletProvider"),
  {
    ssr: false,
  }
);
function MyApp({ Component, pageProps }) {
  const { endpoint } = useEndpoint();
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider>
        <AlertProvider>
          <ModalProvider>
            <Head>
              <title>Solana NFT Tools</title>
            </Head>
            <div className="drawer drawer-end">
              <input id="my-drawer" type="checkbox" className="drawer-toggle" />
              <div
                className="h-screen grid drawer-content"
                style={{ gridTemplateRows: "76px auto 76px" }}
              >
                <TopMenu />

                <main className={`my-12 px-3`} style={{ maxWidth: "100vw" }}>
                  <div className="mx-auto" style={{ maxWidth: 800 }}>
                    <Component {...pageProps} />
                  </div>
                </main>

                <Footer />
              </div>

              <SideMenu />
            </div>
          </ModalProvider>
        </AlertProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
