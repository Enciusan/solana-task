import { Connection } from "@solana/web3.js";
import { Voting, VotingIDL } from "../../anchor/src/voting-exports";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Poll } from "@/lib/mock-data";
import type { WalletAdapterProps } from "@solana/wallet-adapter-base";
import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";

export const connection = new Connection("http://127.0.0.1:8899", "finalized");

const idl = VotingIDL as anchor.Idl;

export const programId = new PublicKey(VotingIDL.address);

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
    [Buffer.from("poll"), new anchor.BN(poll.id).toArrayLike(Buffer, "le", 8)],
    programId
  )[0];
  console.log(
    pollAccountPDA.toBase58(),
    new anchor.BN(poll.id),
    poll.name as string,
    poll.description as string,
    poll.startTime as anchor.BN,
    poll.endTime as anchor.BN
  );

  const initialisePollTx = await program.methods
    .initializePoll(
      new anchor.BN(poll.id),
      new anchor.BN(poll.startTime),
      new anchor.BN(poll.endTime),
      poll.name as string,
      poll.description as string
    )
    .accounts({
      signer: publicKey,
      poll_account: pollAccountPDA,
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
