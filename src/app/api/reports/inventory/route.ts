import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Inventory Reports API.
 * GET: Generates inventory reports listing all products.
 * Supports CSV download or JSON response.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format"); // 'csv'

    const products = await prisma.product.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        category: true,
      },
    });

    const reportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      inStock: product.inStock,
    }));

    // Handle different formats
    if (format === "csv") {
      const csv = generateCsv(reportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="inventory_report_${Date.now()}.csv"`,
        },
      });
    }

    // Default to JSON
    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Failed to generate inventory report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function generateCsv(data: any[]): string {
  if (data.length === 0) {
    return "No data available";
  }

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((value) => (typeof value === "string" ? `"${value}"` : value))
      .join(",")
  );

  return [headers, ...rows].join("\n");
}
