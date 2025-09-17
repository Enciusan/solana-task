import * as anchor from "@coral-xyz/anchor";
import type { ConfirmedSignatureInfo, PublicKey } from "@solana/web3.js";
import { VotingIDL } from "../anchor/src/voting-exports";
import { connection } from "../frontend/utils/functions";
import { addCandidateToDb, addPollToDb, addVoteToDb, checkIfCandidateExists, checkIfPollExists } from "./db/functions";

export const getTransactions = async (address: PublicKey, slot: number, numTx: number) => {
  let transactionList: ConfirmedSignatureInfo[] = await connection.getSignaturesForAddress(address, {
    limit: numTx,
  });

  let signatureList = transactionList.map((transaction) => transaction.signature);

  let txList = await connection.getParsedTransactions(signatureList, {
    maxSupportedTransactionVersion: 0,
  });

  for (const tx of txList) {
    if (!tx) continue;
    const coder = new anchor.BorshCoder(VotingIDL as anchor.Idl);
    if (tx.meta?.err === null) {
      const ix = coder.instruction.decode(tx.transaction.message.instructions[2]?.data, "base58");
      if (!ix) {
        console.log("Failed to decode instruction");
        continue;
      }
      console.log("Instruction name:", `"${ix.name}"`, "Type:", typeof ix.name);
      switch (ix?.name) {
        case "initialize_poll":
          console.log("Processing initialize_poll");
          const { poll, error } = await checkIfPollExists(anchor.BN(ix?.data._poll_id).toNumber());
          console.log("poll line 29 in func", poll);
          if (error) {
            await addPollToDb(ix?.data);
            console.error("Error checking if poll exists:", error);
          } else {
            console.error("Poll exists:", poll);
          }
          break;

        case "initialize_candidate":
          const { candidate, error: candidateError } = await checkIfCandidateExists(
            ix?.data.candidate,
            anchor.BN(ix?.data._poll_id).toNumber()
          );
          console.log("candidate line 46 in func", candidate);
          if (candidateError) {
            await addCandidateToDb(ix?.data);
            console.error("Error checking if candidate exists:", candidateError);
          } else {
            console.error("Candidate exists:", candidate);
          }
          break;

        case "vote":
          if (tx.transaction.message.accountKeys[0]?.signer === true) {
            await addVoteToDb(ix.data, slot, tx.transaction.message.accountKeys[0]?.pubkey.toBase58());
          } else {
            console.error("Vote instruction missing signer");
          }
          break;

        default:
          console.log("Default -- instruction:", `"${ix.name}"`);
      }
      console.log(ix);
    }
  }
};
