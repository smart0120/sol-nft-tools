import { useRouter } from "next/router";
import Image from "next/image";
import { ArweaveURI } from "../util/arweave-uri";

const MenuLink = ({ href, children }) => {
  const router = useRouter();
  const { pathname } = router;
  const setRoute = (route) => {
    router.push(route);
  };
  return (
    <li onClick={() => setRoute(href)}>
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
};

export default function SideMenu() {
  return (
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
              src={ArweaveURI.PentacleLogo}
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
              <span>SnedMaster 9000</span>

              <i className="fas fa-external-link-square-alt"></i>
            </label>
          </a>
        </li>
      </ul>
    </div>
  );
}
