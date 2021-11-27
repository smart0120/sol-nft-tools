import "../styles/globals.css";
import { ModalProvider } from "../providers/modal-provider";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { useRouter } from "next/router";
import { SelectNetwork } from "../components/select-network";
import { FileContextProvider } from "../providers/file-context-provider";
import { AlertProvider } from "../providers/alert-provider";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname, asPath } = router;
  const getClass = (path) => (asPath === `/${path}` ? "bordered" : "");
  const drawerRef = useRef<HTMLInputElement>();
  const setRoute = (route) => {
    router.push(route);
  };

  const MenuLink = ({ href, children }) => (
    <li
      onClick={() => {
        setRoute(href);
      }}
    >
      <label
        htmlFor="my-drawer"
        className={
          (pathname.includes(href) ? "bg-gray-600" : "") +
          " py-4 inline-block btn btn-ghost text-left normal-case"
        }
      >
        {children}
      </label>
    </li>
  );

  const Menu = () => (
    <div className="w-full text-center">
      <nav
        style={{ gridTemplateColumns: "1fr auto 1fr" }}
        // TODO: create class for this
        className="grid fixed left-0 right-0 max-w-6xl
            z-50 xl:mx-auto mx-4 my-2 py-1 xl:py-0 px-4 
            bg-base-300 rounded-box items-center justify-between 
            flex-wrap bg-blue-darkshadow-lg"
      >
        <div className="flex items-center flex-no-shrink text-white">
          <a
            href="https://pentacle.xyz"
            target="_blank"
            rel="noreferrer noopener"
            className="py-2 grid place-content-center"
          >
            <Image
              src="https://arweave.net/a1OuQE2NlH9lny36lmVtYg0NRV0Dxglgb_6MU4BCX4Y"
              width={180}
              height={40}
              alt="Pentacle Logo"
            />
          </a>
        </div>
        <div className="xl:hidden w-1/4 flex col-start-4">
          <label htmlFor="my-drawer" id="app" className="btn">
            <i className="fas fa-bars"></i>
          </label>
        </div>
        <ul
          className="menu horizontal justify-center w-full flex-grow lg:items-center lg:w-auto hidden xl:flex"
          id="menu"
        >
          <li className={getClass("get-mints")} key="mints">
            <Link href={{ pathname: "/get-mints" }}>
              <a>Get Mint IDs</a>
            </Link>
          </li>
          <li className={getClass("get-meta")}>
            <Link href={{ pathname: "/get-meta" }}>
              <a>Token Metadata</a>
            </Link>
          </li>
          <li className={getClass("get-holders")} key="holders">
            <Link href={{ pathname: "/get-holders" }}>Holder Snapshot</Link>
          </li>
          <li className={getClass("find-stuck-sol")}>
            <Link href={{ pathname: "/find-stuck-sol" }}>Find Stuck SOL</Link>
          </li>
          <li className={getClass("get-ar-links")}>
            <Link href={{ pathname: "/get-ar-links" }}>
              Arweave Upload (Beta)
            </Link>
          </li>
          <li>
            <a
              href="https://solsned.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              SolSned
            </a>
          </li>
        </ul>
        <div className="w-1/4 hidden xl:block"></div>
      </nav>
    </div>
  );

  return (
    <AlertProvider>
      <ModalProvider>
        <FileContextProvider>
          <div className="drawer drawer-end">
            <input
              id="my-drawer"
              ref={drawerRef}
              type="checkbox"
              className="drawer-toggle"
            />
            <div
              className="h-screen grid drawer-content"
              style={{ gridTemplateRows: "76px auto 76px" }}
            >
              <Menu />

              <main className={`my-12 px-3`} style={{ maxWidth: "100vw" }}>
                <div className="mx-auto" style={{ maxWidth: 800 }}>
                  <Component {...pageProps} />
                </div>
              </main>

              <footer
                className={`border-t-2 grid gap-8 place-content-center fixed left-0 right-0 bottom-0 px-8 py-2`}
                style={{
                  gridTemplateColumns: "1fr auto 1fr",
                  background: "rgba(0,0,0,0.7)",
                }}
              >
                <div></div>
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
                <span className="ml-auto hidden md:inline-flex justify-center">
                  <SelectNetwork />
                </span>
              </footer>
            </div>

            <div className="drawer-side">
              <label htmlFor="my-drawer" className="drawer-overlay"></label>
              <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content gap-2">
                <li>
                  <a
                    href="https://pentacle.xyz"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="py-2 hover:bg-opacity-0 focus:bg-opacity-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://arweave.net/a1OuQE2NlH9lny36lmVtYg0NRV0Dxglgb_6MU4BCX4Y"
                      width={180}
                      height={40}
                      alt="Pentacle Logo"
                    />
                  </a>
                </li>
                <MenuLink href="/get-mints">Get Mint IDs</MenuLink>
                <MenuLink href="/get-meta">Token Metadata</MenuLink>
                <MenuLink href="/get-holders">Holder Snapshot</MenuLink>
                <MenuLink href="/find-stuck-sol">Find Stuck SOL</MenuLink>
                <MenuLink href="/get-ar-links">Arweave Upload (Beta)</MenuLink>
                <li>
                  <a
                    href="https://solsned.vercel.app"
                    target="_blank"
                    rel="noreferrer"
                    className="p-0"
                  >
                    <label className="py-4 btn btn-ghost text-left normal-case w-full flex flex-row justify-between">
                      <span>SolSned</span>

                      <i className="fas fa-external-link-square-alt"></i>
                    </label>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </FileContextProvider>
      </ModalProvider>
    </AlertProvider>
  );
}

export default MyApp;
