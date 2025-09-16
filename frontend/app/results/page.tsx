"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPolls, getAllCandidates } from "@/lib/mock-data";
import { TrendingUp, Trophy, Zap, RefreshCw } from "lucide-react";
import { LeaderboardRow } from "@/components/LeaderboardRow";

export default function ResultsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Get all candidates and sort by votes
  const allCandidates = getAllCandidates().sort((a, b) => b.votes - a.votes);
  const totalVotes = allCandidates.reduce(
    (sum, candidate) => sum + candidate.votes,
    0
  );
  const livePolls = mockPolls.filter(
    (poll) => poll.endTime < new Date().getTime()
  );

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In a real app, this would refetch data
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);

    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLastUpdated(new Date());
    setRefreshing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2 flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-[rgb(var(--accent))]" />
            <span>Live Results</span>
          </h1>
          <p className="text-slate-400">
            Real-time voting results across all active polls
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="accent-gradient text-slate-900"
        >
          {refreshing ? (
            <div className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {livePolls.length}
                </p>
                <p className="text-slate-400">Active Polls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {allCandidates.length}
                </p>
                <p className="text-slate-400">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-[rgb(var(--accent-2))]" />
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {totalVotes.toLocaleString()}
                </p>
                <p className="text-slate-400">Total Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">
          Global Leaderboard
        </h2>
        <Badge variant="outline" className="text-slate-400 border-slate-600">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Badge>
      </div>

      {/* Leaderboard */}
      {allCandidates.length > 0 ? (
        <div className="space-y-4">
          {allCandidates.map((candidate, index) => (
            <LeaderboardRow
              key={candidate.id}
              candidate={candidate}
              rank={index + 1}
              totalVotes={totalVotes}
              animate={true}
            />
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <CardTitle className="text-slate-300 mb-2">
              No voting data yet
            </CardTitle>
            <CardDescription className="text-slate-400">
              Results will appear here once polls start receiving votes.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Live Polls Summary */}
      {livePolls.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[rgb(var(--accent))]" />
            <span>Active Polls</span>
            <Badge className="accent-gradient text-slate-900 font-medium">
              {livePolls.length}
            </Badge>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {livePolls.map((poll) => (
              <Card
                key={poll.id}
                className="glass-card hover:bg-slate-800/40 transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{poll.name}</CardTitle>
                    <Badge className="accent-gradient text-slate-900 font-medium text-xs">
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>{poll.totalVotes} votes</span>
                    <span>{poll.candidates.length} candidates</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
