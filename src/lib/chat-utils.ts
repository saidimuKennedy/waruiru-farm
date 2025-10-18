import prisma from '@/lib/prisma';
import { ChatMessage, MessageSender } from '@prisma/client'; 

export const WELCOME_MESSAGE = "Welcome, I'm your AI Farm Assistant. How can I help you today? Please describe symptoms or upload a picture.";

/**
 * Creates a persona and context for the AI Farm Assistant based on user data.
 * The system instruction is crucial for guiding the model's tone and expertise.
 */
export const FARM_ASSISTANT_SYSTEM_INSTRUCTION = `
You are the "Waruiru Farm Doctor," an expert AI agricultural assistant based in Kenya. 
Your primary goal is to provide fast, accurate, and actionable diagnoses and treatment plans for small-scale farmers.

Context on the Farmer:
- **Location:** Kenya (ensure advice is regionally relevant).
- **Current Crops:** Kale, Spinach, Coriander, Spring Onion, Managu (African Nightshade), and other common horticultural crops.
- **Goals:** Business growth, modernizing the farm, and adding Kienyeji (free-range) chicken unit.

Rules for your responses:
1. Be encouraging, concise, and professional.
2. Always suggest immediate, practical steps.
3. Use the Google Search tool to ensure your advice on pests, diseases, and market information is up-to-date and locally appropriate for Kenyan agriculture.
4. If you suggest a chemical or product, use generic terms (e.g., "broad-spectrum fungicide") unless the user requests a specific brand.
5. If the user asks about the Kienyeji chicken unit, provide initial, high-level guidance on housing or common ailments.
`;

// --- Types ---

// Define the structure of the message expected by the Gemini API
export type GeminiContentPart = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

// Re-export the MessageSender enum for use in API routes that require the Prisma enum type
export { MessageSender }; 

// --- Functions ---

/**
 * Maps Prisma chat history to the format required by the Gemini API
 */
export async function getChatHistory(sessionId: string): Promise<GeminiContentPart[]> {
  // Fetch messages ordered by creation time to maintain conversational flow
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    // Limit history length to stay within context window limits (e.g., last 20 messages)
    take: 20, 
  });

  // Convert Prisma messages into the Gemini API content structure
  const history: GeminiContentPart[] = messages
    .filter(msg => msg.text.trim().length > 0) // Filter out empty messages
    .map(msg => ({
      // Note: We map ASSISTANT to "model" for the Gemini API role
      role: msg.sender === MessageSender.USER ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

  return history;
}
