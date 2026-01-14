"use client";

import { useState, useEffect } from "react";
import DashboardStats from "./components/dashboard-stats";
import LowStockAlert from "./components/low-stock-alert";
import DashboardSettings from "./components/dashboard-settings";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayout {
  showStats: boolean;
  showLowStockAlerts: boolean;
}

/**
 * Main Dashboard overview page.
 * Displays key statistics and widgets based on user preferences.
 * Allows users to customize their dashboard layout.
 */
export default function DashboardPage() {
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPreferences = async () => {
    setIsLoading(true);
    const response = await fetch("/api/dashboard/preferences");
    const data = await response.json();
    setLayout(data.dashboardLayout);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const handleSavePreferences = async (newLayout: DashboardLayout) => {
    await fetch("/api/dashboard/preferences", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dashboardLayout: newLayout }),
    });
    setLayout(newLayout);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {layout && (
          <DashboardSettings
            currentLayout={layout}
            onSave={handleSavePreferences}
          />
        )}
      </div>

      {layout?.showLowStockAlerts && (
        <div className="mb-6">
          <LowStockAlert />
        </div>
      )}

      {layout?.showStats && <DashboardStats />}
    </div>
  );
}
