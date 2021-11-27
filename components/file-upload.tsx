import React, { useCallback, useContext, useEffect, useState } from "react";
import { FileContext } from "../providers/file-context-provider";
import PaginatedFiles from "./paginated-files";

export function FileUpload() {
  const [_files, _setFiles] = useState([]);
  const { setFiles, ...fileContext } = useContext(FileContext);

  useEffect(() => {
    _setFiles(fileContext?.files);
  }, [fileContext?.files]);

  const addFiles = useCallback(
    async (e) => {
      const f = [...fileContext.files, ...e.target.files];
      setFiles({ files: f });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFiles]
  );
  const listContents = useCallback(
    async (e) => {
      const f = [...e.target.files];
      setFiles({ files: f });
    },
    [setFiles]
  );

  return (
    <>
      {!_files.length && (
        <>
          <div className="prose max-w-full">
            <h2 className="text-center mb-6">Upload</h2>
          </div>
          <div className="flex gap-3 items-center justify-center">
            <label className="file-upload w-64">
              <i className="fas fa-cloud-upload-alt fa-3x"></i>
              <span className="mt-2 text-base leading-normal">
                Select files
              </span>
              <input
                type="file"
                multiple
                onChange={listContents}
                className="hidden"
              />
            </label>
            <span>OR</span>

            <label className="file-upload w-64">
              <i className="fas fa-cloud-upload-alt fa-3x"></i>
              <span className="mt-2 text-base leading-normal">
                Select a folder *
              </span>
              <input
                type="file"
                // @ts-ignore
                webkitdirectory="true"
                multiple
                onChange={listContents}
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
      <PaginatedFiles addMore={addFiles} />
    </>
  );
}
