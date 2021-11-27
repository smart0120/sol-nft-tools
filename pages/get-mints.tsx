import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { SOL_ADDRESS_REGEXP } from "../util/validators";
import { ModalContext } from "../providers/modal-provider";
import { useEndpoint } from "../hooks/use-endpoint";
import { AlertContext } from "../providers/alert-provider";
import { getMints } from "../util/get-mints";

export default function GibMints() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const { setModalState } = useContext(ModalContext);
  const { endpoint } = useEndpoint();
  const { setAlertState } = useContext(AlertContext);
  const fetchMints = async (val = "") => {
    setAlertState({
      message: "Downloading your data.",
      open: true
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
          open: false
        });
      });
  };

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl">Get Mint IDs</h1>
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
            <label className="label" htmlFor="address-field">
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
          </div>
        </form>
      </div>
    </>
  );
}
