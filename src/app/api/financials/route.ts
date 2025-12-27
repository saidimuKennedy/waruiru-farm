import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        order: true,
      },
      orderBy: {
        transactionDate: "asc",
      },
    });

    const totalRevenue = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );

    const dailyRevenue = transactions.reduce((acc, transaction) => {
      const date = transaction.transactionDate.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(dailyRevenue).map((date) => ({
      date,
      revenue: dailyRevenue[date],
    }));

    return NextResponse.json({ transactions, totalRevenue, chartData });
  } catch (error) {
    console.error("Failed to fetch financials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
