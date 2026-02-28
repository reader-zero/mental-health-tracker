// src/services/aiService.js

export const getAIResponse = async (moodText) => {
  const input = (moodText || "").toLowerCase();

  // 1. Specific Keyword Responses
  if (input.includes("lonely") || input.includes("alone")) {
    return "I'm sorry you're feeling lonely. Remember that reaching out to one friend can help.";
  } 
  
  if (input.includes("anxious") || input.includes("stressed") || input.includes("worried")) {
    return "It sounds like things are heavy right now. Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8.";
  }

  if (input.includes("happy") || input.includes("great") || input.includes("excited")) {
    return "That's wonderful to hear! I'm glad you're having a positive day. Keep that momentum going!";
  }

  if (input.includes("tired") || input.includes("exhausted") || input.includes("sleepy")) {
    return "It sounds like you've been working hard. Make sure to prioritize some rest tonight.";
  }

  if (input.includes("sad") || input.includes("depressed") || input.includes("down")) {
    return "I'm sorry you're feeling down. Be kind to yourself today; you don't have to solve everything at once.";
  }

  // 2. DYNAMIC FALLBACK
  // If no keywords match, we "mirror" the user's text so it feels like the AI listened.
  return `Thank you for sharing that you're feeling "${moodText}." Taking a moment to acknowledge your feelings is a great first step.`;
};