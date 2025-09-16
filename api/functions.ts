import * as anchor from "@coral-xyz/anchor";
import type { ConfirmedSignatureInfo, PublicKey } from "@solana/web3.js";
import { VotingIDL } from "../anchor/src/voting-exports";
import { connection } from "../frontend/utils/functions";
import { addPollToDb } from "./db/functions";

export const getTransactions = async (address: PublicKey, numTx: number) => {
  let transactionList: ConfirmedSignatureInfo[] = await connection.getSignaturesForAddress(address, {
    limit: numTx,
  });

  let signatureList = transactionList.map((transaction) => transaction.signature);

  let txList = await connection.getParsedTransactions(signatureList, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(signatureList, txList);

  let pools: any[] = [];
  let candidates: any[] = [];
  let votes: any[] = [];
  for (const tx of txList) {
    // if (!tx) return;
    if (!tx) return;
    const coder = new anchor.BorshCoder(VotingIDL as anchor.Idl);
    const ix = coder.instruction.decode(tx.transaction.message.instructions[2]?.data, "base58");
    switch (ix?.name) {
      case "initialize_poll":
        await addPollToDb(ix?.data);
        pools.push(ix?.data);
        break;
      case "initialize_candidate":
        candidates.push(ix);
        break;
      case "vote":
        votes.push(ix);
        break;
    }
    console.log(ix);
  }
};
