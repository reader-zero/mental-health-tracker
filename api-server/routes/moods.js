import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, mood_text } = req.body;

  const [result] = await db.query(
    "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
    [user_id, mood_text]
  );

  const aiMessage = await getAIResponse(mood_text);

  await db.query(
    "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
    [result.insertId, aiMessage]
  );

  res.json({ message: "Mood saved", aiMessage });
});

router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT u.full_name, m.mood_text, a.ai_message
    FROM users u
    JOIN mood_entries m ON u.id = m.user_id
    JOIN ai_responses a ON m.id = a.mood_entry_id
  `);

  res.json(rows);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Note: This will only work if you delete the AI response first 
    // due to the Foreign Key, or if you set up ON DELETE CASCADE.
    await db.query("DELETE FROM ai_responses WHERE mood_entry_id = ?", [id]);
    await db.query("DELETE FROM mood_entries WHERE id = ?", [id]);
    
    res.json({ message: `Mood entry ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;