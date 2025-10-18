import {
  FARM_ASSISTANT_SYSTEM_INSTRUCTION,
  GeminiContentPart,
} from "@/lib/chat-utils";

const API_KEY = process.env.GEMINI_API_KEY!;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

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
        headers: { "Content-Type": "application/json" },
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
