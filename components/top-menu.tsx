import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";

export default function TopMenu () {
  const router = useRouter();
  const { asPath } = router;
  const getClass = (path) => (asPath === `/${path}` ? "bordered" : "");
  
  return (
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
}