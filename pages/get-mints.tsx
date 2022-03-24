import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { SOL_ADDRESS_REGEXP } from "../util/validators";
import { ModalContext } from "../providers/modal-provider";
import { useEndpoint } from "../hooks/use-endpoint";
import { AlertContext } from "../providers/alert-provider";
import { getMints } from "../util/get-mints";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function GibMints() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { setModalState } = useContext(ModalContext);
  const { endpoint } = useEndpoint();
  const { setAlertState } = useContext(AlertContext);
  const { connected, publicKey } = useWallet();
  const fetchMints = async (val = "") => {
    setAlertState({
      message:  <button className="btn btn-disabled btn-ghost loading">Downloading your data.</button>,
      open: true,
    });
    setLoading(true);
    getMints(val, endpoint)
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        setModalState({
          message: e,
          open: true,
        });
        setLoading(false);
      })
      .finally(() => {
        setAlertState({
          message: "",
          open: false,
        });
        setLoading(false);
      });
  };

  const pubkeyString = publicKey?.toBase58();

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl text-white">Get Mint IDs</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tool gets all mint IDs associated with the given address.
      </p>
      <hr className="opacity-10 my-4" />
      <div className="card bg-gray-900">
        <form
          onSubmit={handleSubmit(({ address }) => fetchMints(address))}
          className={`w-full flex flex-col`}
        >
          <div className="card-body">
            <label className="label justify-center" htmlFor="address-field">
              Please gib SOL address to get all mints
            </label>
            <input
              {...register("address", {
                required: "This field is required!",
                pattern: {
                  value: SOL_ADDRESS_REGEXP,
                  message: "Invalid address",
                },
              })}
              required
              type="text"
              className={`input shadow-lg w-full ${
                !!errors?.address?.message && "input-error"
              }`}
              id="address-field"
              autoComplete="on"
            />
            {!!errors?.address?.message && (
              <label className="label text-error">
                {errors?.address?.message}
              </label>
            )}
            <div className="text-center mt-6">
              <button
                className={`btn btn-primary rounded-box shadow-lg ${
                  loading ? "loading" : ""
                }`}
                disabled={errors?.address}
                type="submit"
              >
                {loading ? "Getting Mints.." : "Get Mints!"}
              </button>
            </div>
            <hr className="opacity-10 my-4" />
            <div className="flex items-center justify-center">
              {connected ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setValue("address", pubkeyString);
                    fetchMints(pubkeyString);
                  }}
                  className="btn btn-primary"
                >
                  {" "}
                  Use Wallet <br />
                  {pubkeyString.slice(0, 3)}...
                  {pubkeyString.slice(
                    pubkeyString.length - 3,
                    pubkeyString.length
                  )}
                </button>
              ) : (
                <WalletMultiButton />
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
