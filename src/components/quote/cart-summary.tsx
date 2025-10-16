import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, X, Trash2 } from "lucide-react";

type CartSummaryProps = {
  cartItems: any[]; // Use a more specific type if possible
  quantities: Record<string, number>;
  itemCount: number;
  subtotal: number;
  estimatedTax: number;
  total: number;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

export function CartSummary({
  cartItems,
  quantities,
  itemCount,
  subtotal,
  estimatedTax,
  total,
  removeItem,
  clearCart,
}: CartSummaryProps) {
  return (
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
                      {quantities[item.id]} × KSh {item.price.toFixed(2)} /{" "}
                      {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent text-lg">
                      KSh {((quantities[item.id] || 0) * item.price).toFixed(2)}
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
                <span className="font-semibold">KSh {subtotal.toFixed(2)}</span>
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
  );
}