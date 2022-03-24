import React, { useCallback, useContext, useEffect, useState } from "react";
import jsonFormat from "json-format";
import { download } from "../util/download";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AlertContext } from "../providers/alert-provider";
import IdField from "../components/id-field";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function GibAirdrop() {
  const [loading, setLoading] = useState(false);
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState<number | "none">("none");
  const { setAlertState } = useContext(AlertContext);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const wallet = useWallet();

  const mint = useCallback(
    async ({ amount, ids = "" }: { amount: string; ids: string }) => {
      let addresses;
      const getVal = () => {
        try {
          return JSON.parse(ids);
        } catch {
          if (ids.includes(",")) {
            return ids
              .split(",")
              .map((t) => t.trim())
              .filter((a) => a);
          }
          if (/\n/.exec(ids)?.length) {
            return ids
              .split("\n")
              .map((t) => t.trim())
              .filter((a) => a);
          }
          if (/\r/.exec(ids)?.length) {
            return ids
              .split("\r")
              .map((t) => t.trim())
              .filter((a) => a);
          }
          return [ids];
        }
      };
      addresses = getVal();

      const amt = parseFloat(amount);

      if (isNaN(amt)) {
        alert("Invalid amount!");
        return;
      }

      if (
        !confirm(`This send a total of ${amt * addresses.length} SOL to ${
          addresses.length
        } addresses. 
      Proceed?`)
      ) {
        return;
      }

      setLoading(true);

      if (!isSnackbarOpen) {
        setAlertState({
          message: "snedsnedsned...",
          open: true,
        });
        setIsSnackbarOpen(true);
      }

      const transferSol = async ({
        amount,
        destination,
      }: {
        amount: number;
        destination: string;
      }) => {
        const { blockhash } = await connection.getRecentBlockhash();
        const tx = new Transaction({
          recentBlockhash: blockhash,
          feePayer: wallet?.publicKey,
        }).add(
          SystemProgram.transfer({
            lamports: amount * LAMPORTS_PER_SOL,
            toPubkey: new PublicKey(destination),
            fromPubkey: wallet?.publicKey,
          })
        );
        return tx;
      };

      const txs = (
        await Promise.allSettled(
          (addresses as string[]).map((a) =>
            transferSol({ amount: amt, destination: a })
          )
        )
      ).map((f) => f.status === "fulfilled" && f.value);
      await wallet.signAllTransactions(txs);
      const sigs = await Promise.all(
        txs.map((tx) =>
          connection.sendRawTransaction(tx.serialize()).catch((e) => {
            console.log(e);
            return "failed";
          })
        )
      );
      download(`Airdrop-${Date.now()}.json`, jsonFormat(sigs));
    },
    [connection, isSnackbarOpen, wallet]
  );

  const clipboardNotification = () =>
    setAlertState({ message: "Copied to clipboard!", duration: 2000 });

  useEffect(() => {
    const itv = setInterval(async () => {
      if (wallet?.publicKey) {
        setSolBalance(await connection.getBalance(wallet?.publicKey).catch());
      }
    }, 1000);
    return () => clearInterval(itv);
  }, [connection, wallet?.publicKey]);
  return (
    <>
       <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl text-white">Snedmaster 9000</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tools sends out a certain amount of Solana to different addresses.
        <br />
        <strong>Warning</strong>: always check the json for errors!
      </p>
      <hr className="opacity-10 my-4" />

      <div className={`grid gap-4 grid-cols-1`}>
        {wallet && (
          <div className="card bg-primary">
            <div className="card-body p-4">
              <div className="flex flex-row gap-5 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/solana-logo.jpeg"
                  className="rounded-full w-14 h-14"
                  width="56"
                  height="56"
                  alt=""
                />
                {wallet?.connected ? <div>
                  Address:
                  <CopyToClipboard
                    text={wallet?.publicKey?.toBase58()}
                    onCopy={clipboardNotification}
                  >
                    <span className={`cursor-pointer ml-1`}>
                      {wallet?.publicKey?.toBase58()}
                    </span>
                  </CopyToClipboard>
                  <p>
                    Balance:{" "}
                    {solBalance === "none" ? (
                      <span style={{ marginLeft: "1rem" }}>
                        <button className="btn btn-ghost loading btn-disabled"></button>
                      </span>
                    ) : (
                      solBalance / LAMPORTS_PER_SOL
                    )}
                  </p>
                </div> : <WalletMultiButton/>}

                <div className="ml-auto">
                  <div className="btn-group">
                    <a
                      className="btn btn-circle btn-sm"
                      rel="noreferrer"
                      target="_blank"
                      href={`https://solanabeach.io/address/${wallet?.publicKey}`}
                    >
                      <i className="fas fa-external-link-square-alt" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="my-4 opacity-10" />
      <IdField sned={(e) => mint(e)} loading={loading} />
    </>
  );
}
