// Change file extension to .mjs to use ES modules
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
// Fix the import path with a relative path that works with ESM
import { VotingIDL } from "../anchor/src/voting-exports.js";

// Your program ID from utils.json
const PROGRAM_ID = new PublicKey("md6p8cX3SukpjY6iQRWpshafa5TxZscFzZdviGwVXtJ");

// Connect to your local validator using WebSocket
const connection = new Connection("http://127.0.0.1:8900", "confirmed");

console.log("Connecting to Solana local validator...");
console.log(`Monitoring program: ${PROGRAM_ID.toBase58()}`);

// Subscribe to program account changes
async function monitorProgramAccounts() {
  console.log("Subscribing to program account changes...");

  const accountSubscriptionId = connection.onProgramAccountChange(
    PROGRAM_ID,
    (accountInfo, context) => {
      const { accountId, accountInfo: account } = accountInfo;
      console.log("Program account changed:");
      console.log(`Account: ${accountId.toBase58()}`);
      console.log(`Slot: ${context.slot}`);

      // First 8 bytes are the account discriminator
      const discriminator = account.data.slice(0, 8);
      console.log(
        `Discriminator: ${Buffer.from(discriminator).toString("hex")}`
      );

      // Log data size
      console.log(`Data size: ${account.data.length} bytes`);
    },
    "confirmed"
  );

  console.log(`Account subscription ID: ${accountSubscriptionId}`);
  return accountSubscriptionId;
}

// Subscribe to program transaction signatures
async function monitorProgramTransactions() {
  console.log("Subscribing to program transaction signatures...");

  // Get recent signatures for the program
  const signatures = await connection.getSignaturesForAddress(PROGRAM_ID);
  console.log(`Found ${signatures.length} recent signatures`);

  // Log the most recent signatures
  signatures.slice(0, 5).forEach((sig) => {
    console.log(`Recent signature: ${sig.signature}`);
  });

  // Subscribe to new signatures
  const signatureSubscriptionId = connection.onLogs(
    PROGRAM_ID,
    (logs, context) => {
      console.log("\n=== New Transaction ===");
      console.log(`Signature: ${logs.signature}`);
      console.log(`Slot: ${context.slot}`);

      // Log transaction details
      if (logs.err) {
        console.log("Transaction failed:", logs.err);
      } else {
        console.log("Transaction succeeded!");
      }

      // Print logs
      console.log("Logs:");
      logs.logs.forEach((log) => console.log(`  ${log}`));
    },
    "confirmed"
  );

  console.log(`Signature subscription ID: ${signatureSubscriptionId}`);
  return signatureSubscriptionId;
}

// Main function
async function main() {
  try {
    // Start both subscriptions
    const accountSubId = await monitorProgramAccounts();
    const sigSubId = await monitorProgramTransactions();

    console.log("\nMonitoring active! Press Ctrl+C to exit.");

    // Keep the process running
    process.on("SIGINT", () => {
      console.log("\nStopping subscriptions...");
      connection.removeProgramAccountChangeListener(accountSubId);
      connection.removeOnLogsListener(sigSubId);
      console.log("Subscriptions stopped. Exiting.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error setting up monitoring:", error);
  }
}

main();