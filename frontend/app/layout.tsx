import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { TopHeader } from "@/components/TopHeader";
import { Toaster } from "@/components/ui/sonner";
import { ContextProvider } from "@/contexts/ContextProvider";

import "@solana/wallet-adapter-react-ui/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolVote - Decentralized Voting on Solana",
  description:
    "Create and participate in transparent, decentralized voting on Solana",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ContextProvider>
          <TopHeader />
          <div className="min-h-screen pt-24">
            <FloatingSidebar />
            <main className="py-6 px-20">
              <div className="max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
          <Toaster />
        </ContextProvider>
      </body>
    </html>
  );
}
