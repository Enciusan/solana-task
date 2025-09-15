import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, TrendingUp } from "lucide-react";
import { Poll, getPollStatus, getPollProgress } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface PollCardProps {
  poll: Poll;
}

export function PollCard({ poll }: PollCardProps) {
  const status = getPollStatus(poll);
  const progress = status === "live" ? getPollProgress(poll) : 0;

  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    live: {
      label: "Live",
      className: "accent-gradient text-slate-900 font-medium",
    },
    ended: {
      label: "Ended",
      className: "bg-slate-700/50 text-slate-400 border-slate-600",
    },
  };

  return (
    <Link href={`/polls/${poll.id}`}>
      <Card
        className={cn(
          "glass-card hover:bg-slate-800/40 transition-all duration-300 cursor-pointer group",
          "hover:shadow-2xl hover:scale-[1.02]"
        )}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={statusConfig[status].className}>
              {statusConfig[status].label}
            </Badge>
            <span className="text-sm text-slate-400">#{poll.id}</span>
          </div>
          <CardTitle className="group-hover:text-[rgb(var(--accent))] transition-colors">
            {poll.title}
          </CardTitle>
          <CardDescription className="text-slate-400 line-clamp-2">
            {poll.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === "live" && progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-[rgb(var(--accent))]">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full accent-gradient transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{poll.totalVotes.toLocaleString()} votes</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{poll.candidates.length} options</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>
                {status === "upcoming"
                  ? "Starts "
                  : status === "live"
                  ? "Ends "
                  : "Ended "}
                {(status === "upcoming"
                  ? poll.startTime
                  : poll.endTime
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
