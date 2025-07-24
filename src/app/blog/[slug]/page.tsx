import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog-posts";
import { Calendar, User } from "lucide-react";
import ClientNavigation from "./clientNavigation";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allBlogPosts = await getAllPosts();
  const currentIndex = allBlogPosts.findIndex((p) => p.slug === slug);

  let prevPostSlug: string | null = null;
  let nextPostSlug: string | null = null;

  if (currentIndex > 0) {
    prevPostSlug = allBlogPosts[currentIndex - 1].slug;
  }

  if (currentIndex < allBlogPosts.length - 1) {
    nextPostSlug = allBlogPosts[currentIndex + 1].slug;
  }

  return (
    <div className="bg-white min-h-screen relative">
      <ClientNavigation
        prevPostSlug={prevPostSlug}
        nextPostSlug={nextPostSlug}
      />

      {/* Post Header */}
      <div
        className="h-96 bg-cover bg-center flex items-end text-white"
        style={{ backgroundImage: `url(${post.imageUrl})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
            <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-300 mt-4 space-x-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />{" "}
                <span>{post.date.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" /> <span>By {post.author}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <article
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
