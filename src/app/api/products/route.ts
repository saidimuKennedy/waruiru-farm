import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.image ?? "",
      price: product.price,
      unit: product.unit,
      category: product.category.name,
      inStock: product.inStock,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
