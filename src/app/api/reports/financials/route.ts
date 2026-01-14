import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Financial Reports API.
 * GET: Generates financial reports based on date range.
 * Supports CSV download or JSON response.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const format = searchParams.get("format"); // 'csv' or 'pdf'

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateParam) {
      startDate = new Date(startDateParam);
    }
    if (endDateParam) {
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999); // Set to end of the day
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
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

    const reportData = {
      period: `${startDateParam || "beginning"} to ${endDateParam || "now"}`,
      totalRevenue: totalRevenue,
      transactions: transactions.map((t) => ({
        date: t.transactionDate.toISOString().split("T")[0],
        mpesaReceipt: t.mpesaReceipt,
        orderId: t.orderId,
        amount: t.amount,
      })),
    };

    // Handle different formats
    if (format === "csv") {
      const csv = generateCsv(reportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="financial_report_${Date.now()}.csv"`,
        },
      });
    }

    // Default to JSON for now, PDF generation is more complex
    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Failed to generate financial report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function generateCsv(data: any): string {
  let csv = "Period,Total Revenue\n";
  csv += `${data.period},${data.totalRevenue.toFixed(2)}\n\n`;

  csv += "Date,Mpesa Receipt,Order ID,Amount\n";
  data.transactions.forEach((t: any) => {
    csv += `${t.date},${t.mpesaReceipt},${t.orderId},${t.amount.toFixed(2)}\n`;
  });
  return csv;
}
