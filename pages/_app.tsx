import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { ModalProvider } from "../providers/modal-provider";
import React from "react";
import { AlertProvider } from "../providers/alert-provider";
import Image from "next/image";
import SideMenu, { MenuLink } from "../components/side-menu";
import Head from "next/head";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useEndpoint } from "../hooks/use-endpoint";
import TopMenu from "../components/top-menu";

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
              <div className="h-screen drawer-content lg:ml-64">
                <div className="lg:hidden">
                  <TopMenu />
                </div>
                <ul className="hidden lg:inline-block lg:fixed left-0 top-0 bottom-0 menu p-4 overflow-y-auto w-64 bg-base-300 text-base-content gap-2 relative">
                  <li>
                    <a
                      href="https://pentacle.xyz"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="py-2 hover:bg-opacity-0 focus:bg-opacity-0"
                    >
                      <Image
                        src="/pentacle-logo.svg"
                        width={180}
                        height={40}
                        alt="Pentacle"
                      />
                    </a>
                  </li>
                  <MenuLink activatesDrawer={false} href="/get-mints">
                    Get Mint IDs
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-meta">
                    Token Metadata
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-holders">
                    Holder Snapshot
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-minters">
                    Minter Snapshot
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/burn-nfts">
                    Burn NFTs
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/find-stuck-sol">
                    Find Stuck SOL
                  </MenuLink>
                  <MenuLink activatesDrawer={false} href="/get-ar-links">
                    Arweave Upload (Beta)
                  </MenuLink>
                  <li>
                    <a
                      href="https://solsned.vercel.app"
                      target="_blank"
                      rel="noreferrer"
                      className="p-0"
                    >
                      <label className="py-4 btn btn-ghost text-left normal-case w-full flex flex-row justify-between">
                        <span>SnedMaster 9000</span>

                        <i className="fas fa-external-link-square-alt"></i>
                      </label>
                    </a>
                  </li>

                  <li className="absolute bottom-4 left-0 w-full">
                    <div className={`flex gap-6 items-center justify-center`}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/penta-fun/sol-nft-tools/"
                      >
                        <i
                          className="fab fa-github"
                          style={{ fontStyle: "normal", fontSize: 24 }}
                        ></i>
                      </a>
                      <div className="text-center flex items-center justify-center flex-col">
                        <span> Made with {"❤️"}</span>
                        <a
                          href="https://twitter.com/0xAlice_"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          by 0xAlice
                        </a>
                      </div>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://twitter.com/pentaclexyz"
                      >
                        <i
                          className="fab fa-twitter"
                          style={{ fontStyle: "normal", fontSize: 24 }}
                        ></i>
                      </a>
                    </div>
                  </li>
                </ul>

                <main
                  className={`my-20 px-3 lg:col-span-1 col-span-2`}
                  style={{ maxWidth: "100%" }}
                >
                  <div
                    className="mx-auto"
                    style={{ maxWidth: "100%", width: 800 }}
                  >
                    <Component {...pageProps} />
                  </div>
                </main>
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
