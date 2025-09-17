"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Vote, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Candidate, Poll } from "@/utils/types";

interface PollDetailClientProps {
  status: "upcoming" | "live" | "ended";
  sortedCandidates: Candidate[];
}

export function PollDetailClient({
  status,
  sortedCandidates,
}: PollDetailClientProps) {
  const [userVote, setUserVote] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const canVote = status === "live" && !userVote;

  const handleVote = async (candidateId: string) => {
    if (!canVote) return;

    setIsVoting(true);

    // Simulate voting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUserVote(candidateId);
    toast.success("Vote submitted successfully!", {
      description: "Your vote has been recorded on the blockchain.",
    });

    setIsVoting(false);
  };

  const getVotePercentage = (candidate: Candidate) => {
    return 100;
  };

  return (
    <>
      {/* User Vote Status */}
      {userVote && (
        <div className="glass-card border-green-500/30 bg-green-500/5 p-4 rounded-2xl">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="font-medium text-green-400">Vote Submitted</p>
              {/* <p className="text-sm text-slate-400">
                You voted for:{" "}
                {sortedCandidates.find((c) => c.id === userVote)?.name}
              </p> */}
            </div>
          </div>
        </div>
      )}

      {/* Candidates with voting functionality */}
      <div className="space-y-4">
        {sortedCandidates.length > 0 &&
          sortedCandidates.map((candidate, index) => {
            const percentage = getVotePercentage(candidate);
            const hasUserVote = userVote === candidate.id;

            return (
              <div
                key={candidate.id}
                className={cn(
                  "glass-card transition-all duration-300 p-6 rounded-2xl",
                  hasUserVote && "border-green-500/30 bg-green-500/5",
                  canVote && "hover:bg-slate-800/40 cursor-pointer"
                )}
                onClick={() => canVote && handleVote(candidate.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold border",
                        index === 0 &&
                          "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
                        index === 1 &&
                          "text-slate-300 bg-slate-500/20 border-slate-500/30",
                        index === 2 &&
                          "text-amber-600 bg-amber-600/20 border-amber-600/30",
                        index > 2 &&
                          "text-slate-400 bg-slate-700/50 border-slate-600"
                      )}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 flex items-center space-x-2">
                        <span>{candidate.name}</span>
                        {hasUserVote && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {candidate.votes.toLocaleString()} votes •{" "}
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {status === "ended" && index === 0 && (
                      <div className="accent-gradient text-slate-900 font-medium px-3 py-1 rounded-full text-sm">
                        Winner
                      </div>
                    )}

                    {canVote && (
                      <Button
                        size="sm"
                        className="accent-gradient text-slate-900"
                        disabled={isVoting}
                      >
                        {isVoting ? (
                          <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Vote className="w-4 h-4 mr-1" />
                            Vote
                          </>
                        )}
                      </Button>
                    )}

                    {status === "upcoming" && (
                      <Button
                        size="sm"
                        disabled
                        className="bg-slate-800 text-slate-400"
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        Upcoming
                      </Button>
                    )}
                  </div>
                </div>

                {/* Vote Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000 ease-out",
                      hasUserVote
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : "accent-gradient"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}
