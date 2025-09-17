export type Poll = {
  pollId: number;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
};

export type ExtraInformationPool = {
  candidates: Candidate[];
} & Poll;

export type Candidate = {
  id: string;
  name: string;
  votes: number;
  pollId: string;
};

export type Vote = {
  id: string;
  pollId: string;
  candidateId: string;
};
