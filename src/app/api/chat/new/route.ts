import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { WELCOME_MESSAGE } from "@/lib/chat-utils";
import { MessageSender } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    const isCuidFormat = /^c[a-z0-9]{24}$/i.test(userId || "");

    let validatedUserId = null;

    if (userId && isCuidFormat) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });

      if (userExists) {
        validatedUserId = userId;
      } else {
        console.warn("[CHAT_SESSION_CREATE] Invalid userId provided:", userId);
      }
    }

    const newSession = await prisma.chatSession.create({
      data: {
        userId: validatedUserId,
        status: "active",
      },
    });

    await prisma.chatMessage.create({
      data: {
        sessionId: newSession.id,
        userId: validatedUserId,
        sender: MessageSender.ASSISTANT,
        text: WELCOME_MESSAGE,
      },
    });

    console.log("[CHAT_SESSION_CREATE] Session created:", {
      sessionId: newSession.id,
      userType: validatedUserId ? "authenticated" : "guest",
    });

    return NextResponse.json(
      {
        sessionId: newSession.id,
        welcomeMessage: WELCOME_MESSAGE,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CHAT_SESSION_CREATE] Error:", error);
    return NextResponse.json(
      {
        message: "Failed to start new chat session.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
