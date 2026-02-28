import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    // 1. Capture 'full_name' from the Vue request
    const { full_name, mood_text } = req.body;

    // 2. Check if the user exists, or create them to get a real user_id
    let [user] = await db.query("SELECT id FROM users WHERE full_name = ?", [full_name]);
    
    let userId;
    if (user.length > 0) {
      userId = user[0].id;
    } else {
      // Create user if they don't exist
      const [newUser] = await db.query("INSERT INTO users (full_name) VALUES (?)", [full_name]);
      userId = newUser.insertId;
    }

    // 3. Insert the mood entry using the dynamic userId
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
      [userId, mood_text]
    );

    // 4. Get the AI Response (Passing the mood_text to make it dynamic)
    const aiMessage = await getAIResponse(mood_text);

    // 5. Store the AI response
    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
      [result.insertId, aiMessage]
    );

    res.json({ message: "Mood saved", aiMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  // Added ORDER BY so the newest names show up at the top
  const [rows] = await db.query(`
    SELECT u.full_name, m.mood_text, a.ai_message, m.id
    FROM users u
    JOIN mood_entries m ON u.id = m.user_id
    JOIN ai_responses a ON m.id = a.mood_entry_id
    ORDER BY m.id DESC 
  `);

  res.json(rows);
});

// ... keep your delete route as is ...
export default router;