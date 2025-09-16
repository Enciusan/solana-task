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
