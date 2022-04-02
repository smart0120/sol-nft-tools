import AuthContext from "../contexts/AuthContext";
import { useContext } from "react";

const useToken = () => useContext(AuthContext);

export default useToken;