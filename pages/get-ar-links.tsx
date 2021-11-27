import { JWKInterface } from "arweave/node/lib/wallet";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FileUpload } from "../components/file-upload";
import { download } from "../util/download";
import jsonFormat from "json-format";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { makeArweaveBundleUploadGenerator } from "../util/upload-arweave-bundles/upload-generator";
import { Spinner } from "../components/spinner";
import { useForm } from "react-hook-form";
import { getArweave } from "../util/upload-arweave-bundles/reference";
import { FileContext } from "../providers/file-context-provider";
import { shortenAddress } from "../util/shorten-address";
import { AlertContext } from "../providers/alert-provider";

export const generateArweaveWallet = async () => {
  const arweave = getArweave();
  const key = await arweave.wallets.generate();
  localStorage.setItem("arweave-key", JSON.stringify(key));
  return key;
};

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

export const getKeyForJwk = (jwk) => {
  const arweave = getArweave();
  return arweave.wallets.jwkToAddress(jwk);
};

export default function GetARLinks() {
  const [jwk, setJwk] = useState<JWKInterface>();
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState("none");
  const { files } = useContext(FileContext);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const { setAlertState } = useContext(AlertContext);

  const generate = useCallback(async () => {
    const jwk = await generateArweaveWallet();
    localStorage.setItem("arweave-key", JSON.stringify(jwk));
    const _address = await getKeyForJwk(jwk);
    setAddress(_address);
  }, []);

  useEffect(() => {
    (async () => {
      const previousKey = localStorage.getItem("arweave-key");
      if (!address) {
        try {
          const parsed = JSON.parse(previousKey) || await generateArweaveWallet();
          localStorage.setItem("arweave-key", JSON.stringify(parsed));
          setJwk(parsed);
          const _address = await getKeyForJwk(previousKey);
          setAddress(_address);
        } catch (e) {
          console.log(e);
          generate();
        }
      }
    })();
  }, [address, generate]);

  const upload = useCallback(async () => {
    setLoading(true);
    const f = await Promise.all(files.map(fileToBuffer));

    // Arweave Native storage leverages Arweave Bundles.
    // It allows to encapsulate multiple independent data transactions
    // into a single top level transaction,
    // which pays the reward for all bundled data.
    // https://github.com/Bundlr-Network/arbundles
    // Each bundle consists of one or multiple files.
    // Initialize the Arweave Bundle Upload Generator.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
    const arweaveBundleUploadGenerator = makeArweaveBundleUploadGenerator(
      f,
      jwk
    );

    let bundleUploader = arweaveBundleUploadGenerator.next();
    let results = [];

    while (!bundleUploader.done) {
      const bundlingResult = await bundleUploader.value;
      if (bundlingResult) {
        results.push(
          ...bundlingResult.items.map((i) => ({ link: i.link, name: i.name }))
        );
      }
      bundleUploader = arweaveBundleUploadGenerator.next();
    }

    console.log(results);
    setLoading(false);
    download(`AR-upload-${Date.now()}.json`, jsonFormat(results));
  }, [files, jwk]);

  useEffect(() => {
    const arweave = getArweave();
    const interval = setInterval(async () => {
      if (address && arweave) {
        const balance = await arweave?.wallets.getBalance(address);
        setBalance(arweave?.ar.winstonToAr(balance));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [address, balance]);

  const importKey = useCallback(async (key) => {
    const arweave = getArweave();
    try {
      const parsed = JSON.parse(key);
      const addr = await arweave?.wallets.jwkToAddress(parsed);
      setJwk(parsed);
      setAddress(addr);
      localStorage.setItem("arweave-key", key);
      setAlertState({
        message: "Successfully imported key!",
        open: true,
        duration: 3000
      });
    } catch (e) {
      setAlertState({
        message: "Key could not be imported!",
        open: true,
        duration: 3000,
        severity: 'error'
      });
    }
  }, [setAlertState]);

  const clipboardNotification = useCallback(() => {
    setAlertState({
      message: 'Copied to clipboard!',
      duration: 2000,
      open: true
    })
  }, [setAlertState]);

  const onSubmit = handleSubmit(({ key }) => importKey(key));

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl">Arweave Upload</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <div>
        <p className="px-2 text-center">
          This tool lets you upload files to arweave. Currently limited to 150mb
          total per batch of files. <br />
          To reset the form please reload.
          <br />
          <strong>
            Caution: Beta Version! Often files will have a delay before showing
            up behind the URL.{" "}
          </strong>
          <strong>
            Make sure to check on them before using in production!
          </strong>
          <br />
          <hr className="my-3 opacity-10" />
          Send some AR to this wallet to start uploading. You can download and
          empty the wallet later.
          <br /> You can get AR on{" "}
          <a
            href="https://binance.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Binance
          </a>
        </p>
        <hr className="opacity-10 my-4" />
        <div
          className="card bg-primary text-white shadow-lg max-w-full mx-auto"
          style={{ width: 400 }}
        >
          <div className="card-body p-4">
            <div className="flex flex-row gap-5 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="arweave-logo.jpeg"
                className="rounded-full w-14 h-14 shadow-lg"
                width="56"
                height="56"
                alt="Arweave Logo"
              />
              <div>
                Address:
                <CopyToClipboard text={address} onCopy={clipboardNotification}>
                  <span className={` cursor-pointer ml-1`}>
                    {shortenAddress(address)}
                  </span>
                </CopyToClipboard>
                <p>
                  Balance:{" "}
                  {balance === "none" ? <Spinner /> : (+balance).toFixed(6)}
                </p>
              </div>

              <div className="ml-auto">
                <div className="btn-group">
                  <a
                    href={`https://viewblock.io/arweave/address/${address}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn btn-circle btn-sm shadow-lg">
                      <i className="fa fa-external-link-alt"></i>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="opacity-10 my-4" />

        <div className="card bg-gray-900 max-w-full">
          {jwk && (
            <div className="card-body">
              <div className="mt-4">
                <FileUpload />
              </div>

              {!!files.length && (
                <div className="text-center mt-4">
                  <button
                    className={`btn btn-primary rounded-box shadow-lg ${
                      loading ? "loading" : ""
                    }`}
                    disabled={!files.length}
                    onClick={upload}
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                  <br />
                </div>
              )}
            </div>
          )}
          {!jwk && (
            <div className="card">
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <h3 className="text-center">No Wallet found.</h3>
                  <hr className="opacity-10 my-4" />
                  <button
                    className={`btn btn-primary rounded-box inline-block mx-auto ${
                      loading ? "loading" : ""
                    }`}
                    onClick={() => generate()}
                  >
                    Generate Wallet
                  </button>
                  <div className="text-center">Or</div>
                  <br />
                  <div className="card">
                    <div className="card-body">
                      <h3 className="text-center">Import Wallet (JWK JSON)</h3>
                      <br />

                      <textarea
                        {...register("key")}
                        className="textarea shadow-lg w-full"
                        rows={10}
                      />
                      <div className="text-center">
                        <button
                          className={`btn btn-primary rounded-box shadow-lg`}
                          type="submit"
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
