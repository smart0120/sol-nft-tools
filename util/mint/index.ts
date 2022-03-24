import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    MintLayout,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    createMintToInstruction,
  } from "@solana/spl-token";
  import {
    Data,
    CreateMetadataArgs,
    CreateMasterEditionArgs,
    METADATA_SCHEMA as SERIALIZE_SCHEMA,
  } from "./schema";
  import { serialize } from "borsh";
  import {
    createMetadataInstruction,
    createMasterEditionInstruction,
  } from "./utils";
  import BN from "bn.js";
  import { AnchorWallet } from "@solana/wallet-adapter-react";
  
  const METAPLEX_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  
  export async function mintNFT(
    connection: Connection,
    wallet: AnchorWallet,
    data: Data,
    user: PublicKey,
  ): Promise<string> {
    const { publicKey } = wallet;
    try {
      const mint = new Keypair();
  
      // Allocate memory for the account
      const mintRent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );
  
      // Create mint account
      const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mint.publicKey,
        lamports: mintRent,
        space: MintLayout.span,
        programId: TOKEN_PROGRAM_ID,
      });
  
      // Initalize mint ix
      // Creator keypair is mint and freeze authority
      const initMintIx = createInitializeMintInstruction(
        mint.publicKey,
        0,
        publicKey,
        null
      );
  
      // Derive associated token account for user
      const assoc = await getAssociatedTokenAddress(
        mint.publicKey,
        user
      ).catch();
  
      // Create associated account for user
      const createAssocTokenAccountIx =
        createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint.publicKey,
          assoc,
          user,
          publicKey
        );
  
      // Create mintTo ix; mint to user's associated account
      const mintToIx = createMintToInstruction(
        mint.publicKey,
        assoc,
        publicKey, // Mint authority
        1,
        [], // No multi-sign signers
      );
  
      // Derive metadata account
      const metadataSeeds = [
        Buffer.from("metadata"),
        METAPLEX_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
      ];
      const [metadataAccount, _pda] = await PublicKey.findProgramAddress(
        metadataSeeds,
        METAPLEX_PROGRAM_ID
      ).catch();
  
      // Derive Master Edition account
      const masterEditionSeeds = [
        Buffer.from("metadata"),
        METAPLEX_PROGRAM_ID.toBuffer(),
        mint.publicKey.toBuffer(),
        Buffer.from("edition"),
      ];
      const [masterEditionAccount, _] = await PublicKey.findProgramAddress(
        masterEditionSeeds,
        METAPLEX_PROGRAM_ID
      ).catch();
  
      let buffer = Buffer.from(
        serialize(
          SERIALIZE_SCHEMA,
          new CreateMetadataArgs({ data, isMutable: true })
        )
      );
  
      // Create metadata account ix
      const createMetadataIx = createMetadataInstruction(
        metadataAccount,
        mint.publicKey,
        publicKey,
        publicKey,
        publicKey,
        buffer
      );
  
      buffer = Buffer.from(
        serialize(
          SERIALIZE_SCHEMA,
          new CreateMasterEditionArgs({ maxSupply: new BN(0) })
        )
      );
  
      const createMasterEditionIx = createMasterEditionInstruction(
        metadataAccount,
        masterEditionAccount,
        mint.publicKey,
        publicKey,
        publicKey,
        publicKey,
        buffer
      );
  
      let tx = new Transaction()
        .add(createMintAccountIx)
        .add(initMintIx)
        .add(createAssocTokenAccountIx)
        .add(mintToIx)
        .add(createMetadataIx)
        .add(createMasterEditionIx);
  
      const recent = await connection.getRecentBlockhash();
      tx.recentBlockhash = recent.blockhash;
      tx.feePayer = publicKey;
      tx.sign(mint)
  
      await wallet.signTransaction(tx);
      const txId =  await connection.sendRawTransaction(tx.serialize());
  
      return txId;
    } catch (e) {
      console.log(e)
  
      return "failed";
    }
  }