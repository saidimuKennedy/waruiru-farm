import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { title } = await req.json();

    if (!sessionId || !title) {
      return NextResponse.json(
        { message: "Missing sessionId or title" },
        { status: 400 }
      );
    }

    // Check if session exists first
    const sessionExists = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (!sessionExists) {
      console.error("[SESSION_PATCH_ERROR] Session not found:", sessionId);
      return NextResponse.json(
        { message: "Session not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title },
    });

    return NextResponse.json({ session: updated }, { status: 200 });
  } catch (error) {
    console.error("[SESSION_PATCH_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to update session title", error: (error as Error).message },
      { status: 500 }
    );
  }
}