"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  title: string;
  description: string;
  imageUrl: string;
  style?: React.CSSProperties;
  className?: string;
}

const TemplateCard = ({
  title,
  description,
  imageUrl,
  style,
  className = "",
}: TemplateCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-all duration-500 hover:shadow-2xl",
        className
      )}
      style={style}
    >
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const cards = [
  {
    title: "Fresh Produce Delivery",
    description:
      "Get fresh, organic produce delivered straight to your door. We offer a variety of seasonal fruits and vegetables.",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=200&fit=crop",
    rotate: -12,
    translateX: -90,
    translateY: 15,
    z: 10,
  },
  {
    title: "Subscription Boxes",
    description:
      "Sign up for our weekly or bi-weekly vegetable boxes, curated with the best of what's in season.",
    imageUrl:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=200&fit=crop",
    rotate: 0,
    translateX: 0,
    translateY: 0,
    z: 30,
  },
  {
    title: "Custom Orders",
    description:
      "Hand-pick your favorite vegetables from our online store and we'll pack and deliver them for you.",
    imageUrl:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&h=200&fit=crop",
    rotate: 12,
    translateX: 90,
    translateY: 15,
    z: 20,
  },
];

export function CardFan() {
  return (
    <div className="relative h-[350px] w-[500px] mx-auto">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2"
          style={{
            transformOrigin: "center center",
          }}
          initial={{
            x: "-50%",
            y: "-50%",
            rotate: card.rotate,
            translateX: card.translateX,
            translateY: card.translateY,
            zIndex: card.z,
          }}
          whileHover={{ zIndex: 40, y: "-60%", scale: 1.1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <TemplateCard {...card} className="cursor-pointer" />
        </motion.div>
      ))}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              How We Serve You
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              From convenient weekly boxes to custom orders, we bring the
              freshest organic vegetables from our farm directly to your table.
            </p>
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 rounded-full px-8 py-4 text-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Browse Our Offerings
            </Button>
          </div>
          <div className="flex justify-center items-center">
            <CardFan />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
