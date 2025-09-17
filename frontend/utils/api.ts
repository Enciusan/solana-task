export const getPoolsFromApi = async () => {
  const url = `http://localhost:3001/polls`;
  const response = await fetch(url);
  const data = await response.json();
  return { polls: data, error: data?.error || null };
};
export const getPoolsByIdFromApi = async (pollId: string) => {
  const url = `http://localhost:3001/polls/${pollId}`;
  const response = await fetch(url);
  const data = await response.json();
  return { poll: data, error: data?.error || null };
};

export const getCandidatesFromApiByPollId = async (pollId: string) => {
  const url = `http://localhost:3001/polls/${pollId}/leaderboard`;
  const response = await fetch(url);
  const data = await response.json();
  return { candidates: data, error: data?.error || null };
};
