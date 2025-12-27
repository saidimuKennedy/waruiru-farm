"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@prisma/client";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      setIsLoading(true);
      const response = await fetch("/api/inventory/low-stock");
      const data = await response.json();
      setLowStockProducts(data);
      setIsLoading(false);
    };

    fetchLowStockProducts();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (lowStockProducts.length === 0) {
    return null; // Don't show anything if no low stock products
  }

  return (
    <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          Low Stock Alert!
        </CardTitle>
        <AlertTriangle className="h-4 w-4 text-yellow-800 dark:text-yellow-200" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          The following products are running low:
        </p>
        <ul className="mt-2 text-sm text-yellow-900 dark:text-yellow-100">
          {lowStockProducts.map((product) => (
            <li key={product.id}>
              {product.name} (Stock: {product.stockQuantity})
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
