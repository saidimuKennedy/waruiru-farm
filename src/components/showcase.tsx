"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay"; // Import the Autoplay plugin
import { EmblaCarouselType } from "embla-carousel"; // Optional: for type safety if needed

// Define a type for your produce data
interface ProduceItem {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  price?: number;
}

const produceData: ProduceItem[] = [
  {
    id: "1",
    name: "Organic Spinach",
    imageUrl: "/spinach.jpg",
    description:
      "Freshly harvested, tender leaves. Ready for delivery tomorrow. Perfect for healthy family meals and restaurant bulk orders. Grown using strict organic farming methods. We use natural fertilizers and pest control to ensure our vegetables are healthy, safe, and free from synthetic chemicals.",
    price: 150,
  },
  {
    id: "2",
    name: "Sweet Carrots",
    imageUrl: "carrots.avif",
    description:
      "Crunchy and naturally sweet. Harvested weekly. Great for juice bars, supermarkets, and everyday cooking. Our carrots are hand-picked at their peak ripeness for optimal flavor and texture.",
    price: 120,
  },
  {
    id: "3",
    name: "Ripe Tomatoes",
    imageUrl: "ripe_tomatoes.avif",
    description:
      "Juicy, rich red tomatoes. Available year-round. Essential for households and an excellent choice for retailers seeking consistent supply. Grown in nutrient-rich soil to ensure a vibrant color and robust flavor.",
    price: 200,
  },
  {
    id: "4",
    name: "Green Bell Peppers",
    imageUrl: "bell_peppers.avif",
    description:
      "Crisp and flavorful. Ready for harvest every other day. Ideal for salads, stir-fries, and a staple for any fresh produce section. Our peppers are known for their sweet crunch and versatility in various cuisines.",
    price: 180,
  },
  {
    id: "5",
    name: "Organic Kale",
    imageUrl: "kale.avif",
    description:
      "Nutrient-rich and fresh. Best ordered in advance for bulk supply. Popular with health-conscious consumers and specialty grocers. We ensure optimal growing conditions to maximize their nutritional value.",
    price: 100,
  },
  {
    id: "6",
    name: "Purple Cabbage",
    imageUrl: "purple_cabbage.jpg",
    description:
      "Vibrant and nutrient-dense. Available seasonally. Excellent for salads, slaws, and adding color to any dish. Our purple cabbage is prized for its beautiful color and crisp texture.",
    price: 90,
  },
];

export default function ProduceShowcase() {
  const [selectedProduce, setSelectedProduce] = useState<ProduceItem | null>(
    null
  );

  return (
    <section id="produce-showcase" className="py-24 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-0 sm:px-0 lg:px-0">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
          Our Fresh Produce
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto text-center">
          Experience the difference of farm-fresh quality, grown with care for
          your table and business.
        </p>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true, // Allows free dragging/swiping
          }}
          // Add the Autoplay plugin here
          plugins={[
            Autoplay({
              delay: 3000, // Scrolls every 3 seconds
              stopOnInteraction: true, // Stops autoplay if user interacts with carousel
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="m-0">
            {produceData.map((produce) => (
              <CarouselItem
                key={produce.id}
                className="p-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                onClick={() => setSelectedProduce(produce)}
              >
                <motion.div
                  className="relative group overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={produce.imageUrl}
                    alt={produce.name}
                    className="w-full h-80 object-cover"
                  />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* The Modal/Dialog Component for detailed view */}
      <Dialog
        open={!!selectedProduce}
        onOpenChange={() => setSelectedProduce(null)}
      >
        <DialogContent
          className="max-w-[1200px] w-[95vw] h-[90vh] p-0 overflow-hidden rounded-lg shadow-2xl flex" // Increased max-width
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {selectedProduce && (
            <div className="flex w-full h-full">
              {/* Image Section - Takes 2/3 width */}
              <div className="relative overflow-hidden w-6/10 rounded-l-lg">
                <img
                  src={selectedProduce.imageUrl}
                  alt={selectedProduce.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Description Section - Takes 1/3 width, white background */}
              <div className="w-4/10 bg-white p-6 md:p-8 flex flex-col justify-between text-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold mb-2">
                    {selectedProduce.name}
                  </DialogTitle>
                  {selectedProduce.price && (
                    <p className="text-2xl font-semibold text-green-700 mb-4">
                      Ksh {selectedProduce.price}
                    </p>
                  )}
                  <DialogDescription className="text-base leading-relaxed text-gray-700">
                    {selectedProduce.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-8 text-sm text-gray-600">
                  <p className="font-semibold mb-1">Target Audience:</p>
                  <ul className="list-disc list-inside">
                    <li>Households</li>
                    <li>Retailers (Supermarkets, Mama Mbogas)</li>
                  </ul>
                  <p className="mt-4">
                    **Availability:** Ready for delivery in 1-2 days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
