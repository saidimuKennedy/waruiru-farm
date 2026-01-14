
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, User, Calculator, Send, AlertCircle, Loader2 } from "lucide-react";
import { useForm, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

type FormInputs = z.infer<typeof formSchema>;

type ContactFormProps = {
  isSubmitting: boolean;
  cartItemsCount: number;
  onFormSubmit: (data: FormInputs) => Promise<void>;
  form: ReturnType<typeof useForm<FormInputs>>;
};

/**
 * Contact form for requesting a quote.
 * Includes validation using Zod and React Hook Form.
 *
 * @param {boolean} isSubmitting - Form submission state.
 * @param {number} cartItemsCount - Number of items in cart (used to disable submit if empty).
 * @param {function} onFormSubmit - Submission handler.
 * @param {object} form - React Hook Form instance.
 */
export function ContactForm({ isSubmitting, cartItemsCount, onFormSubmit, form }: ContactFormProps) {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
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
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
              disabled={isSubmitting || cartItemsCount === 0}
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
          </form>
        </CardContent>
      </Card>
    );
}