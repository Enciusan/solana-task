const url =
  process.env.NEXT_PUBLIC_IS_DEV === "true"
    ? `http://localhost:3001`
    : process.env.NEXT_PUBLIC_API_URL;
export const getPoolsFromApi = async () => {
  const response = await fetch(url + `/polls`);
  const data = await response.json();
  return { polls: data, error: data?.error || null };
};
export const getPoolsByIdFromApi = async (pollId: string) => {
  const response = await fetch(`${url}/polls/${pollId}`);
  const data = await response.json();
  return { poll: data, error: data?.error || null };
};

export const getCandidatesFromApiByPollId = async (pollId: string) => {
  const response = await fetch(`${url}/polls/${pollId}/leaderboard`);
  const data = await response.json();
  return { candidates: data, error: data?.error || null };
};
