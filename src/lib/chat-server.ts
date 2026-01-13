import prisma from '@/lib/prisma';
import { MessageSender } from '@prisma/client';

// Define the structure of the message expected by the Gemini API
export type GeminiContentPart = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

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
