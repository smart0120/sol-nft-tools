import {from } from 'rxjs';
import {mergeMap, toArray, map, tap } from 'rxjs/operators';
let holders = {};
const getTokenHolder = (url, key, setCounter) => {
  return fetch(url, {
    body: `{
        "jsonrpc":"2.0", 
        "id":1, 
        "method":"getProgramAccounts", 
        "params":[
          "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          {
            "encoding": "jsonParsed",
            "filters": [
              {
                "dataSize": 165
              },
              {
                "memcmp": {
                  "offset": 0,
                  "bytes": "${key}"
                }
              }
            ]
          }
        ]}
    `,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((res) => res.json())
    .then(async (res) => {
      res.result.forEach((r, i) => {
        setCounter(i + 1);
        if (r.account.data.parsed.info.tokenAmount.uiAmount > 0) {
          if (!holders[r.account.data.parsed.info.owner]) {
            holders[r.account.data.parsed.info.owner] = {
              amount: 1,
              mints: [key],
            };
          } else {
            holders[r.account.data.parsed.info.owner].amount += 1;
            holders[r.account.data.parsed.info.owner].mints.push(key);
          }
        }
      });
    });
};

export const getHolders = (mintIds: string[], setCounter, url) => {
  return from(mintIds).pipe(
    mergeMap(id => getTokenHolder(url, id, setCounter), 10),
    toArray(),
    map(() => ({...holders})), 
    tap(() => holders = {})
  )
};
