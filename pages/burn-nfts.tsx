import React, {
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";

import { SOL_ADDRESS_REGEXP } from "../util/validators";
import { ModalContext } from "../providers/modal-provider";
import { useEndpoint } from "../hooks/use-endpoint";
import { AlertContext } from "../providers/alert-provider";
import { getMints } from "../util/get-mints";

export default function BurnNFTs() {
  const { setModalState } = useContext(ModalContext);
  const { setAlertState } = useContext(AlertContext);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const router = useRouter();

  const initState: {
    nfts: any[];
    status: string;
    publicAddress: null | string;
    itemsPerPage: 4 | 10 | 20 | 100;
  } = {
    nfts: [],
    publicAddress: null,
    status: "idle",
    itemsPerPage: 4,
  };
  const [state, dispatch] = useReducer(
    (
      state: typeof initState,
      action:
        | { type: "started"; payload?: null }
        | { type: "error"; payload?: null }
        | { type: "success"; payload: { nfts: any[] } }
        | { type: "publicAddress"; payload: { publicAddress: string } }
        | { type: "itemsPerPage"; payload: { itemsPerPage: number } }
    ) => {
      switch (action.type) {
        case "started":
          return { ...state, status: "pending" };
        case "error":
          return { ...state, status: "rejected" };
        case "itemsPerPage":
          return { ...state, itemsPerPage: action.payload.itemsPerPage };
        case "publicAddress":
          return { ...state, publicAddress: action.payload.publicAddress };
        case "success":
          return { ...state, status: "resolved", nfts: action.payload.nfts };
        default:
          throw new Error("unsupported action type given on BurnNFTs reducer");
      }
    },
    initState
  );

  const handleNFTs = useCallback(async () => {
    if (!publicKey) {
      return;
    }

    try {
      dispatch({ type: "started" });
      const publicAddress = await resolveToWalletAddress({
        text: publicKey.toBase58(),
      });
      dispatch({ type: "publicAddress", payload: { publicAddress } });
      const nfts = await getParsedNftAccountsByOwner({ publicAddress });
      const promises = nfts.map(({ data }) => axios(data.uri));
      const nftsWithImagesData = await Promise.all(promises);

      const nftsWithImages = nfts.map((nft) => {
        const match = nftsWithImagesData.find(
          ({ data }) => data.name === nft.data.name
        );

        if (match) {
          if (match.data.image) {
            return { ...nft, image: match.data.image };
          } else if (match.data.properties.category === "video") {
            return {
              ...nft,
              image: null,
              video: { ...match.data.properties?.files[0] },
            };
          } else return { ...nft, image: null, video: null };
        } else return { ...nft, image: null, video: null };
      });
      dispatch({ type: "success", payload: { nfts: nftsWithImages } });
    } catch (err) {
      dispatch({ type: "error" });
    }
  }, [publicKey, dispatch]);

  const itemsPerPage = useMemo(() => state.itemsPerPage, [state]);

  const page = useMemo(() => {
    return Number(router.query.page) || 1;
  }, [router.query]);

  const nftsToRender = useMemo(() => {
    if (!state.nfts) {
      return [];
    }

    const nftsCopy = [...state.nfts];
    const chunkedNFTs = [];
    const firstChunk = nftsCopy.splice(0, state.itemsPerPage);
    chunkedNFTs.push(firstChunk);
    while (nftsCopy.length) {
      const chunk = nftsCopy.splice(0, state.itemsPerPage);
      chunkedNFTs.push(chunk);
    }
    return chunkedNFTs[page - 1];
  }, [state, page]);

  const handleNextPage = useCallback(() => {
    router.replace({
      pathname: router.pathname,
      query: { ...router.query, page: page + 1 },
    });
  }, [page, router]);

  const handlePrevPage = useCallback(() => {
    if (page - 1 === 1) {
      const newQuery = { ...router.query };
      delete newQuery.page;
      router.replace({ pathname: router.pathname, query: newQuery });
    }

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, page: page - 1 },
    });
  }, [page, router]);

  const handleItemsPerPageSelection = useCallback(
    (itemsPerPage: number) => {
      dispatch({ type: "itemsPerPage", payload: { itemsPerPage } });
    },
    [dispatch]
  );

  useEffect(() => {
    if (publicKey && state.status === "idle") {
      handleNFTs();
    }
  }, [publicKey, state, handleNFTs]);

  const itemsPerPageSelectionDisplay = useMemo(() => {
    const options = [4, 10, 20, 100];

    return (
      <div className="w-full mt-8 flex items-center justify-center">
        <p className="mr-2">Items per page:</p>
        <div className="flex">
          {options.map((opt, index) => (
            <div key={opt}>
              <button
                type="button"
                onClick={() => handleItemsPerPageSelection(opt)}
                disabled={opt === state.itemsPerPage}
                className={opt === state.itemsPerPage ? "" : "underline"}
              >
                {opt}
              </button>
              {index < options.length - 1 ? (
                <span className="mx-2">|</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }, [state.itemsPerPage, handleItemsPerPageSelection]);

  const paginationDisplay = useMemo(() => {
    return state.nfts.length > state.itemsPerPage ? (
      <div className="flex m-auto items-center justify-between w-full max-w-md mt-8">
        <button
          type="button"
          className="btn"
          onClick={handlePrevPage}
          disabled={page < 2}
        >
          Previous
        </button>
        <div className="text-xl text-white text-center">{page}</div>
        <button
          type="button"
          className="btn"
          onClick={handleNextPage}
          disabled={state.nfts.length < page * state.itemsPerPage}
        >
          Next
        </button>
      </div>
    ) : null;
  }, [state, page, handlePrevPage, handleNextPage]);

  const nftDisplay = useMemo(() => {
    if (["idle", "pending"].includes(state.status)) {
      return <p className="text-center text-lg text-white">fetching NFTs...</p>;
    }

    return state.status === "rejected" ? (
      <p className="text-center text-lg text-white">
        There was an error fetching your NFTS :(
      </p>
    ) : (
      <>
        <div>
          {state.nfts.length === 0 ? (
            <p className="text-center text-lg text-white">
              You have no NFTs :(
            </p>
          ) : (
            <div className="flex items-center flex-wrap">
              {nftsToRender.map((nft) => (
                <div className="w-full md:w-1/4 p-4" key={nft.mint}>
                  <div className="flex flex-col items-center rounded-md bg-gray-800 object-contain h-60 justify-between p-4">
                    <div className="w-full bg-black flex items-center justify-center">
                      {nft.image ? (
                        <>
                          {nft.image.includes("arweave") ? (
                            <Image
                              alt=""
                              src={nft.image}
                              width="100%"
                              height="100%"
                            />
                          ) : (
                            // eslint-disable-next-line
                            <img
                              src={nft.image}
                              alt=""
                              className="w-full block h-24 object-contain"
                            />
                          )}
                        </>
                      ) : null}
                      {nft.video ? (
                        <video width={100} height={300} autoPlay loop>
                          <source src={nft.video.uri} type={nft.video.type} />
                        </video>
                      ) : null}
                    </div>
                    <strong className="mt-2 text-center">
                      {nft.data.name}
                    </strong>
                    <button
                      type="button"
                      className="btn btn-primary mt-2 w-full"
                    >
                      burn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {paginationDisplay}
        {itemsPerPageSelectionDisplay}
      </>
    );
  }, [state, itemsPerPageSelectionDisplay, paginationDisplay, nftsToRender]);

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl text-white">Burn These NFTs</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tools facilitates the destruction of NFTs that the connected wallet
        owns
      </p>
      <div className="flex flex-col items-center justify-center my-4 text-sm">
        {publicKey ? (
          <>
            <p className="text-center break-all text-white">
              <span>Connected Address:</span>
              <br />
              {state.publicAddress}
            </p>
            <WalletDisconnectButton
              style={{
                fontSize: "0.75rem",
                height: "2rem",
                marginTop: "1rem",
              }}
            />
          </>
        ) : (
          <WalletMultiButton
            style={{
              fontSize: "0.75rem",
              height: "2rem",
            }}
          />
        )}
      </div>
      <hr className="opacity-10 my-4" />
      {publicKey ? (
        <div className="card bg-gray-900 p-4">{nftDisplay}</div>
      ) : null}
    </>
  );
}
