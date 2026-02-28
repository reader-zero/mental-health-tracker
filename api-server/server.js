import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js";
import { db } from "./db.js"; // Make sure to import your db connection

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧪 LAB 6 TEST ROUTE (For Part 3 Screenshot)
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ status: "DB Connected", data: rows });
  } catch (err) {
    res.status(500).json({ status: "Error", message: err.message });
  }
});

app.use("/api/moods", moodRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});