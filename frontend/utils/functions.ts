import * as anchor from "@coral-xyz/anchor";
import type { WalletAdapterProps } from "@solana/wallet-adapter-base";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmedSignatureInfo, Connection, PublicKey } from "@solana/web3.js";
import { VotingIDL } from "../../anchor/src/voting-exports";
import { Candidate, Poll } from "./types";

export const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/MdPc-hO1dyYp0aVnWeqhGpdzjvG4abr0",
  "confirmed"
);

const idl = VotingIDL as anchor.Idl;

export const programId = new PublicKey(VotingIDL.address);

// CONTRACT METHODS
export const createPoll = async (
  poll: Partial<Poll>,
  publicKey: PublicKey,
  wallet: AnchorWallet,
  sendTransaction: WalletAdapterProps["sendTransaction"]
) => {
  console.log(programId.toBase58());
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "finalized",
  });
  const program = new anchor.Program(idl, provider);
  const pollAccountPDA = PublicKey.findProgramAddressSync(
    [
      Buffer.from("poll"),
      new anchor.BN(poll.pollId).toArrayLike(Buffer, "le", 8),
    ],
    programId
  )[0];
  console.log(
    pollAccountPDA.toBase58(),
    poll.pollId,
    poll.name as string,
    poll.description as string,
    poll.startTime as anchor.BN,
    poll.endTime as anchor.BN
  );

  const initialisePollTx = await program.methods
    .initializePoll(
      new anchor.BN(poll.pollId),
      new anchor.BN(poll.startTime),
      new anchor.BN(poll.endTime),
      poll.name as string,
      poll.description as string
    )
    .transaction();
  try {
    const signature = await sendTransaction(initialisePollTx, connection, {
      skipPreflight: true,
    });

    console.log(signature);
  } catch (error: any) {
    console.error(error);
  }
};

export const createCandidate = async (
  pollId: number,
  candidate: Partial<Candidate>,
  publicKey: PublicKey,
  wallet: AnchorWallet,
  sendTransaction: WalletAdapterProps["sendTransaction"]
) => {
  console.log(programId.toBase58());
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "finalized",
  });
  const program = new anchor.Program(idl, provider);
  const pollAccountPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), new anchor.BN(pollId).toArrayLike(Buffer, "le", 8)],
    programId
  )[0];
  const candidateAccountPDA = PublicKey.findProgramAddressSync(
    [
      new anchor.BN(pollId).toArrayLike(Buffer, "le", 8),
      candidate.name as string,
    ],
    programId
  )[0];
  console.log(
    pollAccountPDA.toBase58(),
    candidateAccountPDA.toBase58(),
    candidate.name as string
  );

  const initialisePollTx = await program.methods
    .initializeCandidate(new anchor.BN(pollId), candidate.name as string)
    .accounts({
      signer: publicKey,
      pollAccount: pollAccountPDA,
    })
    .transaction();
  try {
    const signature = await sendTransaction(initialisePollTx, connection, {
      skipPreflight: true,
    });

    console.log(signature);
  } catch (error: any) {
    console.error(error);
  }
};

export const vote = async (
  pollId: number,
  candidateInfo: Candidate,
  publicKey: PublicKey,
  wallet: AnchorWallet,
  sendTransaction: WalletAdapterProps["sendTransaction"]
) => {
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "finalized",
  });
  const program = new anchor.Program(idl, provider);
  const pollAccountPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), new anchor.BN(pollId).toArrayLike(Buffer, "le", 8)],
    programId
  )[0];
  const candidateAccountPDA = PublicKey.findProgramAddressSync(
    [new anchor.BN(pollId).toArrayLike(Buffer, "le", 8), candidateInfo.name],
    programId
  )[0];
  console.log(
    pollAccountPDA.toBase58(),
    candidateAccountPDA.toBase58(),
    candidateInfo.name,
    pollId,
    candidateInfo
  );

  const initialiseVoteTx = await program.methods
    .vote(new anchor.BN(pollId), candidateInfo.name)
    .accounts({
      signer: publicKey,
      poll_account: pollAccountPDA,
      candidate_account: candidateAccountPDA,
    })
    .transaction();
  try {
    const signature = await sendTransaction(initialiseVoteTx, connection, {
      skipPreflight: true,
    });

    console.log(signature);
  } catch (error: any) {
    console.error(error);
  }
};

// HELPER FUNCTIONS
export const getTransactions = async (address: PublicKey, numTx: number) => {
  let transactionList: ConfirmedSignatureInfo[] =
    await connection.getSignaturesForAddress(address, {
      limit: numTx,
    });

  let signatureList = transactionList.map(
    (transaction) => transaction.signature
  );

  let txList = await connection.getParsedTransactions(signatureList, {
    maxSupportedTransactionVersion: 0,
  });
  console.log(signatureList, txList);

  for (const tx of txList) {
    // if (!tx) return;
    if (!tx) return;
    const coder = new anchor.BorshCoder(idl);
    if (tx.meta?.err === null) {
      console.log(tx.transaction.message.accountKeys[0].pubkey.toBase58());
      const ix = coder.instruction.decode(
        tx.transaction.message.instructions[2].data,
        "base58"
      );
      console.log(
        // anchor.BN(ix?.data?.start_time).toNumber(),
        // anchor.BN(ix?.data?.end_time).toNumber(),
        // anchor.BN(ix?.data._poll_id).toNumber(),
        ix
      );
    }
  }
};

export function getPollStatus(poll: Poll): "upcoming" | "live" | "ended" {
  const now = Math.floor(Date.now() / 1000);
  // console.log(now, new Date(poll.startTime).getTime() / 1000, poll.endTime);

  if (now < new Date(poll.startTime).getTime() / 1000) return "upcoming";
  if (now > new Date(poll.endTime).getTime() / 1000) return "ended";
  return "live";
}

export function getPollProgress(poll: Poll): number {
  const now = Math.floor(Date.now() / 1000);
  const start = poll.startTime;
  const end = poll.endTime;
  const current = now;

  if (current < start) return 0;
  if (current > end) return 100;

  return ((current - start) / (end - start)) * 100;
}
