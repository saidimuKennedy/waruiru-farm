import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Single Post API.
 * GET: Retrieves a specific blog post by its slug.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const formattedPost = {
      ...post,
      date: post.date.toISOString().split("T")[0],
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error(`Failed to fetch post with slug ${slug}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
