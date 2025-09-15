"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Vote,
  Plus,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  UserPlus,
} from "lucide-react";

const menuItems = [
  { icon: Vote, label: "All Polls", href: "/polls", shortcut: "G P" },
  { icon: Plus, label: "Create Poll", href: "/polls/new", shortcut: "G N" },
  { icon: BarChart3, label: "Live Results", href: "/results", shortcut: "G R" },
  { icon: Settings, label: "Settings", href: "/settings", shortcut: "G S" },
];

export function FloatingSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Load sidebar state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved) {
      setIsExpanded(JSON.parse(saved));
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("sidebar-expanded", JSON.stringify(newState));
  };

  // Check if we're in a poll detail page to show "Add Candidate" option
  const showAddCandidate =
    pathname.includes("/polls/") &&
    !pathname.includes("/new") &&
    !pathname.includes("/candidates/new");
  const pollId = showAddCandidate ? pathname.split("/polls/")[1] : null;

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-10 bottom-1/2 z-40 transition-all duration-300 ease-in-out",
          isExpanded ? "w-60  -translate-x-8" : "w-16 -translate-x-8"
        )}
      >
        <nav className="glass-card p-4 flex flex-col">
          {/* Header with Toggle */}
          <div
            className={cn(
              "flex items-center mb-6 transition-all duration-300",
              isExpanded ? "justify-between" : "justify-center"
            )}
          >
            {isExpanded && (
              <h2 className="text-lg font-semibold text-slate-100">SolVote</h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="w-8 h-8 p-0 hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors"
            >
              {isExpanded ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group relative",
                    isExpanded ? "space-x-3" : "justify-center",
                    isActive
                      ? "accent-gradient text-slate-400 bg-slate-800 shadow-lg accent-glow"
                      : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive
                        ? "text-slate-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    )}
                  />
                  {isExpanded && (
                    <>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </Link>
              );

              if (!isExpanded) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-slate-800 border-slate-700"
                    >
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{linkContent}</div>;
            })}

            {/* Contextual Add Candidate Link */}
            {showAddCandidate && (
              <div className="border-t border-slate-700/30 pt-2 mt-4">
                {(() => {
                  const isActive = pathname.includes("/candidates/new");
                  const linkContent = (
                    <Link
                      href={`/polls/${pollId}/candidates/new`}
                      className={cn(
                        "flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 group",
                        isExpanded ? "space-x-3" : "justify-center",
                        isActive
                          ? "accent-gradient text-slate-900 shadow-lg accent-glow"
                          : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <UserPlus
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive
                            ? "text-slate-900"
                            : "text-slate-400 group-hover:text-slate-200"
                        )}
                      />
                      {isExpanded && (
                        <span className="font-medium">Add Candidate</span>
                      )}
                    </Link>
                  );

                  if (!isExpanded) {
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="bg-slate-800 border-slate-700"
                        >
                          <p>Add Candidate</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return linkContent;
                })()}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
