import { getAllPosts } from "@/lib/blog-posts";
import BlogContentClient from "@/components/BlogContentClient";
import { DefaultSession, getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Post {
  slug: string;
  imageUrl?: string | null;
  title: string;
  date: Date;
  content: string;
  author: string;
  excerpt: string;
}

const BlogPage = async () => {
  const posts: Post[] = await getAllPosts();
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === "admin";

  // --- ADD THIS CONSOLE.LOG ---
  console.log("Server-side Session:", JSON.stringify(session, null, 2));
  // --- END ADDITION ---

  // --- ADD THIS CONSOLE.LOG ---
  console.log("Is Admin (derived):", isAdmin);
  // --- END ADDITION ---

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dq3wkbgts/image/upload/v1753168685/farmer_in_field_eojduf.png')",
        }}
      >
        <div
          className="absolute inset-0 bg-black/50"
          style={{ backdropFilter: "blur(4px)" }}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Farm Fresh News</h1>
          <p className="text-lg mt-2 max-w-2xl mx-auto">
            Updates, stories, and insights from our fields to your screen.
          </p>
        </div>
      </div>

      <BlogContentClient posts={posts} isAdmin={isAdmin} />
    </div>
  );
};

export default BlogPage;
