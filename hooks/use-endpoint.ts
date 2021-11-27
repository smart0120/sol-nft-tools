import { useState } from "react";

export function useEndpoint(endpoininitialEndpoint = "https://pentacle.genesysgo.net") {
  const [endpoint, setEndpoint] = useState(endpoininitialEndpoint);
  return { endpoint, setEndpoint };
}
