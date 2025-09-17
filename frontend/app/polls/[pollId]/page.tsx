"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Vote, Users, Calendar, UserPlus } from "lucide-react";
import { getPollProgress, getPollStatus } from "@/utils/functions";
import { getCandidatesFromApiByPollId, getPoolsByIdFromApi } from "@/utils/api";
import { Candidate, ExtraInformationPool, Poll } from "@/utils/types";
import { useEffect, useState } from "react";
import { StatusChip } from "@/components/StatusChip";
import { GradientProgress } from "@/components/GradientProgress";
import { PollDetailClient } from "@/components/PollDetailCandidate";

export default function PollDetailPage({ params }: any) {
  const pollId = params.pollId;
  const [poll, setPoll] = useState<ExtraInformationPool | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const getPools = async () => {
    const { poll } = await getPoolsByIdFromApi(pollId as string);
    console.log("poll Info", poll);

    if (poll.success === true) {
      setPoll(poll.data);
    }
  };

  const getCandidates = async () => {
    const { candidates } = await getCandidatesFromApiByPollId(pollId);
    console.log("candidates Info", candidates);

    if (candidates.success === true) {
      setCandidates(candidates.data);
    }
  };

  useEffect(() => {
    getPools().then(() => {
      console.log(poll);
    });
    getCandidates().then(() => {
      console.log(candidates);
    });
  }, [pollId]);

  if (poll === null) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card p-12 text-center">
          <CardContent>
            <h1 className="text-2xl font-bold text-slate-300 mb-4">
              Poll Not Found
            </h1>
            <p className="text-slate-400 mb-6">
              The poll you're looking for doesn't exist.
            </p>
            <Link href="/polls">
              <Button className="accent-gradient text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Polls
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getPollStatus(poll);
  const progress = status === "live" ? getPollProgress(poll) : 0;

  //   Sort candidates by votes for display
  const sortedCandidates =
    poll.candidates.length > 0
      ? [...poll.candidates].sort((a, b) => b.votes - a.votes)
      : [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/polls">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        </Link>
      </div>

      {/* Poll Info */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <StatusChip status={status} />
            <Badge
              variant="outline"
              className="text-slate-400 border-slate-600"
            >
              Poll #{poll.pollId}
            </Badge>
          </div>
          <CardTitle className="text-2xl text-slate-100">{poll.name}</CardTitle>
          <CardDescription className="text-slate-300 text-base">
            {poll.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar for Live Polls */}
          {status === "live" && progress > 0 && (
            <GradientProgress value={progress} showLabel />
          )}

          {/* Poll Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-[rgb(var(--accent))]" />
              <div>
                <p className="font-semibold text-slate-100">
                  {poll.candidates
                    .reduce((acc, c) => acc + c.votes, 0)
                    .toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Total Votes</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Vote className="w-5 h-5 text-[rgb(var(--accent-2))]" />
              <div>
                <p className="font-semibold text-slate-100">
                  {poll.candidates.length}
                </p>
                <p className="text-sm text-slate-400">Candidates</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="font-semibold text-slate-100">
                  {status === "upcoming"
                    ? "Starts"
                    : status === "live"
                    ? "Ends"
                    : "Ended"}
                </p>
                <p className="text-sm text-slate-400">
                  {formatDate(
                    status === "upcoming"
                      ? new Date(poll.startTime)
                      : new Date(poll.endTime)
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Candidates</h2>
          <Link href={`/polls/${params.pollId}/newCandidate`}>
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-800/60 border-slate-700 hover:text-slate-300/70"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </Link>
        </div>

        <PollDetailClient
          poll={poll}
          status={status}
          sortedCandidates={sortedCandidates}
        />
      </div>

      {/* Empty State */}
      {poll.candidates.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <UserPlus className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <CardTitle className="text-slate-300 mb-2">
              No candidates yet
            </CardTitle>
            <CardDescription className="text-slate-400 mb-6">
              Be the first to add a candidate to this poll.
            </CardDescription>
            <Link href={`/polls/${params.pollId}/newCandidate`}>
              <Button className="accent-gradient text-slate-900">
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Candidate
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
