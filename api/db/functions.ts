import { supabase } from "../initClientSupabase";
import * as anchor from "@coral-xyz/anchor";

export const addPollToDb = async (poll: any) => {
  const { data, error } = await supabase.from("polls").insert({
    poll_id: anchor.BN(poll._poll_id).toNumber(),
    poll_name: poll.name,
    poll_description: poll.description,
    poll_voting_start: new Date(anchor.BN(poll?.start_time).toNumber() * 1000).toISOString(),
    pol_voting_end: new Date(anchor.BN(poll?.end_time).toNumber() * 1000).toISOString(),
  });
  if (error) {
    console.error("Error adding poll to database:", error);
  } else {
    console.log("Poll added to database:", data);
  }
};

export const addCandidateToDb = async (poll: any) => {
  let candidateId = 1;
  console.log("addCandidateToDb", poll);

  const { data: candidate, error: candidateError } = await supabase.from("candidates").select("*");
  if (candidateError) {
    console.error("Error fetching candidates from database:", candidateError);
  }
  if (candidate && candidate.length > 0) {
    candidateId = candidate.length + 1;
  }
  const { data, error } = await supabase.from("candidates").insert({
    candidate_id: candidateId,
    poll_id: anchor.BN(poll._poll_id).toNumber(),
    name: poll.candidate,
  });
  if (error) {
    console.error("Error adding candidate to database:", error);
  } else {
    console.log("Candidate added to database:", data);
  }
};

export const checkIfPollExists = async (id: number) => {
  const { data, error } = await supabase.from("polls").select("*").eq("poll_id", id).single();
  console.log("checkIfPollExists", data, error);
  if (error) {
    console.error("Error checking if poll exists:", error);
    return { poll: null, error: error };
  } else {
    console.log("Poll exists:", data);
    return { poll: data, error: null };
  }
};

export const checkIfCandidateExists = async (name: string, pollId: number) => {
  const { data, error } = await supabase.from("candidates").select("*").eq("name", name).eq("poll_id", pollId).single();
  console.log("checkIfCandidateExists", data, error);
  if (error) {
    console.error("Error checking if candidate exists:", error);
    return { candidate: null, error: error };
  } else {
    console.log("Candidate exists:", data);
    return { candidate: data, error: null };
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
    .eq("poll_id", Number(id))
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
      data.candidates?.length > 0
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

export const getCandidatesFromDbByPollId = async (id: number) => {
  const { data, error } = await supabase.from("candidates").select("*").eq("poll_id", id);
  if (error) {
    console.error("Error fetching candidates from database:", error);
  } else {
    console.log("Candidates fetched from database:", data);
  }

  console.log(data);
  if (!data) {
    return { poll: null, error: "Poll not found" };
  }

  const result = data.map((c) => ({
    id: c.candidate_id,
    name: c.name,
    votes: c.votes,
    pollId: c.poll_id,
  }));
  return { candidates: result, error: error };
};
