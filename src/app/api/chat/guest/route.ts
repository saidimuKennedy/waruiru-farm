import { NextResponse } from "next/server";
import { callGeminiApi } from "@/lib/gemini";
import { GeminiContentPart } from "@/lib/chat-utils";

/**
 * Guest Chat API.
 * Handles chat messages for unauthenticated users.
 * Does not store chat history in the database.
 * Calls Gemini directly with the provided history context.
 */
export async function POST(req: Request) {
  try {
    const { history = [], userMessage } = await req.json();

    if (!userMessage) {
      return NextResponse.json(
        { message: "Missing userMessage" },
        { status: 400 }
      );
    }

    // ensure the format matches callGeminiApi
    const formattedHistory: GeminiContentPart[] = history.map((msg: any) => ({
      role: msg.sender === "USER" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const reply = await callGeminiApi(formattedHistory, userMessage);

    return NextResponse.json(
      {
        assistantMessage: reply,
        messageId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[GUEST_CHAT_ERROR]", err);
    return NextResponse.json(
      { message: "Error processing message" },
      { status: 500 }
    );
  }
}
