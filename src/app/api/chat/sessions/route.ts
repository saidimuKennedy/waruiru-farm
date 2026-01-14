import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Chat Sessions API.
 * GET: Retrieves a list of chat sessions for the authenticated user.
 * DELETE: Deletes a specific chat session.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized: User not logged in", {
        status: 401,
      });
    }

    const chatSessions = await prisma.chatSession.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(chatSessions);
  } catch (error) {
    console.error("[CHAT_SESSIONS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        {
          message: "Missing sessionId parameter",
        },
        { status: 400 }
      );
    }

    const chatSession = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!chatSession) {
      console.log(
        "[CHAT_SESSIONS_DELETE] Session not found or not owned by user"
      );
      return NextResponse.json(
        {
          message: "Forbidden: Session not found or not owned by user",
        },
        { status: 403 }
      );
    }

    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    console.log(
      "[CHAT_SESSIONS_DELETE] Successfully deleted session:",
      sessionId
    );

    return NextResponse.json(
      {
        message: "Session deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CHAT_SESSIONS_DELETE] Error:", error);
    return NextResponse.json(
      {
        message: "Failed to delete session",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
