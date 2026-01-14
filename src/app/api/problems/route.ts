import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Problems API.
 * GET: Retrieves a list of common farm problems/diseases.
 */
export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      orderBy: {
        title: "asc",
      },
    });
    return NextResponse.json(problems);
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return NextResponse.json(
      { message: "Error fetching problems from the database." },
      { status: 500 }
    );
  }
}
