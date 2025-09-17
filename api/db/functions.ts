import { supabase } from "../initClientSupabase";
import * as anchor from "@coral-xyz/anchor";

export const addPollToDb = async (poll: any) => {
  const { data, error } = await supabase.from("pools").insert({
    poll_name: poll.name,
    poll_description: poll.description,
    poll_voting_start: poll.start_time,
    poll_voting_end: new Date(anchor.BN(poll?.end_time).toNumber() * 1000).toISOString(),
  });
  if (error) {
    console.error("Error adding poll to database:", error);
  } else {
    console.log("Poll added to database:", data);
  }
};

export const getPoolsFromDb = async () => {
  const { data, error } = await supabase.from("polls").select("*");
  if (error) {
    console.error("Error fetching pools from database:", error);
  } else {
    console.log("Pools fetched from database:", data);
  }
  return { polls: data, error: error };
};

export const getPoolsFromDbById = async (id: string) => {
  const { data, error } = await supabase
    .from("polls")
    .select(
      `
        poll_id,
        poll_name,
        poll_description,
        poll_voting_start,
        pol_voting_end,
        candidates:candidates(
          name,
          votes
        )
      `
    )
    .eq("poll_id", id)
    .single();
  if (error) {
    console.error("Error fetching poll from database:", error);
  } else {
    console.log("Poll fetched from database:", data);
  }
  if (!data) {
    return { poll: null, error: "Poll not found" };
  }
  const result = {
    pollId: data.poll_id,
    name: data.poll_name,
    description: data.poll_description,
    startTime: data.poll_voting_start,
    endTime: data.pol_voting_end,
    candidates:
      data.candidates !== null
        ? data?.candidates
            .map((c) => ({
              name: c.name,
              votes: c.votes,
            }))
            .sort((a, b) => a.name.localeCompare(b.name))
        : [], // Sort by name
  };

  return { poll: result, error: error };
};
