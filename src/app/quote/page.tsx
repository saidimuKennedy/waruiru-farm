"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Check, AlertCircle, Package, Leaf, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { CartSummary } from "@/components/quote/cart-summary";
import { ContactForm } from "@/components/quote/contact-form";
import { ProductCard } from "@/components/quote/product-card";
import LoadingLogo from "@/components/loading-animation";

// Define the data types
type ProduceItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  inStock: boolean;
  imageUrl: string;
  description?: string;
  rating?: number;
  image: string;
  // NEW: Add oldPrice and discount fields
  oldPrice?: number;
  discount?: number;
};

type QuoteSummary = {
  subTotal: number;
  estimatedTax: number;
  total: number;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().optional(),
  quantities: z
    .record(z.string(), z.number())
    .refine((quantities) => Object.values(quantities).some((qty) => qty > 0), {
      message: "Please add at least one item to your cart",
    }),
});

// A custom hook for cleaner data fetching and state management
const useProducts = () => {
  const [produceItems, setProduceItems] = useState<ProduceItem[]>([]);
  const [loadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get a random discount
  const getRandomDiscount = () => {
    const discounts = [5, 10, 15, 20];
    const randomIndex = Math.floor(Math.random() * discounts.length);
    return discounts[randomIndex];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProduceItem[] = await response.json();

        // NEW: Map over the fetched data to add discounts
        const withDiscounts = data.map((item) => {
          const discount = getRandomDiscount();
          const oldPrice = Math.round(item.price / (1 - discount / 100));
          return { ...item, oldPrice, discount };
        });

        setProduceItems(withDiscounts);
      } catch (err: any) {
        console.error("Error fetching products:", err.message);
        setError("Failed to load products. Please try again later.");
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  return { produceItems, loadingProducts, error };
};

/**
 * Quote Request page.
 * Allows users to browse products, add them to a cart, and request a price quote.
 * Requires user authentication.
 */
export default function QuotePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { produceItems, loadingProducts, error } = useProducts();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteSummary, setQuoteSummary] = useState<QuoteSummary | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      quantities: {},
    },
  });

  const { reset, setValue, watch } = form;

  const quantities = watch("quantities");

  useEffect(() => {
    if (produceItems.length > 0) {
      const initialQuantities = produceItems.reduce(
        (acc, item) => ({ ...acc, [item.id]: 0 }),
        {}
      );
      setValue("quantities", initialQuantities);
    }
  }, [produceItems, setValue]);

  useEffect(() => {
    if (session?.user?.email) {
      setValue("email", session.user.email);
    }
  }, [session, setValue]);

  const updateQuantity = (itemId: string, change: number) => {
    const currentValue = quantities[itemId] || 0;
    const newValue = Math.max(0, currentValue + change);
    setValue(
      "quantities",
      { ...quantities, [itemId]: newValue },
      {
        shouldValidate: true,
      }
    );
  };

  const removeItem = (itemId: string) => {
    setValue(
      "quantities",
      { ...quantities, [itemId]: 0 },
      {
        shouldValidate: true,
      }
    );
  };

  const clearCart = () => {
    const clearedQuantities = produceItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: 0 }),
      {}
    );
    setValue("quantities", clearedQuantities, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const items = Object.entries(data.quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => ({ id: itemId, quantity }));

    if (items.length === 0) {
      toast.error(
        "Please add at least one item to your cart to request a quote."
      );
      return;
    }

    if (!session) {
      toast.info(
        "You need to be signed in to request a quote. Redirecting to registration...",
        {
          duration: 3000,
        }
      );
      router.push("/register");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          items,
        }),
      });

      const result: QuoteSummary & { message?: string } = await response.json();

      if (response.ok) {
        setQuoteSummary(result);
        setIsSubmitted(true);
        reset();
        clearCart();
        toast.success(
          "Your quote request has been successfully submitted. We'll be in touch!"
        );
      } else {
        toast.error(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartItems = produceItems.filter((item) => quantities[item.id] > 0);
  const itemCount = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (quantities[item.id] || 0) * item.price,
    0
  );
  const estimatedTax = subtotal * 0.16;
  const total = subtotal + estimatedTax;

  if (loadingProducts) {
    return <LoadingLogo />;
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-orange-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-red-600">
          <AlertCircle className="h-12 w-12" />
          <p className="text-xl font-semibold">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  if (isSubmitted && quoteSummary) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center rounded-2xl shadow-2xl border border-emerald-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-10 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Check className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
              Just got your request!
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-md leading-relaxed">
              Thank you for choosing Waruiru Farm ~ Fresh Produce. We'll get
              back to you within the day.
            </p>
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-inner w-full max-w-sm">
              <div className="space-y-3 text-base text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Quote ID:
                  </span>
                  <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                    #QT-{Date.now().toString().slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total Items:</span>
                  <span className="font-bold text-emerald-600">
                    {itemCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Subtotal:</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Estimated Tax:</span>
                  <span>KSh {estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-4 flex justify-between font-bold text-xl">
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Grand Total:
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    KSh {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="mt-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Request Another Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 min-h-screen flex flex-col">
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-emerald-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">
              Produce Quote
            </h1>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            You're about to get farm-fresh produce at fair prices, quick and
            easy.
          </p>
        </div>
      </div>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Produce Items Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-emerald-600" />
                Available Produce
              </h2>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 shadow-sm border border-emerald-200">
                  <Leaf className="h-4 w-4 mr-2" />
                  {produceItems.length} fresh items
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {produceItems.map((item) => (
                <ProductCard
                  key={item.id}
                  quantity={quantities[item.id] || 0}
                  onUpdateQuantity={updateQuantity}
                  item={item as any}
                />
              ))}
            </div>
          </div>

          {/* Cart & Form Section */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-10 space-y-8">
              <CartSummary
                cartItems={cartItems}
                quantities={quantities}
                itemCount={itemCount}
                subtotal={subtotal}
                estimatedTax={estimatedTax}
                total={total}
                removeItem={removeItem}
                clearCart={clearCart}
              />
              <ContactForm
                isSubmitting={isSubmitting}
                cartItemsCount={itemCount}
                onFormSubmit={onSubmit}
                form={form} // Pass the entire form instance
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
