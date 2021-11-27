import { PublicKey } from "@solana/web3.js";
import { deserializeUnchecked } from "borsh";
import jsonFormat from "json-format";
import * as anchor from "@project-serum/anchor";
import { download } from "./download";
import { METADATA_PROGRAM_ID } from "./accounts";
import { toPublicKey } from "./to-publickey";
import { Metadata, METADATA_SCHEMA } from "./metadata-schema";

export const getMints = async (creatorId: string, url: string) => {
  const connection = new anchor.web3.Connection(url);
  const a = await connection.getProgramAccounts(
    toPublicKey(METADATA_PROGRAM_ID),
    {
      encoding: "base64",
      filters: [
        {
          memcmp: {
            offset: 326,
            bytes: creatorId,
          },
        },
      ],
    }
  );
  const deserialized = a.map((b) =>
    deserializeUnchecked(METADATA_SCHEMA, Metadata, b.account.data)
  );
  download(
    "mints-creatorId-" + Date.now() + ".json",
    jsonFormat(
      deserialized.map((g) => new PublicKey(g.mint).toBase58()),
      {
        type: "space",
        size: 2,
      }
    )
  );
};
