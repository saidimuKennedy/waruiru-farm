"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("financial");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (format: "csv" | "pdf") => {
    setLoading(true);
    let url = "";
    let filename = "";

    if (reportType === "financial") {
      url = `/api/reports/financials?format=${format}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      filename = `financial_report_${Date.now()}.${format}`;
    } else if (reportType === "inventory") {
      url = `/api/reports/inventory?format=${format}`;
      filename = `inventory_report_${Date.now()}.${format}`;
    }

    if (format === "pdf") {
      alert("PDF generation is not yet implemented.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === "financial" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={() => handleDownload("csv")} disabled={loading}>
              {loading ? "Generating..." : "Download CSV"}
            </Button>
            <Button onClick={() => handleDownload("pdf")} disabled={loading} variant="outline">
              {loading ? "Generating..." : "Download PDF (Coming Soon)"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
