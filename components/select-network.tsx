import { useRef } from "react";
import { ENDPOINTS } from "../util/endpoints";

export function SelectNetwork({selectedKey, endpoint, setEndpoint}) {
  const selectRef = useRef<HTMLSelectElement>();

  return (
    selectedKey !== "ar-links" && (
      <div className="form-control justify-center">
        <select
          ref={selectRef}
          id="rpc"
          className="select ml-8"
          defaultValue={endpoint}
          style={{ minWidth: 200, minHeight: '2rem', height: '2rem' }}
          onChange={(e) => setEndpoint(e.target.value)}
        >
          {ENDPOINTS.map((ep) => (
            <option key={ep.name} value={ep.endpoint}>
              {ep.name} ({ep.endpoint})
            </option>
          ))}
        </select>
      </div>
    )
  );
}
