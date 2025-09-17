"use client";
import { PollCard } from "@/components/PollCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getPoolsFromApi } from "@/utils/api";
import { getTransactions, programId } from "@/utils/functions";
import { Poll } from "@/utils/types";
import { Clock, Plus, TrendingUp, Vote } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PollsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshStatus = searchParams.get("refresh");
  const getTxs = async () => await getTransactions(programId, 1000);
  const [polls, setPolls] = useState<Poll[]>([]);

  const getPools = async () => {
    const { polls } = await getPoolsFromApi();
    if (polls.success === true) {
      const formatedPools = polls.data.polls.map((poll: any) => ({
        pollId: poll.poll_id,
        name: poll.poll_name,
        description: poll.poll_name,
        startTime: poll.poll_voting_start,
        endTime: poll.pol_voting_end,
      }));
      setPolls(formatedPools);
    }
  };

  useEffect(() => {
    getTxs();
    getPools();
  }, []);

  useEffect(() => {
    if (refreshStatus) {
      console.log("Refetching polls...", refreshStatus);

      router.replace("/polls");
      getPools();
    }
  }, [searchParams]);

  console.log(polls);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">All Polls</h1>
          <p className="text-slate-400">
            Participate in decentralized governance and community decisions
          </p>
        </div>
        <Link href="/polls/new">
          <Button className="accent-gradient text-slate-900 hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Vote className="w-5 h-5 text-[rgb(var(--accent))]" />
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {polls.length}
                </p>
                <p className="text-sm text-slate-400">Total Polls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {
                    polls.filter(
                      (poll) =>
                        new Date(poll.startTime).getTime() <
                          new Date().getTime() &&
                        new Date(poll.endTime).getTime() > new Date().getTime()
                    ).length
                  }
                </p>
                <p className="text-sm text-slate-400">Active Polls</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {
                    polls.filter(
                      (poll) =>
                        new Date(poll.startTime).getTime() >
                        new Date().getTime()
                    ).length
                  }
                </p>
                <p className="text-sm text-slate-400">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Vote className="w-5 h-5 text-[rgb(var(--accent-2))]" />
              <div>
                <p className="text-2xl font-bold text-slate-100">{100}</p>
                <p className="text-sm text-slate-400">Total Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {polls.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Live Polls</h2>
            <Badge
              variant="outline"
              className="accent-gradient text-slate-900 font-extrabold"
            >
              {
                polls.filter(
                  (pool) =>
                    new Date(pool.startTime).getTime() / 1000 <
                      Math.floor(Date.now() / 1000) &&
                    new Date(pool.endTime).getTime() / 1000 >
                      Math.floor(Date.now() / 1000)
                ).length
              }
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {polls.filter(
              (pool) =>
                new Date(pool.startTime).getTime() / 1000 <
                  Math.floor(Date.now() / 1000) &&
                new Date(pool.endTime).getTime() / 1000 >
                  Math.floor(Date.now() / 1000)
            ).length > 0 ? (
              polls
                .filter(
                  (pool) =>
                    new Date(pool.startTime).getTime() / 1000 <
                      Math.floor(Date.now() / 1000) &&
                    new Date(pool.endTime).getTime() / 1000 >
                      Math.floor(Date.now() / 1000)
                )
                .map((poll) => <PollCard key={poll.pollId} poll={poll} />)
            ) : (
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <p className="text-slate-400">No live polls available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Polls */}
      {polls.filter(
        (pool) => new Date(pool.startTime).getTime() > new Date().getTime()
      ).length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-xl font-semibold text-slate-100">
              Upcoming Polls
            </h2>
            <Badge
              variant="outline"
              className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
            >
              {
                polls.filter(
                  (pool) =>
                    new Date(pool.startTime).getTime() > new Date().getTime()
                ).length
              }
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {polls
              .filter(
                (pool) =>
                  new Date(pool.startTime).getTime() > new Date().getTime()
              )
              .map((poll) => (
                <PollCard key={poll.pollId} poll={poll} />
              ))}
          </div>
        </section>
      )}

      {/* Ended Polls */}
      {polls.filter(
        (pool) => new Date(pool.endTime).getTime() < new Date().getTime()
      ).length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <h2 className="text-xl font-semibold text-slate-100">
              Recently Ended
            </h2>
            <Badge
              variant="outline"
              className="bg-slate-700/50 text-slate-400 border-slate-600"
            >
              {
                polls.filter(
                  (pool) =>
                    new Date(pool.endTime).getTime() < new Date().getTime()
                ).length
              }
            </Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {polls
              .filter(
                (pool) =>
                  new Date(pool.endTime).getTime() < new Date().getTime()
              )
              .map((poll) => (
                <PollCard key={poll.pollId} poll={poll} />
              ))}
          </div>
        </section>
      )}

      {polls.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Vote className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <CardTitle className="text-slate-300 mb-2">No polls yet</CardTitle>
            <CardDescription className="text-slate-400 mb-6">
              Be the first to create a poll and start the conversation.
            </CardDescription>
            <Link href="/polls/new">
              <Button className="accent-gradient text-slate-900">
                <Plus className="w-4 h-4 mr-2" />
                Create First Poll
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// HERE IT CAN BE DONE BETTER BY BREAKING IN SEPARATE COMPONENTS PollsPageFallback AND PollsContent AND LET
// JUST THE PAGE WITH SUSPENSE AND PollsContent

function PollsPageFallback() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">All Polls</h1>
          <p className="text-slate-400">
            Participate in decentralized governance and community decisions
          </p>
        </div>
        <Link href="/polls/new">
          <Button className="accent-gradient text-slate-900 hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-slate-600 rounded animate-pulse" />
                <div>
                  <div className="w-8 h-6 bg-slate-600 rounded animate-pulse mb-1" />
                  <div className="w-16 h-4 bg-slate-600 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="glass-card">
        <CardContent className="p-12 text-center">
          <div className="w-12 h-12 bg-slate-600 rounded mx-auto mb-4 animate-pulse" />
          <div className="w-32 h-6 bg-slate-600 rounded mx-auto mb-2 animate-pulse" />
          <div className="w-48 h-4 bg-slate-600 rounded mx-auto animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PollsPage() {
  return (
    <Suspense fallback={<PollsPageFallback />}>
      <PollsContent />
    </Suspense>
  );
}
