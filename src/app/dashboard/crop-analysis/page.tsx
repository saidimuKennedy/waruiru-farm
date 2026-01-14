"use client";

import { useState } from "react";
import ImageUpload from "./components/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Crop Analysis page.
 * Allows users to upload plant images for AI diagnosis.
 * Displays the analysis result from the AI.
 */
export default function CropAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crop Analysis</h1>
      <ImageUpload onAnalyze={setAnalysisResult} />

      {analysisResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>AI Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{analysisResult}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
