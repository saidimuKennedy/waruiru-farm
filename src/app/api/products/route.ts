import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
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
      stockQuantity: product.stockQuantity,
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, price, stockQuantity } = await req.json();

    if (!name || !price || stockQuantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        stockQuantity,
        // Add other required fields with default or provided values
        unit: "kg", // default value
        categoryId: "clzscs1y90000123456789abc", // default value, replace with actual category id
        inStock: stockQuantity > 0,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
