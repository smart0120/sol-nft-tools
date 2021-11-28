import React, { useContext } from "react";
import { FileContext } from "../providers/file-context-provider";
import PaginatedFiles from "./paginated-files";

export function FileUpload() {
  const { setFiles, ...fileContext } = useContext(FileContext);

  const handleAddFiles = async (e) => {
    const f = [...fileContext.files, ...(e.target as HTMLInputElement).files];
    setFiles({ files: f });
  };
  const handleSelectFiles = async (e) => {
    const f = [...(e.target as HTMLInputElement).files];
    setFiles({ files: f });
  };

  return (
    <>
      {!fileContext?.files?.length && (
        <>
          <div className="prose max-w-full">
            <h2 className="text-center mb-6">Upload</h2>
          </div>
          <div className="flex gap-3 items-center justify-center">
            <label className="file-upload w-64" tabIndex={0}>
              <i className="fas fa-cloud-upload-alt fa-3x"></i>
              <span className="mt-2 text-base leading-normal">
                Select files
              </span>
              <input
                type="file"
                multiple
                onChange={handleSelectFiles}
                className="hidden"
              />
            </label>
            <span>OR</span>

            <label className="file-upload w-64" tabIndex={0}>
              <i className="fas fa-cloud-upload-alt fa-3x"></i>
              <span className="mt-2 text-base leading-normal">
                Select a folder *
              </span>
              <input
                type="file"
                // @ts-ignore
                webkitdirectory="true"
                multiple
                onChange={handleSelectFiles}
                className="hidden"
              />
            </label>
          </div>

          <br />
          <div className="flex mt-4">
            <span className="label-text ml-auto">
              * may not work with every browser
            </span>
          </div>
        </>
      )}
      <PaginatedFiles addMore={handleAddFiles} />
    </>
  );
}
