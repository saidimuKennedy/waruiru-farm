import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MessageSender } from "@prisma/client";
import { getChatHistory } from "@/lib/chat-server";
import { callGeminiApi } from "@/lib/gemini";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { message: "Missing sessionId", messages: [] },
        { status: 400 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        sender: true,
        text: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    if (!messages.length) {
      return NextResponse.json(
        { message: "No messages found", messages: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "success", messages }, { status: 200 });
  } catch (error) {
    console.error("[CHAT_MESSAGE_GET_ERROR]", error);
    return NextResponse.json(
      {
        message: "Failed to fetch messages",
        error: (error as Error).message,
        messages: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { sessionId, userMessage, imageUrl } = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    if (!sessionId || !userMessage) {
      return NextResponse.json(
        { message: "Missing sessionId or message", assistantMessage: null },
        { status: 400 }
      );
    }

    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true, userId: true, status: true, title: true },
    });

    if (!chatSession) {
      return NextResponse.json(
        { message: "Session not found", assistantMessage: null },
        { status: 404 }
      );
    }

    if (chatSession.userId !== userId) {
      return NextResponse.json(
        { message: "Access denied", assistantMessage: null },
        { status: 403 }
      );
    }

    if (chatSession.status !== "active") {
      return NextResponse.json(
        { message: "Session inactive", assistantMessage: null },
        { status: 400 }
      );
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: MessageSender.USER,
        text: userMessage,
        imageUrl: imageUrl || null,
        userId: chatSession.userId,
      },
    });

    // Auto-title if first message
    if (!chatSession.title) {
      const title = userMessage.split(" ").slice(0, 6).join(" ");
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title },
      });
    }

    const history = await getChatHistory(sessionId);
    const assistantReply = await callGeminiApi(history, userMessage);

    await prisma.chatMessage.create({
      data: {
        sessionId,
        sender: MessageSender.ASSISTANT,
        text: assistantReply,
        userId: chatSession.userId,
      },
    });

    return NextResponse.json(
      {
        message: "success",
        assistantMessage: assistantReply,
        messageId: crypto.randomUUID(),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CHAT_MESSAGE_ERROR]", err);
    return NextResponse.json(
      {
        message: "Server error",
        assistantMessage: null,
        error: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
