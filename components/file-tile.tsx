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
    if (file.type.startsWith('image') || file.type.startsWith('video')) {
      const b64 = URL.createObjectURL(file)
      setBase64(b64);
      
      return () => URL.revokeObjectURL(b64);
    }
  }, [file]);
  return (
    <article className="relative">
      <div
        className="card bg-base-100 h-36 bg-cover bg-center relative"
        style={{
          backgroundImage: (file.type || "").startsWith("image")
            ? `url(${base64})`
            : null,
        }}
        tabIndex={0}
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
      <button
        className="badge badge-primary absolute z-30 cursor-pointer shadow-md"
        style={{ right: -8, top: -8 }}
        onClick={() => remove(file.name)}
        title="Delete Item"
      >
        <i className="fa fa-times"></i>
      </button>
    </article>
  );
}
