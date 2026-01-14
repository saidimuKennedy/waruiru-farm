import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Dashboard Stats API.
 * GET: Retrieves aggregated statistics for the dashboard (Revenue, Orders, Inventory Value, Customers).
 */
export async function GET() {
  try {
    // These are placeholder calculations.
    // In a real application, you would calculate these based on your business logic.
    const totalRevenue = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
    });

    const newOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const inventoryValue = await prisma.product.aggregate({
        _sum: {
            price: true,
        },
    });

    const newCustomers = await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
        },
    });

    const stats = {
      totalRevenue: totalRevenue._sum.amount ?? 0,
      newOrders,
      inventoryValue: inventoryValue._sum.price ?? 0,
      newCustomers,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
