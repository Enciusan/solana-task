import { cn } from "@/lib/utils";

interface GradientProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function GradientProgress({
  value,
  className,
  showLabel = false,
}: GradientProgressProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Progress</span>
          <span className="text-[rgb(var(--accent))]">
            {Math.round(value)}%
          </span>
        </div>
      )}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full accent-gradient transition-all duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}
