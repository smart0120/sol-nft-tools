# SOL NFT Tools

Free to use and distribute anywhere


[Live Version](https://sol-nft.tools/)
## Getting Started

This is a next.js app, so run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tools
### Gib Mints

Will accept a wallet ID and return all the mint IDs created by it. Similar to [tools.abstratica.art](tools.abstratica.art)

### Gib Meta

Will accept a list of mint IDs and fetch their token metadata and arweave metadata. Returns an array in format
```
 {
   tokenData: {
     // ... mint token data
   },
   metadata {
     // arweave metadata
   },
   mint: '<Mint ID>'
 }[]
```
### Gib Holders

Will accept a list of mint IDs and fetch their holders.

Returns an object in format
```
{ 
    [holderPubkey: string]: {
      mints: string[],
      amount: number
    } 
}
```
