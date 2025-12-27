"use client";

import { useState, useEffect } from "react";
import StatCard from "./stat-card";
import StatCardSkeleton from "./stat-card-skeleton";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const response = await fetch("/api/dashboard/stats");
      const data = await response.json();
      setStats(data);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toFixed(2)}`}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="New Orders"
        value={`+${stats.newOrders}`}
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Inventory Value"
        value={`$${stats.inventoryValue.toFixed(2)}`}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="New Customers"
        value={`+${stats.newCustomers}`}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
