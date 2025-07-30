"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // Assuming you have sonner installed and configured
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export default function CreateBlogPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
    excerpt: "",
    author: "",
    slug: "",
    status: PostStatus.DRAFT,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    if (session?.user?.name && !formData.author) {
      setFormData((prev) => ({ ...prev, author: session.user.name as string }));
    }
  }, [session, formData.author]);

  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    } else {
      setFormData((prev) => ({ ...prev, slug: "" }));
    }
  }, [formData.title]);

  useEffect(() => {
    if (formData.content) {
      const generatedExcerpt =
        formData.content.substring(0, 150) +
        (formData.content.length > 150 ? "..." : "");
      setFormData((prev) => ({ ...prev, excerpt: generatedExcerpt }));
    } else {
      setFormData((prev) => ({ ...prev, excerpt: "" }));
    }
  }, [formData.content]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    if (id === "imageUrl") {
      setImagePreview(value);
    }
  };

  const handleStatusChange = (value: PostStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.title ||
      !formData.content ||
      !formData.author ||
      !formData.slug
    ) {
      setError(
        "Please fill in all required fields (Title, Content, Author, Slug)."
      );
      setLoading(false);
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog post.");
      }

      const newPost = await response.json();
      toast.success("Blog post created successfully!");
      router.push(`/blog/${newPost.slug}`);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading user session...</p>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    router.push("/");
    toast.error("You are not authorized to create blog posts.");
    return null;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4 pt-24 md:pt-32">
      {" "}
      {/* Added padding-top to clear fixed navbar */}
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create Blog Post</CardTitle>
          <CardDescription>
            Fill in the details for your new blog post.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Your blog post title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="slug">Slug (URL Path)</Label>
                <Input
                  id="slug"
                  placeholder="auto-generated-slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be part of the URL for your post.
                </p>
              </div>
            </div>

            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog post content here..."
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  required
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="A short summary for your post list..."
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200} // Optional: limit excerpt length
                />
                <p className="text-xs text-gray-500">
                  Auto-generated, but you can edit it (max 200 chars).
                </p>
              </div>
            </div>

            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="imageUrl">Image URL (for now)</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/your-image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">
                  For a real image upload, you'd integrate with a service like
                  Cloudinary or S3.
                </p>
                {imagePreview && (
                  <div className="mt-2 relative w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                      onError={() => setImagePreview(null)} // Hide preview if image fails to load
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid w-full items-center gap-4 mb-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author Name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid w-full items-center gap-4 mb-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PostStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <CardFooter className="flex justify-end p-0 pt-4">
              {" "}
              {/* Adjusted padding */}
              <Button type="submit" className="rounded-full" disabled={loading}>
                {loading ? "Creating..." : "Create Post"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
