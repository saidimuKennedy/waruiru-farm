"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Mail,
  User,
  MessageSquare,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Package,
  Calculator,
  Send,
  Trash2,
  Leaf,
  Star,
  Heart,
  Loader2,
} from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FieldError, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  isOrganic?: boolean;
};

type QuoteSummary = {
  subTotal: number;
  estimatedTax: number;
  total: number;
};

export default function QuotePage() {
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [produceItems, setProduceItems] = useState<ProduceItem[]>([]);
  const [loadingProducts, setIsLoadingProducts] = useState(true);
  const [quoteSummary, setQuoteSummary] = useState<QuoteSummary | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    message: z.string().optional(),
    quantities: z
      .record(z.string(), z.number())
      .refine(
        (quantities) => Object.values(quantities).some((qty) => qty > 0),
        { message: "Please add at least one item to your cart" }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: session?.user?.email || "",
      message: "",
      quantities: {},
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: ProduceItem[] = await response.json();

        console.log("Fetched produce items with their image URLs:");
        data.forEach((item) => {
          console.log(`- ${item.name}: ${item.imageUrl}`);
        });
        setProduceItems(data);
        const initialQuantities = data.reduce(
          (acc, item) => ({ ...acc, [item.id]: 0 }),
          {}
        );
        setQuantities(initialQuantities);
        setValue("quantities", initialQuantities);
      } catch (error: any) {
        console.error("Error fetching products:", error.message);
        setSubmissionError("Failed to load products. Please try again later.");
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [setValue]);

  useEffect(() => {
    if (session?.user?.email) {
      setValue("email", session.user.email);
    }
  }, [session, setValue]);

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities((prev) => {
      const currentValue = prev[itemId] || 0;
      const newValue = Math.max(0, currentValue + change);
      const updatedQuantities = { ...prev, [itemId]: newValue };
      setValue("quantities", updatedQuantities, { shouldValidate: true });
      return updatedQuantities;
    });
  };

  const removeItem = (itemId: string) => {
    setQuantities((prev) => {
      const updatedQuantities = { ...prev, [itemId]: 0 };
      setValue("quantities", updatedQuantities, { shouldValidate: true });
      return updatedQuantities;
    });
  };

  const clearCart = () => {
    const clearedQuantities = produceItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: 0 }),
      {}
    );
    setQuantities(clearedQuantities);
    setValue("quantities", clearedQuantities, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const items = Object.entries(data.quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([itemId, quantity]) => {
        const item = produceItems.find((p) => p.id === itemId);
        return item ? { id: item.id, quantity } : null;
      })
      .filter(Boolean);

    if (items.length === 0) {
      setSubmissionError("Please add at least one item to your cart.");
      toast.error(
        "Please add at least one item to your cart to request a quote."
      );
      return;
    }

    if (!session) {
      setSubmissionError("You need to be signed in to request a quote.");

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
    setSubmissionError(null);

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
          items: items,
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
        setSubmissionError(
          result.message || "Something went wrong. Please try again."
        );

        toast.error(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error: any) {
      setSubmissionError(error.message || "An unexpected error occurred.");
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartItems = produceItems.filter((item) => quantities[item.id] > 0);
  const itemCount = cartItems.reduce(
    (sum, item) => sum + quantities[item.id],
    0
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + quantities[item.id] * item.price,
    0
  );
  const estimatedTax = subtotal * 0.16;
  const total = subtotal + estimatedTax;

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-6xl"
        >
          <Image
            src="/waruiru&logo.png"
            width={200}
            height={200}
            alt="Waruiru Logo"
            className="w-24 h-24"
          />
        </motion.div>
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
                  <span>KSh {quoteSummary.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Estimated Tax:</span>
                  <span>KSh {quoteSummary.estimatedTax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-4 flex justify-between font-bold text-xl">
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Grand Total:
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    KSh {quoteSummary.total.toFixed(2)}
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
      {/* Header */}
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

      {/* Main Content Area - Always Visible */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Side - Produce Items */}
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
                <Card
                  key={item.id}
                  className="group hover:shadow-2xl transition-all duration-500 border border-emerald-200 rounded-2xl overflow-hidden flex flex-col bg-white/70 backdrop-blur-sm hover:bg-white/90"
                >
                  <div className="relative overflow-hidden h-56 sm:h-64">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/kennedy.png";
                      }}
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.isOrganic && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-md">
                          <Leaf className="h-3 w-3 mr-1" />
                          Organic
                        </span>
                      )}
                      {!item.inStock && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white shadow-md">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {quantities[item.id] > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500 text-white shadow-lg animate-pulse">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {quantities[item.id]}
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  <CardContent className="py-2 px-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                              {item.category}
                            </span>
                            {item.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-600">
                                  {item.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            KSh {item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">
                            per {item.unit}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`p-2 rounded-lg bg-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-200 ${
                              quantities[item.id] <= 0 || !item.inStock
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </div>

                          <span className="font-semibold text-lg w-8 text-center">
                            {quantities[item.id] || 0}
                          </span>

                          <div
                            className={`p-2 rounded-lg bg-emerald-100 cursor-pointer transition-all duration-200 hover:bg-emerald-200 ${
                              !item.inStock
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3 text-emerald-600" />
                          </div>
                        </div>

                        {quantities[item.id] > 0 && (
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (quantities[item.id] / 10) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        {quantities[item.id] > 0 && (
                          <div className="text-sm font-medium text-emerald-600 mt-1">
                            KSh
                            {(item.price * quantities[item.id]).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Side - Cart & Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-10 space-y-8">
              {/* Cart Summary */}
              <Card className="bg-white/80 backdrop-blur-md shadow-xl border border-emerald-200 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full">
                      <ShoppingCart className="h-6 w-6 text-emerald-600" />
                    </div>
                    Your Cart
                    {itemCount > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md">
                        {itemCount} items
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {cartItems.length > 0 ? (
                    <div className="space-y-5">
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow duration-300"
                          >
                            <div className="flex-1 pr-4">
                              <h4 className="font-semibold text-gray-900 text-base mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {quantities[item.id]} × KSh{" "}
                                {item.price.toFixed(2)} / {item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent text-lg">
                                KSh{" "}
                                {(quantities[item.id] * item.price).toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-emerald-200 pt-5 mt-5 space-y-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4">
                        <div className="flex justify-between text-base text-gray-700">
                          <span>Subtotal</span>
                          <span className="font-semibold">
                            KSh {subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-base text-gray-700">
                          <span>Est. Tax (16%)</span>
                          <span className="font-semibold">
                            KSh {estimatedTax.toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-emerald-200 pt-3 mt-3 flex justify-between font-bold text-xl">
                          <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Total
                          </span>
                          <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            KSh {total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={clearCart}
                        className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-300 rounded-xl"
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        Clear All Items
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="mb-6 p-4 bg-gradient-to-br from-gray-100 to-emerald-50 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                        <Package className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-lg text-gray-600 font-semibold mb-2">
                        Your cart is empty
                      </p>
                      <p className="text-sm text-gray-500">
                        Add some fresh produce to get started!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="bg-white/80 backdrop-blur-md shadow-xl border border-emerald-200 rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50">
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full">
                      <Calculator className="h-6 w-6 text-emerald-600" />
                    </div>
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-base font-medium text-gray-700"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        <Input
                          id="name"
                          placeholder="e.g., Saidimu Waruiru"
                          className="pl-11 pr-4 py-3 rounded-xl border border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          {...register("name")}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.name?.message && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-base font-medium text-gray-700"
                      >
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g., saidimu.w@example.com"
                          className="pl-11 pr-4 py-3 rounded-xl border border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          {...register("email")}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email?.message && (
                        <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-base font-medium text-gray-700"
                      >
                        Special Instructions (Optional)
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="message"
                          placeholder="Any specific delivery instructions, preferred contact time, or questions..."
                          className="py-4 rounded-xl border border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 min-h-[100px] resize-none"
                          rows={4}
                          {...register("message")}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {errors.quantities?.message && (
                      <div className="text-sm text-red-600 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        {<p>{(errors.quantities as any)?.message}</p>}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting Quote...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Request Quote
                        </>
                      )}
                    </Button>
                    {submissionError && (
                      <div className="text-sm text-red-600 text-center flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p>{submissionError}</p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
