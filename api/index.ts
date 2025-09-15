import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import pollsRoutes from "./routes/polls";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8899;

// Configure middleware
app.use(express.json());

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    message: "Solana Voting dApp API is running",
    cluster: process.env.CLUSTER || "localnet",
  });
});

// API Routes
app.use("/polls", pollsRoutes);

const initializeApp = async () => {
  try {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Solana cluster: ${process.env.CLUSTER || "localnet"}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

// Start the application
initializeApp();

export default app;
