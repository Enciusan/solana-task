export interface Poll {
  id: number;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  candidates: Candidate[];
  totalVotes: number;
  createdBy: string;
}

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
export const mockPolls: Poll[] = [
  {
    id: 1,
    name: "Best DeFi Protocol 2024",
    description:
      "Vote for the most innovative DeFi protocol that has made significant impact in 2024.",
    startTime: Math.floor(new Date("2024-01-15T10:00:00Z").getTime() / 1000),
    endTime: Math.floor(new Date("2024-12-31T23:59:59Z").getTime() / 1000),
    totalVotes: 1247,
    createdBy: "GxU7...h3K9",
    candidates: [
      { id: "1", name: "Jupiter Exchange", votes: 543, pollId: "1" },
      { id: "2", name: "Raydium", votes: 412, pollId: "1" },
      { id: "3", name: "Orca", votes: 292, pollId: "1" },
    ],
  },
  {
    id: 2,
    name: "Solana Hackathon Winner",
    description:
      "Choose the most promising project from the recent Solana Hackathon submissions.",
    startTime: Math.floor(new Date("2024-02-01T00:00:00Z").getTime() / 1000),
    endTime: Math.floor(new Date("2024-02-28T23:59:59Z").getTime() / 1000),
    totalVotes: 892,
    createdBy: "Bv3K...m7N2",
    candidates: [
      { id: "4", name: "SolanaFi", votes: 334, pollId: "2" },
      { id: "5", name: "MetaPlex Studio", votes: 278, pollId: "2" },
      { id: "6", name: "Phantom Wallet", votes: 280, pollId: "2" },
    ],
  },
  {
    id: 3,
    name: "Community Treasury Allocation",
    description:
      "Decide how to allocate 100,000 SOL from the community treasury for ecosystem development.",
    startTime: Math.floor(new Date("2024-03-01T12:00:00Z").getTime() / 1000),
    endTime: Math.floor(new Date("2024-03-15T12:00:00Z").getTime() / 1000),
    totalVotes: 0,
    createdBy: "Fh2M...k8L4",
    candidates: [
      { id: "7", name: "Developer Grants (40%)", votes: 0, pollId: "3" },
      { id: "8", name: "Marketing & Adoption (30%)", votes: 0, pollId: "3" },
      { id: "9", name: "Infrastructure (20%)", votes: 0, pollId: "3" },
      { id: "10", name: "Emergency Fund (10%)", votes: 0, pollId: "3" },
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

export function getPollById(id: number): Poll | undefined {
  return mockPolls.find((poll) => poll.id === id);
}

export function getCandidatesByPollId(pollId: number): Candidate[] {
  return mockPolls.find((poll) => poll.id === pollId)?.candidates || [];
}

export function getAllCandidates(): Candidate[] {
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
