import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Dashboard Preferences API.
 * GET: Retrieves user-specific dashboard settings (layout).
 * PUT: Updates user dashboard settings.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the user exists in the database
    const user = await prisma.user.upsert({
      where: { id: session.user.id },
      update: {}, // No update needed if user exists
      create: {
        id: session.user.id,
        email: session.user.email, // Assuming email is available in session
        name: session.user.name,   // Assuming name is available in session
      },
    });

    let userPreference = await prisma.userPreference.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userPreference) {
      // Create a default preference if none exists
      userPreference = await prisma.userPreference.create({
        data: {
          userId: user.id,
          dashboardLayout: {
            showStats: true,
            showLowStockAlerts: true,
          },
        },
      });
    }

    return NextResponse.json(userPreference);
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { dashboardLayout } = await req.json();

    if (!dashboardLayout) {
      return new NextResponse("Missing dashboardLayout in body", { status: 400 });
    }

    const updatedPreference = await prisma.userPreference.update({
      where: {
        userId: session.user.id,
      },
      data: {
        dashboardLayout: dashboardLayout,
      },
    });

    return NextResponse.json(updatedPreference);
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
