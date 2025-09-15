import { PollCard } from "@/components/PollCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { mockPolls } from "@/lib/mock-data";
import { Clock, Plus, TrendingUp, Vote } from "lucide-react";
import Link from "next/link";

export default function PollsPage() {
  const totalVotes = mockPolls.reduce((sum, poll) => sum + poll.totalVotes, 0);

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
                  {mockPolls.length}
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
                    mockPolls.filter(
                      (poll) =>
                        poll.startTime < new Date() && poll.endTime > new Date()
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
                    mockPolls.filter((poll) => poll.startTime > new Date())
                      .length
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
                <p className="text-2xl font-bold text-slate-100">
                  {totalVotes.toLocaleString()}
                </p>
                <p className="text-sm text-slate-400">Total Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {mockPolls.length === 0 && (
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
