import express from "express";
import type { Request, Response } from "express";
import { getCandidatesFromDbByPollId, getPoolsFromDb, getPoolsFromDbById } from "../db/functions";

const router = express.Router();

const candidates = { candidate_id: 1, poll_id: 1, name: "test", votes: 0 };

router.get("/", async (req: Request, res: Response) => {
  try {
    const polls = await getPoolsFromDb();
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.status(200).json({
      success: true,
      data: polls,
    });
  } catch (error) {
    console.error("Error fetching polls:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch polls",
    });
  }
});

router.get("/:pollId", async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    console.log("pollId", pollId);
    const { poll, error } = await getPoolsFromDbById(pollId!);

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }
    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });

    res.status(200).json({
      success: true,
      data: poll,
    });
  } catch (error) {
    console.error("Error fetching poll details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch poll details",
    });
  }
});

router.get("/:pollId/leaderboard", async (req: Request, res: Response) => {
  try {
    const { pollId } = req.params;
    const { candidates, error } = await getCandidatesFromDbByPollId(Number(pollId));

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        success: true,
        data: candidates,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
});

export default router;
