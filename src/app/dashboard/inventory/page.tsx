"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProductForm from "../components/add-product-form";
import ProductList from "../components/product-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@prisma/client";

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products");
    const data = await response.json();
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    fetchProducts(); // Re-fetch products after adding a new one
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <AddProductForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <ProductList products={products} />
        )}
      </div>
    </div>
  );
}
