import { useState, useEffect } from "react";
import { fileToBase64 } from "../util/file-to-base64";
import { sizeMB } from "../util/upload-arweave-bundles/upload-generator";

interface FileTileState {
  file: File;
  remove: (name: string) => void;
}

export default function FileTile({ file, remove }: FileTileState) {
  const [base64, setBase64] = useState("");
  useEffect(() => {
    (async () => {
      // TODO: Context for caching these
      setBase64(await fileToBase64(file));
    })();
  }, [file]);
  return (
    <div className="relative col-span-3 ">
      <div
        key={file.name}
        className="card bg-base-100 h-36 bg-cover bg-center relative"
        style={{
          backgroundImage: (file.type || "").startsWith("image")
            ? `url(${base64})`
            : null,
        }}
      >
        <div className="absolute inset-0 opacity-80 bg-black"></div>
        <div className="card-body p-3 z-10">
          <div className="card-title text-base overflow-ellipsis overflow-hidden">
            {file.name}
          </div>
          <div className="mt-auto flex flex-wrap gap-3 justify-between">
            <span
              className="bg-gray-900 text-white px-2 inline rounded-box text-xs overflow-ellipsis overflow-hidden shadow-md"
              style={{ maxWidth: "50%", letterSpacing: 1.25 }}
            >
              {sizeMB(file.size).toFixed(2)} MB
            </span>

            {!!file.type.trim() && (
              <span
                className="bg-gray-800 text-white px-2 inline rounded-box text-xs overflow-ellipsis overflow-hidden shadow-md"
                style={{ maxWidth: "50%", letterSpacing: 1.25 }}
              >
                {file.type.split("/")[1]}
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className="badge badge-primary absolute z-30 cursor-pointer shadow-md"
        style={{ right: -8, top: -8 }}
        onClick={() => remove(file.name)}
      >
        <i className="fa fa-times"></i>
      </div>
    </div>
  );
}
