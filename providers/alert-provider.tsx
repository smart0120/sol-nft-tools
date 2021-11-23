import { useState } from "react";
import { createContext } from "vm";

const initialState: AlertState = {
  open: false,
  message: "",
  severity: undefined,
};

const AlertContext = createContext(initialState);

export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });
  return (
    <AlertContext.Provider value={{ alertState, setAlertState }}>
      {children}
    </AlertContext.Provider>
  );
}

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}
