import { useCallback, useContext, useEffect, useState } from "react";
import { usePagination } from "react-use-pagination";
import { FileContext } from "../providers/file-context-provider";
import { fileToBase64 } from "../util/file-to-base64";
import { Pagination } from "./pagination";

interface FileTileState {
  file: File;
  remove: (name: string) => void;
}

function FileTile({ file, remove }: FileTileState) {
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
        <div className="absolute inset-0 opacity-75 bg-black"></div>
        <div className="card-body p-3 z-10">
          <div className="card-title overflow-ellipsis overflow-hidden">
            {file.name}
          </div>
          <div className="ml-auto mt-auto">
            <span className="border px-2 inline rounded-box text-lg">
              {!!file.type.trim() && file.type.split("/")[1]}
            </span>
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

function PaginatedFiles({ addMore }) {
  const { files, setFiles } = useContext(FileContext);
  const { currentPage, totalPages, startIndex, endIndex, setPage, pageSize } =
    usePagination({ totalItems: files.length, initialPageSize: 15 });
  return (
    !!files.length && (
      <>
        <div className="prose max-w-full flex flex-row justify-between items-center mt-2 mb-6">
          <h2 className="m-0">File List ({files.length})</h2>

          <button
            onClick={() => setFiles({ files: [] })}
            className="btn btn-sm btn-outline btn-error "
          >
            <i className="fas fa-trash mr-2"></i>
            Clear all
          </button>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12 gap-3 my-3">
          <div className="relative col-span-3">
            <div className="card bg-base-100 h-36 bg-cover bg-center relative shadow-md">
              <div className="absolute inset-0 opacity-75 bg-black"></div>
              <div className="card-body p-3 z-10">
                <label className="file-upload w-full">
                  <i className="fas fa-cloud-upload-alt fa-3x"></i>
                  <span className="mt-2 text-base leading-normal">Add</span>
                  <input
                    type="file"
                    multiple
                    onChange={addMore}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          {files.slice(startIndex, endIndex + 1).map((f) => (
            <FileTile
              key={f.name}
              file={f}
              remove={(file) =>
                setFiles({ files: files.filter((ff) => ff.name !== file) })
              }
            />
          ))}
        </div>
        <Pagination
          total={totalPages}
          currentPage={currentPage}
          pageSize={pageSize}
          setPage={setPage}
        />
      </>
    )
  );
}

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
                // @ts-ignore4
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
