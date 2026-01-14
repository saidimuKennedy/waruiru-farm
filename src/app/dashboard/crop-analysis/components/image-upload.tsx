"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  onAnalyze: (analysis: string) => void;
}

/**
 * Component for uploading images for analysis.
 * Handles file selection, preview, and submission to the Gemini API.
 */
export default function ImageUpload({ onAnalyze }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !prompt) {
      alert("Please select an image and enter a prompt.");
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64data = reader.result;

      try {
        const response = await fetch("/api/gemini-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageData: base64data, prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to get analysis from Gemini.");
        }

        const data = await response.json();
        onAnalyze(data.analysis);
      } catch (error) {
        console.error("Error during analysis:", error);
        alert("Failed to analyze image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Crop Image for Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="image">Upload Image</Label>
          <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {previewUrl && (
          <div className="relative w-full h-48 border rounded-md overflow-hidden">
            <img
              src={previewUrl}
              alt="Image Preview"
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="prompt">Analysis Prompt</Label>
          <Input
            id="prompt"
            placeholder="e.g., 'Analyze this maize leaf for disease'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <Button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Image"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
