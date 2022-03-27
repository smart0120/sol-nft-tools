import { useRouter } from "next/router";
import Image from "next/image";
import { ArweaveURI } from "../util/arweave-uri";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { MenuLink } from "./menu-link";

export default function SideMenu() {
  return (
    <div className="drawer-side lg:hidden">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 overflow-y-auto w-80 bg-base-300 border-l border-gray-700 shadow text-base-content gap-2">
        <li>
          <a
            href="https://pentacle.xyz"
            target="_blank"
            rel="noreferrer noopener"
            className="py-2 hover:bg-opacity-0 focus:bg-opacity-0"
          >
            <Image
              src={ArweaveURI.PentacleLogo}
              width={221}
              height={64}
              alt="Pentacle"
            />
          </a>
        </li>
        <MenuLink href="/nft-mints">
          <div>
            <i className="fa-solid fa-fingerprint mr-3"></i>
            Get NFT Mints
          </div>
        </MenuLink>
        <MenuLink href="/token-metadata">
          <div>
            <div
              style={{ width: 14 }}
              className="inline-flex items-center justify-center mr-3"
            >
              <i className="fa-solid fa-info"></i>
            </div>
            Token Metadata
          </div>
        </MenuLink>
        <MenuLink href="/holder-snapshot">
          <i className="fa-solid fa-camera mr-3"></i>
          <span> Holder Snapshot</span>
        </MenuLink>
        <MenuLink href="/nft-minters">
          <i className="fa-solid fa-coins mr-3"></i>
          <span> NFT Minters</span>
        </MenuLink>
        <MenuLink href="/burn-nfts">
          <i className="fa-solid fa-fire mr-3"></i>
          <span>Burn NFTs</span>
        </MenuLink>
        <MenuLink href="/mint-nft">
          <i className="fa-solid fa-hammer mr-3"></i>
          Mint NFT
        </MenuLink>
        {/* <MenuLink href="/find-stuck-sol">Find Stuck SOL</MenuLink> */}
        <MenuLink href="/arweave-upload">
          <i className="fa-solid fa-file-arrow-up mr-3"></i>
          <span>Arweave Upload</span>
        </MenuLink>
        <MenuLink href="/snedmaster">
          <i className="fa-solid fa-hand-holding-dollar mr-3"></i>
          <span>SnedMaster</span>
        </MenuLink>
        <li>
          <WalletMultiButton className="w-full" />
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
              <span>
                Made with <i className="fa-solid fa-heart ml-1"></i>
              </span>
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
    </div>
  );
}
