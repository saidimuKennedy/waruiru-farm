import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title } = await req.json();

    const updated = await prisma.chatSession.update({
      where: { id: params.id },
      data: { title },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating session title:", error);
    return NextResponse.json(
      { message: "Failed to update title" },
      { status: 500 }
    );
  }
}
