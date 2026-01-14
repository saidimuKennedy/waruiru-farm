"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Editor } from "@tinymce/tinymce-react";
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

/**
 * Page for creating new blog posts.
 * Accessible only to admin users.
 * Uses a rich text editor (TinyMCE) for content creation.
 */
export default function CreateBlogPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const editorRef = useRef<any>(null);

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
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formData.content;
      const plainTextContent = tempDiv.textContent || tempDiv.innerText || "";

      const generatedExcerpt =
        plainTextContent.substring(0, 150) +
        (plainTextContent.length > 150 ? "..." : "");
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

    const plainTextContent = editorRef.current
      ? editorRef.current.getContent({ format: "text" })
      : "";
    if (
      !formData.title ||
      plainTextContent.trim().length === 0 ||
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
                {/* TinyMCE Editor */}
                <Editor
                  apiKey="1guysrjcksms9u8xc9tcm9spv2jmqt79cie1ga1cvwhoaw8p"
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue={formData.content}
                  value={formData.content}
                  onEditorChange={(newValue) => {
                    setFormData((prev) => ({ ...prev, content: newValue }));
                  }}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "bold italic backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
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
                  maxLength={200}
                />
                <p className="text-xs text-gray-500">
                  Auto-generated from content (HTML stripped), max 200 chars.
                  You can edit.
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
                      onError={() => setImagePreview(null)}
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
