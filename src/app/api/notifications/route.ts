import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Notifications API.
 * GET: Fetches unread notifications for the authenticated user.
 * POST: Marks a specific notification as read.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { notificationId } = await req.json();

    if (!notificationId) {
      return new NextResponse("Missing notificationId", { status: 400 });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId: session.user.id, // Ensure user can only mark their own notifications as read
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}