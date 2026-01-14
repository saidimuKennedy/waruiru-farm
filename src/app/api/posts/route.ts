import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

/**
 * Posts API.
 * GET: Retrieves all blog posts, ordered by date.
 * POST: Creates a new blog post (Admin only).
 */
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, imageUrl, excerpt, author, slug, status } = body;

    if (
      !title ||
      !content ||
      !author ||
      !slug ||
      !Object.values(PostStatus).includes(status)
    ) {
      return NextResponse.json(
        { message: "Missing required fields or invalid status." },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { slug: slug },
    });

    if (existingPost) {
      return NextResponse.json(
        {
          message:
            "A post with this slug already exists. Please choose a different title or manually adjust the slug.",
        },
        { status: 409 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        excerpt,
        author,
        slug,
        status,
        date: new Date(),
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
