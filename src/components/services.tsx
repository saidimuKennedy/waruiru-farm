"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
        "bg-white rounded-xl shadow-lg overflow-hidden w-full md:w-72 lg:min-w-[320px] transition-all duration-500 hover:shadow-2xl",
        className
      )}
      style={style}
    >
      <div className="relative w-full h-40">
        <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const cardContent = [
  {
    title: "Fresh Produce Delivery",
    description:
      "Get fresh, organic produce delivered straight to your door. We offer a variety of seasonal fruits and vegetables.",
    imageUrl:
      "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753763404/elias-morr-_U8BWkVytUI-unsplash_kwl7lx.jpg",
  },
  {
    title: "Subscription Boxes",
    description:
      "Sign up for our weekly or bi-weekly vegetable boxes, curated with the best of what's in season.",
    imageUrl:
      "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753291847/harvest_busket_wlichy.webp",
  },
  {
    title: "Custom Orders",
    description:
      "Hand-pick your favorite vegetables from our online store and we'll pack and deliver them for you.",
    imageUrl:
      "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753277027/harvest_eowsmt.avif",
  },
];

const cardFanLayout = [
  { rotate: -12, translateX: -90, translateY: 15, z: 10 },
  { rotate: 0, translateX: 0, translateY: 0, z: 30 },
  { rotate: 12, translateX: 90, translateY: 15, z: 20 },
];

export function CardFan() {
  return (
    <div className="relative h-auto md:h-[350px] w-full max-w-[500px] mx-auto">
      {/* mobile simple grid */}
      <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
        {cardContent.map((card, i) => (
          <div key={i} className="w-full">
            <TemplateCard {...card} />
          </div>
        ))}
      </div>
      {/* Desktop fan layout */}
      <div className="hidden md:block">
        {cardContent.map((card, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 cursor-pointer"
            style={{
              transformOrigin: "center center",
            }}
            initial={{
              x: "-50%",
              y: "-50%",
              rotate: cardFanLayout[i].rotate,
              translateX: cardFanLayout[i].translateX,
              translateY: cardFanLayout[i].translateY,
              zIndex: cardFanLayout[i].z,
            }}
            whileHover={{ zIndex: 40, y: "-60%", scale: 1.1, rotate: 0 }}
            whileFocus={{ zIndex: 40, y: "-60%", scale: 1.1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            tabIndex={0}
          >
            <TemplateCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Services() {
  return (
    <section
      id="services"
      className="lg:py-20 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 my-4">
              How We Serve You
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              From convenient weekly boxes to custom orders, we bring the
              freshest organic vegetables from our farm directly to your table.
            </p>
            <Link href="/#produce-showcase" passHref>
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 rounded-full px-8 py-4 text-lg shadow-lg transition-transform transform hover:scale-105"
              >
                Have a look
              </Button>
            </Link>
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
