import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const LOW_STOCK_THRESHOLD = 10; // Define your low stock threshold

    const lowStockProducts = await prisma.product.findMany({
      where: {
        stockQuantity: {
          lt: LOW_STOCK_THRESHOLD, // Less than the threshold
        },
      },
      orderBy: {
        stockQuantity: "asc",
      },
    });

    return NextResponse.json(lowStockProducts);
  } catch (error) {
    console.error("Failed to fetch low stock products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
