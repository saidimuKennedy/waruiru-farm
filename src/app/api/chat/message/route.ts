import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { MessageSender } from "@prisma/client";
import {
  getChatHistory,
  FARM_ASSISTANT_SYSTEM_INSTRUCTION,
  GeminiContentPart,
} from "@/lib/chat-utils";

const API_KEY = process.env.GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

async function callGeminiApi(
  history: GeminiContentPart[],
  newMessageText: string
): Promise<string> {
  const contents: GeminiContentPart[] = [
    ...history,
    { role: "user", parts: [{ text: newMessageText }] },
  ];

  const payload = {
    contents: contents,
    tools: [{ google_search: {} }],
    systemInstruction: {
      parts: [{ text: FARM_ASSISTANT_SYSTEM_INSTRUCTION }],
    },
  };

  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `API call failed with status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text;
      } else {
        console.warn("[GEMINI_API] Empty response:", JSON.stringify(result));
        throw new Error("Empty content returned from Gemini API.");
      }
    } catch (error) {
      console.error(`[GEMINI_API] Attempt ${i + 1} failed:`, error);
      if (i < MAX_RETRIES - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  return "I am currently unable to process your request. Please try again in a moment.";
}

export async function POST(req: Request) {
  if (!API_KEY) {
    console.error("[CHAT_POST] GEMINI_API_KEY is not configured");
    return NextResponse.json(
      {
        message: "AI service is not configured.",
      },
      { status: 503 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    const authenticatedUserId = session?.user?.id || null;

    const { sessionId, userMessage, imageUrl } = await req.json();

    if (!sessionId || !userMessage) {
      return NextResponse.json(
        {
          message: "Missing sessionId or userMessage.",
        },
        { status: 400 }
      );
    }

    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!chatSession) {
      return NextResponse.json(
        {
          message: "Chat session not found.",
        },
        { status: 404 }
      );
    }

    if (authenticatedUserId && chatSession.userId !== authenticatedUserId) {
      console.warn("[CHAT_POST] Unauthorized access attempt:", {
        sessionId,
        sessionOwner: chatSession.userId,
        requestUser: authenticatedUserId,
      });
      return NextResponse.json(
        {
          message: "Access denied to this chat session.",
        },
        { status: 403 }
      );
    }

    if (chatSession.status !== "active") {
      return NextResponse.json(
        {
          message: "This chat session is no longer active.",
        },
        { status: 400 }
      );
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        userId: chatSession.userId,
        sender: MessageSender.USER,
        text: userMessage,
        imageUrl: imageUrl || null,
      },
    });

    console.log("[CHAT_POST] User message saved:", {
      sessionId,
      userId: chatSession.userId,
    });

    const history = await getChatHistory(sessionId);

    const assistantResponseText = await callGeminiApi(history, userMessage);

    const assistantMsgRecord = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        userId: chatSession.userId,
        sender: MessageSender.ASSISTANT,
        text: assistantResponseText,
      },
    });

    console.log("[CHAT_POST] Assistant response saved:", {
      sessionId,
      messageId: assistantMsgRecord.id,
    });

    return NextResponse.json({
      message: "success",
      assistantMessage: assistantResponseText,
      messageId: assistantMsgRecord.id,
    });
  } catch (error) {
    console.error("[CHAT_POST] Error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Gemini API")) {
        return NextResponse.json(
          {
            message: "AI service is temporarily unavailable. Please try again.",
            error: error.message,
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed to process message.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const authenticatedUserId = session?.user?.id || null;

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { message: "Missing sessionId parameter." },
        { status: 400 }
      );
    }

    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true },
    });

    if (!chatSession) {
      return NextResponse.json(
        { message: "Chat session not found." },
        { status: 404 }
      );
    }

    if (authenticatedUserId && chatSession.userId !== authenticatedUserId) {
      return NextResponse.json(
        { message: "Access denied to this chat session." },
        { status: 403 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        text: true,
        imageUrl: true,
        sender: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("[CHAT_GET] Error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch chat messages.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
