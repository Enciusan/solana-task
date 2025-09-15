import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

const polls = { poll_id: 1, name: "test", description: "test", start_time: "2023-01-01", end_time: "2023-01-02" };
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
        description: polls.description,
        start: polls.start_time,
        end: polls.end_time,
        candidates: candidates,
      },
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
