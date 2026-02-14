// src/services/aiService.js

export const getAIResponse = async (moodText) => {
  const input = (moodText || "").toLowerCase();

  if (input.includes("lonely") || input.includes("alone")) {
    return "I'm sorry you're feeling lonely. Remember that reaching out to one friend can help.";
  } 
  
  if (input.includes("anxious") || input.includes("stressed")) {
    return "Try the 4-7-8 breathing technique. Inhale for 4, hold for 7, exhale for 8.";
  }

  return "Thank you for sharing. Remember to pause and breathe.";
};