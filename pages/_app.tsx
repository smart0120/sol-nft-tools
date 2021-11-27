import "../styles/globals.css";
import { ModalProvider } from "../providers/modal-provider";
import React from "react";
import { FileContextProvider } from "../providers/file-context-provider";
import { AlertProvider } from "../providers/alert-provider";
import TopMenu from "../components/top-menu";
import SideMenu from "../components/side-menu";
import Footer from "../components/footer";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <AlertProvider>
      <ModalProvider>
        <FileContextProvider>
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
        </FileContextProvider>
      </ModalProvider>
    </AlertProvider>
  );
}

export default MyApp;
