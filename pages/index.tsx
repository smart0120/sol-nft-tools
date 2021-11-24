import { useRouter } from "next/router";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { GibHolders } from "../components/gib-holders";
import { GibMints } from "../components/gib-mints";
import { GibMeta } from "../components/gib-meta";
import styles from "../styles/Home.module.css";
import ARUpload from "../components/upload-arweave";
import { GibStuckSol } from "../components/gib-stuck-sol";
import { SelectNetwork } from "../components/select-network";

export default function Home() {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState([
    (router.query?.mode as string) || "mints",
  ]);
  const [endpoint, setEndpoint] = useState("https://pentacle.genesysgo.net");
  const setRoute = (route) => {
    router.push({ query: { mode: route } });
    setSelectedKeys([route]);
  };
  useEffect(() => {
    if (router.query?.mode) {
      setSelectedKeys([router.query?.mode as string]);
    }
  }, [router.query?.mode]);

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div
        className="h-screen grid drawer-content"
        style={{ gridTemplateRows: "76px auto 76px" }}
      >
        <div className="w-full text-center">
          <nav
            style={{ gridTemplateColumns: "1fr auto 1fr" }}
            className="grid fixed left-0 right-0 max-w-6xl
            z-10 xl:mx-auto mx-4 my-2 py-1 xl:py-0 px-4 
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
              <li
                className={selectedKeys[0] === "mints" ? "bordered" : ""}
                onClick={() => setRoute("mints")}
                key="mints"
              >
                <a href="#" className="py-4 inline-block">
                  Get Mint IDs
                </a>
              </li>
              <li
                className={selectedKeys[0] === "meta" ? "bordered" : ""}
                onClick={() => setRoute("meta")}
                key="meta"
              >
                <a href="#" className="py-4 inline-block">
                  Token Metadata
                </a>
              </li>
              <li
                className={selectedKeys[0] === "holders" ? "bordered" : ""}
                onClick={() => setRoute("holders")}
                key="holders"
              >
                <a href="#" className="py-4 inline-block">
                  Holder Snapshot
                </a>
              </li>
              <li
                className={selectedKeys[0] === "stuck-sol" ? "bordered" : ""}
                onClick={() => setRoute("stuck-sol")}
                key="stuck-sol"
              >
                <a href="#" className="py-4 inline-block">
                  Find Stuck SOL
                </a>
              </li>
              <li
                className={selectedKeys[0] === "ar-links" ? "bordered" : ""}
                onClick={() => setRoute("ar-links")}
                key="ar-links"
              >
                <a href="#" className="py-4 inline-block">
                  Arweave Upload (Beta)
                </a>
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

        <main className={`my-12 px-3`} style={{ maxWidth: "100vw" }}>
          <div className={styles["inner-container"]}>
            {selectedKeys[0] === "meta" && <GibMeta endpoint={endpoint} />}
            {selectedKeys[0] === "holders" && (
              <GibHolders endpoint={endpoint} />
            )}
            {selectedKeys[0] === "mints" && <GibMints endpoint={endpoint} />}
            {selectedKeys[0] === "stuck-sol" && (
              <GibStuckSol endpoint={endpoint} />
            )}
            {selectedKeys[0] === "ar-links" && <ARUpload />}
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
            <SelectNetwork
              endpoint={endpoint}
              selectedKey={selectedKeys[0]}
              setEndpoint={setEndpoint}
            />
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
              <Image
                src="https://arweave.net/a1OuQE2NlH9lny36lmVtYg0NRV0Dxglgb_6MU4BCX4Y"
                width={180}
                height={40}
                alt="Pentacle Logo"
              />
            </a>
          </li>
          <li
            onClick={() => {
              setRoute("mints");
            }}
            key="mints"
          >
            <label
              htmlFor="my-drawer"
              className={
                (selectedKeys[0] === "mints" ? "bg-gray-600" : "") +
                " py-4 inline-block btn btn-ghost text-left normal-case"
              }
            >
              Get Mint IDs
            </label>
          </li>
          <li
            onClick={() => {
              setRoute("meta");
            }}
            key="meta"
          >
            <label
              htmlFor="my-drawer"
              className={
                (selectedKeys[0] === "meta" ? "bg-gray-600" : "") +
                " py-4 inline-block btn btn-ghost text-left normal-case"
              }
            >
              Token Metadata
            </label>
          </li>
          <li
            onClick={() => {
              setRoute("holders");
            }}
            key="holders"
          >
            <label
              htmlFor="my-drawer"
              className={
                (selectedKeys[0] === "holders" ? "bg-gray-600" : "") +
                " py-4 inline-block btn btn-ghost text-left normal-case"
              }
            >
              Holder Snapshot
            </label>
          </li>
          <li
            onClick={() => {
              setRoute("stuck-sol");
            }}
            key="stuck-sol"
          >
            <label
              htmlFor="my-drawer"
              className={
                (selectedKeys[0] === "stuck-sol" ? "bg-gray-600" : "") +
                " py-4 inline-block btn btn-ghost text-left normal-case"
              }
            >
              Find Stuck SOL
            </label>
          </li>
          <li
            onClick={() => {
              setRoute("ar-links");
            }}
            key="ar-links"
          >
            <label
              htmlFor="my-drawer"
              className={
                (selectedKeys[0] === "ar-links" ? "bg-gray-600" : "") +
                " py-4 inline-block btn btn-ghost text-left normal-case"
              }
            >
              Arweave Upload (Beta)
            </label>
          </li>
          <li key="">
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
  );
}
