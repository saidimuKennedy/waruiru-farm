import Image from "next/image";
import { Plus, Minus } from "lucide-react";

interface ProduceItem {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
}

interface ProductCardProps {
  item: ProduceItem;
  quantity: number;
  onUpdateQuantity: (itemId: string, change: number) => void;
}

/**
 * Displays a single product item with price, discount, and quantity controls.
 *
 * @param {ProduceItem} item - The product data.
 * @param {number} quantity - Current quantity in cart.
 * @param {function} onUpdateQuantity - Handler to change quantity.
 */
export function ProductCard({
  item,
  quantity,
  onUpdateQuantity,
}: ProductCardProps) {
  return (
    <div className="relative flex flex-col items-center w-60 md:w-68">
      {/* Product Image Container */}
      <div className="relative w-full h-64 md:h-72 lg:h-80 drop-shadow-xl bg-white rounded-lg overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Discount Tag */}
      {item.discount > 0 && (
        <div
          className="absolute right-[-80px] top-[-40px] bg-red-500 text-white font-bold px-4 py-2 shadow-lg hover:scale-105 transition-transform"
          style={{
            clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 28% 100%, 0% 50%)",
            borderRadius: "6px",
            transform: `rotate(${Math.random() * 6 - 3}deg) translateY(-5px)`,
            transformOrigin: "center",
          }}
        >
          <svg
            className="absolute left-2 top-1/2 -translate-y-1/2"
            width="12"
            height="12"
          >
            <circle cx="6" cy="6" r="5" fill="white" />
          </svg>
          <div className="pl-6">
            <div className="text-xs">
              was{" "}
              <span className="line-through opacity-70">
                KES {item.oldPrice}
              </span>
            </div>
            <div className="text-lg leading-tight">KES {item.price}</div>
            <div className="text-xs bg-yellow-300 text-black px-2 rounded mt-1 inline-block">
              -{item.discount}%
            </div>
          </div>
        </div>
      )}

      {/* Product Info */}
      <div className="mt-3 text-center">
        <div className="font-semibold text-sm">{item.name}</div>
        <div className="text-xs text-gray-500">Fresh and organic product</div>
      </div>

      {/* Cart Controls */}
      <div className="mt-3 flex items-center gap-2">
        {quantity > 0 ? (
          <>
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
