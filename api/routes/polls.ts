import express from "express";
import type { Request, Response } from "express";
import { getPoolsFromDb, getPoolsFromDbById } from "../db/functions";

const router = express.Router();

const polls = await getPoolsFromDb();
const candidates = { candidate_id: 1, poll_id: 1, name: "test", votes: 0 };

router.get("/", async (req: Request, res: Response) => {
  try {
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
    const { poll, error } = await getPoolsFromDbById(pollId!);

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

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

    if (!pollId) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        pollId: polls.poll_id,
        name: polls.name,
        leaderboard: candidates,
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
