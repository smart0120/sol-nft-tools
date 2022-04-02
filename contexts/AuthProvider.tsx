import React, { useState } from "react";
import Cookies from "universal-cookie";
import AuthContext from "./AuthContext";

const cookies = new Cookies();

const AuthProvider = (props: any) => {
  const [token, setToken] = useState<string>();
  return (
    <AuthContext.Provider
      value={{
        getToken: async () => {
          const req = await fetch("/api/get-token");
          const { access_token }: { access_token: string } = await req.json();
          cookies.set("gengo_auth", access_token);
          setToken(access_token);
        },
        validateToken: async () => {
          const tokenResponse = await fetch("/api/validate-token");
          if (!tokenResponse.ok) {
            setToken("");
            throw new Error("Invalid Token");
          }
          const token: string = cookies.get("gengo_auth");
          setToken(token);
        },
        token: token,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
