import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: "upcoming" | "live" | "ended";
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const config = {
    upcoming: {
      label: "Upcoming",
      className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    live: {
      label: "Live",
      className: "accent-gradient text-slate-900 font-medium shadow-lg",
    },
    ended: {
      label: "Ended",
      className: "bg-slate-700/50 text-slate-400 border-slate-600",
    },
  };

  return (
    <Badge className={cn(config[status].className, className)}>
      {config[status].label}
    </Badge>
  );
}
