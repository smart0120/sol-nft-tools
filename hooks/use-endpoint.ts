import { useState } from "react";

export function useEndpoint(endpoininitialEndpoint = "https://alice.genesysgo.net") {
  const [endpoint, setEndpoint] = useState(endpoininitialEndpoint);
  return { endpoint, setEndpoint };
}
