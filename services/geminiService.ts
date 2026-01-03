
import { GoogleGenAI, Type } from "@google/genai";
import { WeekData, MoodType } from "../types";

export const generateNarrativeInsight = async (
  weeks: Record<string, WeekData>, 
  age: number
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  // Extract significant events
  const entriesWithNotes = Object.values(weeks)
    .filter(w => w.note && w.note.trim() !== '')
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 10); // Last 10 notes for context

  const prompt = `
    Context: A user is recording their life journey in weeks. They are currently ${age} years old.
    
    Recent Life Highlights/Moods:
    ${entriesWithNotes.map(w => `- [${w.id}] Mood: ${w.mood}, Note: ${w.note}`).join('\n')}

    Based on the philosophy: "Life is not for acceleration, but to be seen, felt, and understood."
    
    Task: Write a short (max 150 words), poetic, and encouraging "Life Narrative" insight in Chinese. 
    Acknowledge their effort to record their life. Help them see the beauty in their current stage of the "Life Clock".
    Focus on the idea that every small square represents texture and value.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Narrative generation failed:", error);
    return "生命的故事正在由你亲自书写。即使只是一个小小的记号，也是你曾在这个世界上用力生活的证明。";
  }
};
