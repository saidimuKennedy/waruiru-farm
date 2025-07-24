import Link from "next/link";
import { getAllPosts } from "@/lib/blog-posts";
import { Calendar, User } from "lucide-react";

const BlogPage = async () => {
  const posts = await getAllPosts();
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
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

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} passHref>
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="overflow-hidden">
                  <img
                    src={post.imageUrl || "/waruiru&logo.png"}
                    alt={post.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" /> <span>{post.author}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
