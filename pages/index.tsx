import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { GibHolders } from "../components/gib-holders";
import { GibMints } from "../components/gib-mints";
import { GibMeta } from "../components/gib-meta";
import styles from "../styles/Home.module.css";
import { ENDPOINTS } from "../util/endpoints";
import ARUpload from "../components/upload-arweave";
import { GibStuckSol } from "../components/gib-stuck-sol";

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
  const selectRef = useRef<HTMLSelectElement>();

  useEffect(() => {
    if (router.query?.mode) {
      setSelectedKeys([router.query?.mode as string]);
    }
  }, [router.query?.mode]);

  const SelectNetwork = () => {
    return (
      <select
        ref={selectRef}
        className="select ml-8"
        defaultValue={endpoint}
        style={{ minWidth: 200 }}
      >
        {ENDPOINTS.map((ep) => (
          <option key={ep.name} value={ep.endpoint}>
            {ep.name} ({ep.endpoint})
          </option>
        ))}
      </select>
    );
  };

  return (
    <>
      <div className="w-full text-center">
        <ul className="menu items-stretch px-3 shadow-lg bg-base-300 horizontal rounded-box mt-3">
          <li>
            <a
              href="https://pentacle.xyz"
              target="_blank"
              rel="noreferrer noopener"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://pentacle.ai/pentacle-logo-LH.svg"
                style={{ width: 180 }}
                alt=""
              />
            </a>
          </li>

          <li
            className={selectedKeys[0] === "mints" ? "bordered" : ""}
            onClick={() => setRoute("mints")}
            key="mints"
          >
            <a href="#">Gib Mints</a>
          </li>
          <li
            className={selectedKeys[0] === "meta" ? "bordered" : ""}
            onClick={() => setRoute("meta")}
            key="meta"
          >
            <a href="#">Gib Meta</a>
          </li>
          <li
            className={selectedKeys[0] === "holders" ? "bordered" : ""}
            onClick={() => setRoute("holders")}
            key="holders"
          >
            <a href="#">Gib Holders</a>
          </li>
          <li
            className={selectedKeys[0] === "stuck-sol" ? "bordered" : ""}
            onClick={() => setRoute("stuck-sol")}
            key="stuck-sol"
          >
            <a href="#">Gib Stuck SOL</a>
          </li>
          <li
            className={selectedKeys[0] === "ar-links" ? "bordered" : ""}
            onClick={() => setRoute("ar-links")}
            key="ar-links"
          >
            <a href="#">Gib AR-Links (Beta)</a>
          </li>
          <li key="" style={{ marginRight: "auto" }}>
            <a
              href="https://solsned.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              SolSned
            </a>
          </li>

          <li className="flex items-center">
            <SelectNetwork />
          </li>
        </ul>
      </div>
      <div className={styles.container}>
        <main className={`${styles.main} max-w-full`}>
          <h2 className="text-5xl">{`GIB ${selectedKeys[0].toUpperCase()}!`}</h2>
          <div className={styles["inner-container"]}>
            <hr className="my-6 opacity-10" />
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

        <footer className={styles.footer}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 32,
            }}
          >
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
        </footer>
      </div>
    </>
  );
}
