import { PrismaClient } from "@prisma/client";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: Date;
  author: string;
  imageUrl: string | null;
  content: string;
}

const isDevelopment = process.env.NODE_ENV === "development";
const BASE_URL = isDevelopment
  ? "http://localhost:3000"
  : process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

// Initialize Prisma client (with singleton pattern for build optimization)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Direct database access function
async function getPostsFromDB(): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.createdAt,
      author: post.author,
      imageUrl: post.imageUrl, // Adjust field name based on your schema
      content: post.content,
    }));
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

async function getPostBySlugFromDB(slug: string): Promise<Post | null> {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) return null;

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.createdAt,
      author: post.author,
      imageUrl: post.imageUrl,
      content: post.content,
    };
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  // During build, use direct DB access
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("Build phase: Using direct database access");
    return await getPostsFromDB();
  }

  // During runtime, prefer API but fallback to DB
  try {
    const res = await fetch(`${BASE_URL}/api/posts`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("API fetch failed");
    }

    return await res.json();
  } catch (error) {
    console.error("API fetch error, falling back to database:", error);
    return await getPostsFromDB();
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // During build, use direct DB access
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("Build phase: Using direct database access for slug:", slug);
    return await getPostBySlugFromDB(slug);
  }

  // During runtime, prefer API but fallback to DB
  try {
    const res = await fetch(`${BASE_URL}/api/posts/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("API fetch failed");
    }

    return await res.json();
  } catch (error) {
    console.error(
      `API fetch error for slug ${slug}, falling back to database:`,
      error
    );
    return await getPostBySlugFromDB(slug);
  }
}
