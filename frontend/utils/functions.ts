import { Poll } from "@/lib/mock-data";
import * as anchor from "@coral-xyz/anchor";
import type { WalletAdapterProps } from "@solana/wallet-adapter-base";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { ConfirmedSignatureInfo, Connection, PublicKey } from "@solana/web3.js";
import { VotingIDL } from "../../anchor/src/voting-exports";

export const connection = new Connection(
  "https://solana-devnet.g.alchemy.com/v2/MdPc-hO1dyYp0aVnWeqhGpdzjvG4abr0",
  "confirmed"
);

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
    const ix = coder.instruction.decode(
      tx.transaction.message.instructions[2].data,
      "base58"
    );
    console.log(
      anchor.BN(ix?.data?.start_time).toNumber(),
      anchor.BN(ix?.data?.end_time).toNumber(),
      anchor.BN(ix?.data?._poll_id).toNumber(),
      ix?.data
    );
  }
};
