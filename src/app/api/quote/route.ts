import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const quoteRequestSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().optional(),

  items: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
      })
    )
    .min(1, { message: "At least one item must be in the cart" }),
});

/**
 * Quote API.
 * POST: Processes a quote request.
 * Validates input, calculates totals including tax, creates a Quote record, and returns the breakdown.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = quoteRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error("Validation Error:", validation.error.format());
      return NextResponse.json(
        { message: "Invalid request data", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, message, items } = validation.data;

    let subTotal = 0;
    const itemsForDB: { [key: string]: number } = {};

    const requestedProductIds = items.map((item) => item.id);

    const requestedProducts = await prisma.product.findMany({
      where: {
        id: {
          in: requestedProductIds,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });
    const productPriceMap = new Map(
      requestedProducts.map((product) => [product.id, product.price])
    );

    for (const item of items) {
      const price = productPriceMap.get(item.id);
      if (!price) {
        console.error(`Product with ID ${item.id} not found`);
        return NextResponse.json(
          { message: `Product with ID ${item.id} not found` },
          { status: 404 }
        );
      }
      subTotal += price * item.quantity;
      itemsForDB[item.id] = item.quantity;
    }

    const estimatedTax = subTotal * 0.16;
    const total = subTotal + estimatedTax;

    const quote = await prisma.quote.create({
      data: {
        name,
        email,
        message: message || "",
        items: itemsForDB,
        subTotal,
        estimatedTax,
        total,
      },
    });

    return NextResponse.json(
      {
        subTotal: subTotal,
        estimatedTax: estimatedTax,
        total: total,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("QUOTE_POST_ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
