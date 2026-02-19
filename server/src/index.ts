import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Express server is running" });
});

// Proxy route to Python backend
app.get("/api/events", async (req: Request, res: Response) => {
  try {
    const response = await fetch("http://localhost:8000/api/events");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching from Python backend:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

export default app;
