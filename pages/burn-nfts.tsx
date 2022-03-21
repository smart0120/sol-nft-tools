import React, {
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
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

  const initState: {
    nfts: any[];
    status: string;
  } = {
    nfts: [],
    status: "idle",
  };
  const [state, dispatch] = useReducer(
    (
      state: typeof initState,
      action:
        | { type: "started"; payload?: null }
        | { type: "error"; payload?: null }
        | { type: "success"; payload: { nfts: any[] } }
    ) => {
      switch (action.type) {
        case "started":
          return { ...state, status: "pending" };
        case "error":
          return { ...state, status: "rejected" };
        case "success":
          return { ...state, status: "resolved", nfts: action.payload.nfts };
        default:
          throw new Error("unsupported action type given on BurnNFTs reducer");
      }
    },
    initState
  );

  const handleNFTs = useCallback(async () => {
    if (!publicKey || state.status === "resolved") {
      return;
    }

    try {
      const publicAddress = await resolveToWalletAddress({
        text: publicKey.toBase58(),
      });
      const nfts = await getParsedNftAccountsByOwner({ publicAddress });
      const promises = nfts.map(({ data }) => axios(data.uri));
      const nftsWithImagesData = await Promise.all(promises);

      const nftsWithImages = nfts.map((nft) => {
        const match = nftsWithImagesData.find(
          ({ data }) => data.name === nft.data.name
        );

        if (match) {
          return { ...nft, image: match.data.image };
        } else return nft;
      });
      dispatch({ type: "success", payload: { nfts: nftsWithImages } });
    } catch (err) {
      dispatch({ type: "error" });
    }
  }, [publicKey, dispatch, state]);

  useEffect(() => {
    if (publicKey) {
      handleNFTs();
    }
  }, [publicKey, handleNFTs]);

  const nftDisplay = useMemo(() => {
    if (["idle", "pending"].includes(state.status)) {
      return <p className="text-center text-lg text-white">fetching NFTs...</p>;
    }

    return state.status === "error" ? (
      <p className="text-center text-lg text-white"></p>
    ) : (
      <div>
        {state.nfts.length === 0 ? (
          <p className="text-center text-lg text-white">You have no NFTs :(</p>
        ) : (
          <div className="flex items-center flex-wrap">
            {state.nfts.map((nft) => (
              <div
                key={nft.mint}
                className="w-full flex flex-col items-center justify-center md:w-1/4 p-4 card"
              >
                <img
                  src={nft.image}
                  alt=""
                  className="rounded-md object-contain w-full h-40 bg-black border m-4"
                />
                <strong>{nft.data.name}</strong>
                <button type="button" className="btn mt-2 w-full">burn</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [state]);

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
          <WalletDisconnectButton
            style={{
              fontSize: "0.75rem",
              height: "2rem",
            }}
          />
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
