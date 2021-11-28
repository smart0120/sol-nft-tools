import React from "react";
import { SelectNetwork } from "./select-network";

export default function Footer() {
  return (
    <footer
      className={`border-t-2 grid gap-8 place-content-center fixed left-0 right-0 bottom-0 px-8 py-2 z-30`}
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
  );
}
