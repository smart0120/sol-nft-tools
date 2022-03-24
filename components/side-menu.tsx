import { useRouter } from "next/router";
import Image from "next/image";
import { ArweaveURI } from "../util/arweave-uri";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const MenuLink = ({ href, children, activatesDrawer = true }) => {
  const router = useRouter();
  const { pathname } = router;
  return (
    <li onClick={() => router.push(href)}>
      <label
        htmlFor={activatesDrawer && "my-drawer"}
        className={
          (pathname.includes(href) ? "bg-gray-600" : "") +
          " py-4 inline-block btn btn-ghost text-left normal-case"
        }
      >
        {children}
      </label>
    </li>
  );
};

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
        <MenuLink href="/get-mints">
          <div>
            {" "}
            <i className="fa-solid fa-fingerprint mr-3"></i>
            Get Mint IDs
          </div>
        </MenuLink>
        <MenuLink href="/get-meta">
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
        <MenuLink href="/get-holders">
          <div>
            <i className="fa-solid fa-camera mr-3"></i>
            Holder Snapshot
          </div>
        </MenuLink>
        <MenuLink href="/get-minters">
          {" "}
          <i className="fa-solid fa-coins mr-3"></i>
          Minter Snapshott
        </MenuLink>
        <MenuLink href="/burn-nfts">
          {" "}
          <i className="fa-solid fa-fire mr-3"></i>
          Burn NFTs
        </MenuLink>
        {/* <MenuLink href="/find-stuck-sol">Find Stuck SOL</MenuLink> */}
        <MenuLink href="/get-ar-links">
          <i className="fa-solid fa-file-arrow-up mr-3"></i>
          Arweave Upload
        </MenuLink>
        <li>
          <a
            href="https://solsned.com"
            target="_blank"
            rel="noreferrer"
            className="p-0"
          >
            <label className="py-4 btn btn-ghost text-left normal-case w-full flex flex-row justify-between">
              <span>
                <i className="fa-solid fa-hand-holding-dollar mr-3"></i>
                <span>SnedMaster 9000</span>
              </span>

              <i className="fas fa-external-link-square-alt"></i>
            </label>
          </a>
        </li>
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
    </div>
  );
}
