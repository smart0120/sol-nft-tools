import { createContext, useState } from "react";
interface FileContextState {
  files: File[];
  setFiles: ({ files }: { files: File[] }) => void;
}

const initialState: FileContextState = {
  files: [],
  setFiles: () => {}
};

export const FileContext = createContext(initialState);

FileContext.displayName = "FileContext";

export const FileContextProvider = ({ children }) => {
  const [fileContext, setFileContext] =
    useState<FileContextState>(initialState);

  return (
    <FileContext.Provider
      value={{
        ...fileContext,
        setFiles: ({ files }) =>
          setFileContext({
            ...fileContext,
            files: files,
          }),
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
