// DISCLAIMER:
// THIS FILE IS ABSOLUTE CHAOS AND I KNOW IT!

import React, { useCallback, useContext, useState } from "react";
import { AttributesForm } from "../components/attributes-form";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

// import { mintNFT } from "../util/mint";

import { Controller, useForm } from "react-hook-form";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import FileTile from "../components/file-tile";
import { Creator, Data } from "../util/mint/schema";
import { URL_MATCHER } from "../util/url-matcher";
import { ArweaveWallet } from "./arweave-wallet";
import { BundlrContext } from "../providers/bundlr-provider";
import { mintNFT } from "../util/mint";

const fileToBuffer = (
  file: File
): Promise<{ buffer: ArrayBuffer; file: File }> => {
  return new Promise((resolve) => {
    var reader = new FileReader();

    reader.onload = function (readerEvt) {
      var buffer = readerEvt.target.result;

      resolve({
        buffer: buffer as ArrayBuffer,
        file,
      });
    };

    reader.readAsArrayBuffer(file);
  });
};

export default function GibAirdrop({ endpoint }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [mint, setMint] = useState("");
  const { bundler, fund, balance: bundlrBalance } = useContext(BundlrContext);
  const { connection } = useConnection();
  const handleRemoveFile = (name: string) => {
    setFiles(files.filter((f) => f.name !== name));
  };

  const FilesForm = () => (
    <>
      <label className="label" htmlFor="files">
        <span className="label-text">Files (up to 4)*</span>
      </label>
      <div className="btn-group">
        {numberOfFiles < 4 && (
          <button
            className="btn btn-primary"
            onClick={() => setNumberOfFiles(numberOfFiles + 1)}
          >
            Add file
          </button>
        )}
        {numberOfFiles > 1 && (
          <button
            className="btn btn-error"
            onClick={() => {
              setNumberOfFiles(numberOfFiles - 1);
              setFiles(files.slice(0, numberOfFiles - 1));
            }}
          >
            Remove file
          </button>
        )}
      </div>
      <div className="upload-field grid grid-cols-2 gap-4 my-4">
        {Array.from({ length: numberOfFiles })
          .fill("")
          .map((num, i) => (
            <FileTile
              key={i}
              file={files[i]}
              remove={handleRemoveFile}
              setFiles={setFiles}
              files={files}
            />
          ))}
      </div>

      {!!files?.length && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label" htmlFor="imageUrlFileName">
              Image URL
            </label>
            <select {...register("imageUrlFileName")} className="select w-full">
              <option selected disabled value=""></option>
              {files.map((f) => (
                <option value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="animationUrlFileName">
              Animation URL
            </label>
            <select
              {...register("animationUrlFileName")}
              className="select w-full"
            >
              <option selected disabled value=""></option>
              {files.map((f) => (
                <option value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <br />
    </>
  );

  const upload = useCallback(
    async (formData) => {
      setLoading(true);
      const m = Object.assign({
        name: formData.name,
        symbol: formData.symbol || null,
        description: formData.description || null,
        seller_fee_basis_points: +formData.seller_fee_basis_points || 0,
        image: formData.image || null,
        animation_url: formData.animation_url || null,
        attributes: formData.attributes || null,
        external_url: formData.external_url || null,
        properties: {
          category: formData?.properties?.category || "image",
          creators: new Creator({
            address: wallet?.publicKey.toBase58(),
            share: 100,
            verified: 1,
          }),
        },
      });

      const priceApprox = await files.reduce(async (acc, curr) => {
        const bytes = (await fileToBuffer(curr)).buffer.byteLength;
        const price = await bundler?.utils.getPrice("solana", bytes);
        const nr = price.toNumber();
        return (await acc) + nr;
      }, Promise.resolve(0));

      debugger;
      if (priceApprox * 1.1 > +bundlrBalance) {
        await fund(priceApprox / LAMPORTS_PER_SOL);
      }

      const mapping = [];
      for (const file of files) {
        bundler.uploader.contentType = "";
        const buff = (await fileToBuffer(file)).buffer;
        const res = (
          await bundler.uploader.upload(Buffer.from(buff), [
            { name: "Content-Type", value: file.type },
          ])
        ).data;
        mapping.push({
          file: file,
          link: `https://arweave.net/${res.id}`,
        });
      }
      m.properties.files = mapping.map(({ link, file }) => ({
        uri: link + `?ext=${file.type.split("/")[1]}`,
        type: file.type,
      }));

      let selectedAnimation = mapping.find(
        (_m) => _m.file.name === formData.animationUrlFileName
      );

      m.animation_url = selectedAnimation
        ? `${selectedAnimation.link}?ext=${
            selectedAnimation.file.type.split("/")[1]
          }`
        : mapping.find((_m) => _m.file.type.startsWith("video"))?.link || "";

      let selectedImage = mapping.find(
        (_m) => _m.file.name === formData?.imageUrlFileName
      );
      m.image = selectedImage
        ? `${selectedImage.link}?ext=${selectedImage.file.type.split("/")[1]}`
        : m.properties.files[0].uri || "";

      const metaTx = (
        await bundler.uploader.upload(Buffer.from(JSON.stringify(m)), [
          { name: "Content-Type", value: "application/json" },
        ])
      ).data;

      const creators = [
        new Creator({
          address: wallet.publicKey.toBase58(),
          share: 100,
          verified: 1,
        }),
      ];

      const data = new Data({
        symbol: m.symbol || "",
        name: m.name || "",
        uri: `https://arweave.net/${metaTx.id}`,
        sellerFeeBasisPoints: !Number.isNaN(+m.seller_fee_basis_points)
          ? +m.seller_fee_basis_points
          : 0,
        creators,
      });

      const mintTxId = await mintNFT(connection, wallet, data);
      if (mintTxId === "failed") {
        alert(mintTxId);
        setLoading(false);
      } else {
        let confirmed;
        while (!confirmed) {
          const tx = await connection
            .getTransaction(mintTxId, { commitment: "confirmed" })
            .catch((e) => {
              alert(e);
            });

          if (tx && tx?.meta?.postTokenBalances[0]?.mint) {
            debugger;
            setMint(tx?.meta?.postTokenBalances[0]?.mint);
            confirmed = true;
          } else {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      }
      setLoading(false);
    },
    [wallet?.publicKey, files, bundler?.address]
  );

  return wallet?.publicKey ? (
    <div>
      <ArweaveWallet />
      <br />

      <hr className="opacity-10 my-3" />

      <div className="card bg-gray-900">
        <div className="card-body">
          {!wallet && <WalletMultiButton />}
          {wallet && (
            <form
              className={`w-full flex flex-col`}
              onSubmit={handleSubmit((e) => upload(e))}
            >
              <h2 className="text-3xl font-bold text-center">
                1. Create Metadata
              </h2>
              <div className="text-center">
                The metadata standard is defined{" "}
                <a
                  href="https://docs.phantom.app/integrating/tokens/non-fungible-tokens"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  here by Phantom
                </a>
              </div>
              <br />
              <div
                className="form-control pb-6"
                style={{ position: "relative" }}
              >
                <label className="label">
                  <span className="label-text">Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className={`input input-bordered ${
                    !!errors.name ? "input-error" : ""
                  }`}
                  {...register("name", { required: true, maxLength: 32 })}
                />
                {errors.name && (
                  <label
                    className="label py-0"
                    style={{ position: "absolute", bottom: 0 }}
                  >
                    <span className="label-text-alt text-red-400">
                      {errors.name.type === "maxLength" && "Max 32 characters!"}
                      {errors.name.type === "required" && "Field is required!"}
                    </span>
                  </label>
                )}
              </div>
              <div
                className="form-control pb-6"
                style={{ position: "relative" }}
              >
                <label className="label" htmlFor="symbol">
                  <span className="label-text">Symbol</span>
                </label>
                <input
                  type="text"
                  placeholder="Symbol"
                  className={`input input-bordered ${
                    !!errors.symbol ? "input-error" : ""
                  }`}
                  {...register("symbol", { maxLength: 10 })}
                />
                {errors.symbol && (
                  <label
                    className="label py-0"
                    style={{ position: "absolute", bottom: 0 }}
                  >
                    <span className="label-text-alt text-red-400">
                      Max 10 characters!
                    </span>
                  </label>
                )}
              </div>
              <div
                className="form-control pb-6"
                style={{ position: "relative" }}
              >
                <label className="label" htmlFor="description">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea h-24"
                  placeholder="Description"
                  {...register("description")}
                ></textarea>
              </div>{" "}
              <div
                className="form-control pb-6"
                style={{ position: "relative" }}
              >
                <label className="label">
                  <span className="label-text">
                    External URL (Link to your website, e.g.
                    https://rugbirdz.com)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="External URL"
                  {...register("external_url", { pattern: URL_MATCHER })}
                  className={`input input-bordered ${
                    !!errors.external_url ? "input-error" : ""
                  }`}
                />

                {errors.external_url && (
                  <label
                    className="label py-0"
                    style={{ position: "absolute", bottom: 0 }}
                  >
                    <span className="label-text-alt text-red-400">
                      Not a valid url, don&apos;t forget protocol (https://)
                    </span>
                  </label>
                )}
              </div>
              <div
                className="form-control pb-6"
                style={{ position: "relative" }}
              >
                <label htmlFor="category" className="label">
                  <span className="label-text">Category</span>
                </label>
                <Controller
                  name="properties.category"
                  control={control}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <select
                      onBlur={onBlur}
                      onChange={onChange}
                      className="select"
                      value={value}
                      ref={ref}
                      name="category"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="html">HTML</option>
                    </select>
                  )}
                />
              </div>
              <div
                className="form-control pb-6"
                style={{ position: "relative" }}
              >
                <label className="label" htmlFor="seller_fee_basis_points">
                  <span className="label-text">
                    Resale Fee (0-10 000, e.g. for 5% use 500)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  placeholder="e.g. 500"
                  {...register("seller_fee_basis_points", {
                    min: 0,
                    max: 10_000,
                  })}
                  className={`input input-bordered ${
                    !!errors.seller_fee_basis_points ? "input-error" : ""
                  }`}
                />

                {errors.seller_fee_basis_points && (
                  <label
                    className="label py-0"
                    style={{ position: "absolute", bottom: 0 }}
                  >
                    <span className="label-text-alt text-red-400">
                      Must be between 0 and 10 000
                    </span>
                  </label>
                )}
              </div>
              <AttributesForm register={register} />
              <FilesForm />
              {wallet && (
                <button
                  className={`btn ${loading ? "loading" : ""}`}
                  disabled={loading}
                  type="submit"
                >
                  Next
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      <input
        type="checkbox"
        id="my-modal-2"
        checked={!!mint}
        className="modal-toggle"
      />

      <div id="my-modal" className="modal">
        <div className="modal-box">
          <p>
            NFT has been minted.{" "}
            <a
              className="link"
              target="_blank"
              rel="noreferrer"
              href={`https://solscan.io/token/${mint}`}
            >
              View on SolScan
            </a>
          </p>
          <div className="modal-action">
            <a
              onClick={() => {
                setMint(undefined);
              }}
              className="btn"
            >
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="card bg-gray-700 max-w-xs mx-auto">
        <div className="card-body">
          <h2 className="text-center">To begin please</h2>
          <br />
          <WalletMultiButton />
        </div>
      </div>
    </>
  );
}
