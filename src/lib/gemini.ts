import {
  FARM_ASSISTANT_SYSTEM_INSTRUCTION,
  GeminiContentPart,
} from "@/lib/chat-utils";

const API_KEY = process.env.GEMINI_API_KEY!;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

/**
 * Calls the Google Gemini API to generate a response based on chat history.
 *
 * @param {GeminiContentPart[]} history - The conversation history.
 * @param {string} newMessageText - The latest user message.
 * @returns {Promise<string>} The generated response text.
 */
export async function callGeminiApi(
  history: GeminiContentPart[],
  newMessageText: string
): Promise<string> {
  const contents: GeminiContentPart[] = [
    ...history,
    { role: "user", parts: [{ text: newMessageText }] },
  ];

  const payload = {
    contents,
    tools: [{ google_search: {} }],
    systemInstruction: {
      parts: [{ text: FARM_ASSISTANT_SYSTEM_INSTRUCTION }],
    },
  };

  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add Referer header to satisfy API key restrictions (must match Console settings)
          "Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Empty response from Gemini API");
      return text;
    } catch (err) {
      console.error(`[GEMINI_API] Attempt ${i + 1} failed:`, err);
      if (i < MAX_RETRIES - 1)
        await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  return "I'm having trouble right now. Try again in a moment.";
}
