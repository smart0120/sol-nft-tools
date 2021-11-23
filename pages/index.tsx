import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GibHolders } from "../components/gib-holders";
import { GibMints } from "../components/gib-mints";
import { GibMeta } from "../components/gib-meta";
import styles from "../styles/Home.module.css";
import ARUpload from "../components/upload-arweave";
import { GibStuckSol } from "../components/gib-stuck-sol";
import { SelectNetwork } from "../components/select-network";

export default function Home() {
  const [menuToggled, setMenuToggled] = useState(false);
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
    <div
      className="h-screen grid"
      style={{ gridTemplateRows: "76px auto 76px" }}
    >
      <div className="w-full text-center">
        <nav className="flex fixed left-0 right-0 z-10 mx-8 my-4 py-1 xl:py-0 bg-base-300 rounded-box items-center justify-between flex-wrap bg-blue-dark px-4">
          <div className="flex items-center flex-no-shrink text-white mr-6 w-1/4">
            <a
              href="https://pentacle.xyz"
              target="_blank"
              rel="noreferrer noopener"
              className="py-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://pentacle.ai/pentacle-logo-LH.svg"
                style={{ width: 180 }}
                alt=""
              />
            </a>
          </div>  
          <div className="xl:hidden w-1/4 flex">
            <button
              id="app"
              onClick={() => setMenuToggled(!menuToggled)}
              className="flex items-center ml-auto px-3 py-2 border rounded text-white focus:outline-none border-white"
            >
              <svg
                className="fill-current h-4 w-3 -mt-1 text-white"
                viewBox="0 0 20 15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
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
            <li key="">
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

      <main className={`mt-12 px-3`} style={{ maxWidth: '100vw'}}>
        <div className={styles["inner-container"]}>
          {selectedKeys[0] === "meta" && <GibMeta endpoint={endpoint} />}
          {selectedKeys[0] === "holders" && <GibHolders endpoint={endpoint} />}
          {selectedKeys[0] === "mints" && <GibMints endpoint={endpoint} />}
          {selectedKeys[0] === "stuck-sol" && (
            <GibStuckSol endpoint={endpoint} />
          )}
          {selectedKeys[0] === "ar-links" && <ARUpload />}
        </div>
      </main>

      <footer
        className={`border-t-2 grid gap-8 place-content-center px-8`}
        style={{ gridTemplateColumns: "1fr auto 1fr" }}
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
        <span className="ml-auto hidden md:inline-block">
          <SelectNetwork
            endpoint={endpoint}
            selectedKey={selectedKeys[0]}
            setEndpoint={setEndpoint}
          />
        </span>
      </footer>
    </div>
  );
}
