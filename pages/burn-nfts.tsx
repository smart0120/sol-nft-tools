import React, {
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
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
import { PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";

import { ModalContext } from "../providers/modal-provider";
import { AlertContext } from "../providers/alert-provider";

function NFTPreview({ nft }) {
  return (
    <>
      <div className="w-full bg-black flex items-center justify-center">
        {nft.image ? (
          <>
            {nft.image.includes("arweave") ? (
              <Image alt="" src={nft.image} width="100%" height="100%" />
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
      <strong className="mt-2 text-center">{nft.data.name}</strong>
    </>
  );
}

export default function BurnNFTs() {
  const { setModalState } = useContext(ModalContext);
  const { setAlertState } = useContext(AlertContext);
  const {connection} = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const router = useRouter();

  const initState: {
    nfts: any[];
    status: string;
    publicAddress: null | string;
    itemsPerPage: 4 | 10 | 20 | 100;
    isModalOpen: boolean;
    isBurning: boolean;
    selectedNFT: any;
  } = {
    nfts: [],
    publicAddress: null,
    status: "idle",
    itemsPerPage: 4,
    isModalOpen: false,
    isBurning: false,
    selectedNFT: null,
  };
  const [state, dispatch] = useReducer(
    (
      state: typeof initState,
      action:
        | { type: "started"; payload?: null }
        | { type: "error"; payload?: null }
        | { type: "unselect"; payload?: null }
        | { type: "burning"; payload?: null }
        | { type: "burned"; payload?: null }
        | { type: "success"; payload: { nfts: any[] } }
        | { type: "nfts"; payload: { nfts: any[] } }
        | { type: "publicAddress"; payload: { publicAddress: string } }
        | { type: "itemsPerPage"; payload: { itemsPerPage: number } }
        | { type: "selectedNFT"; payload: { selectedNFT: any } }
    ) => {
      switch (action.type) {
        case "started":
          return { ...state, status: "pending" };
        case "nfts":
          return { ...state, nfts: action.payload.nfts };
        case "burning":
          return { ...state, isBurning: true };
        case "burned":
          return { ...state, isBurning: false };
        case "error":
          return { ...state, status: "rejected" };
        case "itemsPerPage":
          return { ...state, itemsPerPage: action.payload.itemsPerPage };
        case "publicAddress":
          return { ...state, publicAddress: action.payload.publicAddress };
        case "success":
          return { ...state, status: "resolved", nfts: action.payload.nfts };
        case "unselect":
          return { ...state, selectedNFT: null, isModalOpen: false };
        case "selectedNFT":
          return {
            ...state,
            isModalOpen: true,
            selectedNFT: action.payload.selectedNFT,
          };
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
      const promises = nfts.map(({ data }) => axios(data?.uri));
      const nftsWithImagesData = await Promise.all(promises);

      const nftsWithImages = nfts.map((nft) => {
        const match = nftsWithImagesData.find(
          ({ data }) => data?.name === nft?.data?.name
        );

        if (match) {
          if (match.data?.image) {
            return { ...nft, image: match.data?.image };
          } else if (match.data?.properties?.category === "video") {
            return {
              ...nft,
              image: null,
              video: { ...match?.data?.properties?.files[0] },
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
    const firstChunk = nftsCopy.splice(0, itemsPerPage);
    chunkedNFTs.push(firstChunk);
    while (nftsCopy.length) {
      const chunk = nftsCopy.splice(0, itemsPerPage);
      chunkedNFTs.push(chunk);
    }
    return chunkedNFTs[page - 1];
  }, [state, page, itemsPerPage]);

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
      router.replace({ pathname: router.pathname, query: { ...newQuery } });
      return;
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

  const handleNFTSelect = useCallback((selectedNFT: any) => {
    dispatch({ type: "selectedNFT", payload: { selectedNFT } });
  }, []);

  const handleNFTUnselect = useCallback(() => {
    dispatch({ type: "unselect" });
  }, []);

  const removeNFT = useCallback(
    (nft: any) => {
      dispatch({
        type: "nfts",
        payload: { nfts: state.nfts.filter((i) => i.mint !== nft.mint) },
      });
    },
    [state.nfts]
  );

  const handleBurn = useCallback(async () => {
    if (!publicKey || !state.selectedNFT) {
      return;
    }

    try {
      dispatch({ type: "burning" });
      const mint = new PublicKey(state.selectedNFT.mint);
      const mintAssociatedAccountAddress = await spl.getAssociatedTokenAddress(
        mint,
        publicKey,
        false,
        spl.TOKEN_PROGRAM_ID,
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const instruction = spl.createBurnInstruction(
        mintAssociatedAccountAddress,
        mint,
        publicKey,
        1,
        []
      );

      const closeIx = spl.createCloseAccountInstruction(
        mintAssociatedAccountAddress,
        publicKey,
        publicKey,
        []
      );

      const getBlockhashWithRetries = async () => {
        while (true) {
          try {
            return (await connection.getRecentBlockhash()).blockhash;
          } catch (e) {
            console.error(e);
          }
        }
      };
      const transaction = new Transaction().add(instruction, closeIx);
      transaction.recentBlockhash = await getBlockhashWithRetries();
      transaction.feePayer = publicKey;
      await signTransaction(transaction);

      let tries = 0;
      let completed = false;
      while (!completed) {
        try {
          const signature = await connection.sendRawTransaction(
            transaction.serialize()
          );
          await connection.confirmTransaction(signature, "processed");
          setAlertState({
            message: "Successfully burned your NFT!",
            open: true,
            duration: 2000
          });
          dispatch({ type: "burned" });
          removeNFT(state.selectedNFT);
          handleNFTUnselect();
          completed = true;
        } catch (e) {
          console.error(e);
          await new Promise((resolve) => setTimeout(resolve, 500));
          tries += 1;
          if (tries >= 6) {
            dispatch({ type: "burned" });
            completed = true;
            setModalState({
              open: true,
              message: "Error trying to send transaction!",
            });
          }
        }
      }
    } catch (err) {
      setModalState({
        message: err.message,
        open: true,
      });
      dispatch({ type: "burned" });
    }
  }, [
    publicKey,
    state,
    removeNFT,
    handleNFTUnselect,
    connection,
    setAlertState,
    setModalState,
  ]);

  const confirmationModal = useMemo(() => {
    return state.isModalOpen && document.body
      ? createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full">
              <p className="text-2xl text-white text-center">
                Are you sure you want to permanently destroy this NFT?
              </p>

              <div className="flex items-center flex-col w-1/2 m-auto mt-8 justify-center">
                <NFTPreview nft={state.selectedNFT} />
              </div>

              <div className="flex items-center justify-center p-4 w-full mt-8">
                <button
                  type="button"
                  onClick={handleNFTUnselect}
                  className="btn mr-4"
                >
                  nope
                </button>
                <button
                  type="button"
                  onClick={handleBurn}
                  className={`btn btn-primary ${
                    state.isBurning ? "loading" : ""
                  }`}
                >
                  {state.isBurning ? "burning!!" : "yup"}
                </button>
              </div>
            </div>
          </div>,
          document.querySelector("body")
        )
      : null;
  }, [state, handleNFTUnselect, handleBurn]);

  const itemsPerPageSelectionDisplay = useMemo(() => {
    const options = [4, 10, 20, 50];

    return (
      <div className="w-full mt-8 flex items-center justify-center">
        <p className="mr-2">Items per page:</p>
        <div className="flex">
          {options.map((opt, index) => (
            <div key={opt}>
              <button
                type="button"
                onClick={() => handleItemsPerPageSelection(opt)}
                disabled={opt === itemsPerPage}
                className={opt === itemsPerPage ? "" : "underline"}
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
  }, [itemsPerPage, handleItemsPerPageSelection]);

  const paginationDisplay = useMemo(() => {
    return state.nfts.length > itemsPerPage ? (
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
          disabled={state.nfts.length < page * itemsPerPage}
        >
          Next
        </button>
      </div>
    ) : null;
  }, [state.nfts, itemsPerPage, page, handlePrevPage, handleNextPage]);

  useEffect(() => {
    if (publicKey && state.status === "idle") {
      handleNFTs();
    }
  }, [publicKey, state, handleNFTs]);

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
              {nftsToRender?.map((nft) => (
                <div className="w-full md:w-1/4 p-4" key={nft.mint}>
                  <div className="flex flex-col items-center rounded-md bg-gray-800 object-contain h-60 justify-between p-4">
                    <NFTPreview nft={nft} />
                    <button
                      type="button"
                      className="btn btn-primary mt-2 w-full"
                      onClick={() => handleNFTSelect(nft)}
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
  }, [
    state,
    itemsPerPageSelectionDisplay,
    paginationDisplay,
    nftsToRender,
    handleNFTSelect,
  ]);

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl text-white">Burn These NFTs</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tools facilitates the destruction of NFTs that the connected wallet
        owns. It also releases the rent (ca 0.002 SOL per NFT)
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
      {confirmationModal}
    </>
  );
}
