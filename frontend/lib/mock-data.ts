import { ExtraInformationPool, Poll } from "@/utils/types";

export interface Candidate {
  id: string;
  name: string;
  votes: number;
  pollId: string;
}

export interface Vote {
  id: string;
  pollId: string;
  candidateId: string;
  voterAddress: string;
  timestamp: Date;
}

// Mock data
export const mockPolls: ExtraInformationPool[] = [
  {
    pollId: 1,
    name: "Best DeFi Protocol 2024",
    description:
      "Vote for the most innovative DeFi protocol that has made significant impact in 2024.",
    startTime: Math.floor(new Date("2024-01-15T10:00:00Z").getTime() / 1000),
    endTime: Math.floor(new Date("2024-12-31T23:59:59Z").getTime() / 1000),
    candidates: [
      { id: "1", name: "A", votes: 0, pollId: "1" },
      { id: "2", name: "B", votes: 0, pollId: "1" },
    ],
  },
  {
    pollId: 2,
    name: "Solana Hackathon Winner",
    description:
      "Choose the most promising project from the recent Solana Hackathon submissions.",
    startTime: Math.floor(new Date("2024-02-01T00:00:00Z").getTime() / 1000),
    endTime: Math.floor(new Date("2024-02-28T23:59:59Z").getTime() / 1000),
    candidates: [
      { id: "1", name: "A", votes: 0, pollId: "2" },
      { id: "2", name: "B", votes: 0, pollId: "2" },
    ],
  },
  {
    pollId: 3,
    name: "Community Treasury Allocation",
    description:
      "Decide how to allocate 100,000 SOL from the community treasury for ecosystem development.",
    startTime: Math.floor(new Date("2024-03-01T12:00:00Z").getTime() / 1000),
    endTime: Math.floor(new Date("2024-03-15T12:00:00Z").getTime() / 1000),
    candidates: [
      { id: "1", name: "A", votes: 0, pollId: "3" },
      { id: "2", name: "B", votes: 0, pollId: "3" },
    ],
  },
];

export const mockVotes: Vote[] = [
  {
    id: "1",
    pollId: "1",
    candidateId: "1",
    voterAddress: "GxU7...h3K9",
    timestamp: new Date("2024-01-16T14:30:00Z"),
  },
  // Add more mock votes as needed
];

export function getPollById(id: string): Poll | undefined {
  return mockPolls.find((poll) => poll.pollId === Number(id));
}

export function getCandidatesByPollId(pollId: number): any {
  // return mockPolls.find((poll) => poll.pollId === pollId)?.candidates || [];
}

export function getAllCandidates(): any {
  return mockPolls.flatMap((poll) => poll.candidates);
}

export function getPollStatus(poll: Poll): "upcoming" | "live" | "ended" {
  const now = Math.floor(Date.now() / 1000);
  if (now < poll.startTime) return "upcoming";
  if (now > poll.endTime) return "ended";
  return "live";
}

export function getPollProgress(poll: Poll): number {
  const now = Math.floor(Date.now() / 1000);
  const start = poll.startTime;
  const end = poll.endTime;
  const current = now;

  if (current < start) return 0;
  if (current > end) return 100;

  return ((current - start) / (end - start)) * 100;
}
