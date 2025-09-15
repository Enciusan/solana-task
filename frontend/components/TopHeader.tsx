"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function TopHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-card border-b border-white/[0.08]">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold accent-gradient bg-clip-text text-transparent">
            SolVote
          </h1>
          <Badge
            variant="secondary"
            className="bg-slate-800/60 text-slate-300 border-slate-700"
          >
            Devnet
          </Badge>
        </div>

        <WalletMultiButtonDynamic />
      </div>
    </header>
  );
}
