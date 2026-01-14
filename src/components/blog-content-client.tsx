"use client";

import Link from "next/link";
import { Calendar, User, PlusCircle } from "lucide-react";

interface Post {
  slug: string;
  imageUrl?: string | null;
  title: string;
  date: Date;
  content: string;
  author: string;
  excerpt: string;
}
interface BlogContentClientProps {
  posts: Post[];
  isAdmin: boolean;
}
/**
 * Client-side component to display a grid of blog posts.
 * Includes admin controls to create new posts.
 *
 * @param {Post[]} posts - Array of blog posts to display.
 * @param {boolean} isAdmin - Whether the current user has admin privileges.
 */
const BlogContentClient = ({ posts, isAdmin }: BlogContentClientProps) => {
  return (
    <div className="bg-gray-50 min-h-screen">
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

          {isAdmin && (
            <Link href="/blog/create" passHref>
              <div className="flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg shadow-md hover:shadow-xl hover:border-green-500 transition-all duration-300 cursor-pointer p-6 h-full min-h-[300px]">
                <PlusCircle className="w-16 h-16 text-gray-400 group-hover:text-green-600 transition-colors mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                  Create New Post
                </h3>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Click here to write and publish a new blog entry.
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogContentClient;
