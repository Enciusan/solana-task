"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Candidate } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
  candidate: Candidate;
  rank: number;
  totalVotes: number;
  animate?: boolean;
}

export function LeaderboardRow({
  candidate,
  rank,
  totalVotes,
  animate = true,
}: LeaderboardRowProps) {
  const [animatedVotes, setAnimatedVotes] = useState(
    animate ? 0 : candidate.votes
  );
  const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;

  useEffect(() => {
    if (!animate) return;

    const timer = setTimeout(() => {
      setAnimatedVotes(candidate.votes);
    }, rank * 100); // Stagger animations

    return () => clearTimeout(timer);
  }, [candidate.votes, rank, animate]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case 2:
        return "text-slate-300 bg-slate-500/20 border-slate-500/30";
      case 3:
        return "text-amber-600 bg-amber-600/20 border-amber-600/30";
      default:
        return "text-slate-400 bg-slate-700/50 border-slate-600";
    }
  };

  return (
    <Card className="glass-card p-4 hover:bg-slate-800/40 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <Badge
          variant="outline"
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold",
            getRankColor(rank)
          )}
        >
          {rank}
        </Badge>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">{candidate.name}</h3>
            <div className="flex items-center space-x-3">
              <span className="text-slate-400 text-sm">
                {animatedVotes.toLocaleString()} votes
              </span>
              <Badge
                variant="outline"
                className="accent-gradient text-slate-900 font-medium"
              >
                {percentage.toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full accent-gradient transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  transitionDelay: `${rank * 100}ms`,
                }}
              />
            </div>
            <TrendingUp className="w-4 h-4 text-[rgb(var(--accent))]" />
          </div>
        </div>
      </div>
    </Card>
  );
}
