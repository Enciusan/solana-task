import { clusterApiUrl, Connection } from "@solana/web3.js";
import { programId } from "../frontend/utils/functions";
import { getTransactions } from "./functions";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

connection.onLogs(
  programId,
  (logInfo, ctx) => {
    getTransactions(programId, 500);
    console.log("Slot:", ctx.slot);
    console.log("Signature:", logInfo.signature);
    console.log("Logs:", logInfo.logs);
  },
  "confirmed"
);
