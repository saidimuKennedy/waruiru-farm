"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Services from "@/components/services";
import CTASection from "@/components/CTASection";
import AnimatedProcessSection from "@/components/process";
import { motion } from "framer-motion";
import ProduceShowcase from "@/components/showcase";
import Announcement from "@/components/announcement";

const AgriTechLanding = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is your produce certified organic?",
      answer:
        "Yes, all our produce is grown using strict organic farming methods. We use natural fertilizers and pest control to ensure our vegetables are healthy, safe, and free from synthetic chemicals.",
    },
    {
      question: "What areas do you deliver to?",
      answer:
        "We currently deliver to most neighborhoods within Nairobi and its surrounding areas. You can enter your address at checkout to confirm if we deliver to your specific location.",
    },
    {
      question: "How does the subscription box work?",
      answer:
        "Our subscription box is a convenient way to get a regular supply of fresh vegetables. You can choose a weekly or bi-weekly plan, and we'll deliver a curated box of the best seasonal produce right to your doorstep. You can pause or cancel your subscription at any time.",
    },
    {
      question: "Can I customize my order or subscription box?",
      answer:
        "Absolutely! For individual orders, you can hand-pick any items from our online store. For subscription boxes, we offer options to exclude certain items you don't like and add on your favorites.",
    },
    {
      question: "Do you supply produce to restaurants and businesses?",
      answer:
        "Yes, we offer bulk purchasing and custom supply plans for restaurants, hotels, and other businesses. Please use the 'Schedule a Consultation' form or contact us directly to discuss your needs.",
    },
    {
      question: "What are your delivery days and times?",
      answer:
        "We deliver on Wednesdays and Saturdays. You can choose your preferred delivery day at checkout. Our delivery window is typically between 10:00 AM and 4:00 PM. We'll notify you when your order is on its way.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <section
        id="home"
        className="relative h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1675742569879-17e25e7784d7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white"
          >
            Fresh, Sustainable, and Local
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl mb-8 max-w-3xl mx-auto text-white"
          >
            Discover the taste of quality with Waruiru Farm's fresh produce,
            grown with care and dedication.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 rounded-full px-8 py-4 text-lg shadow-lg transition-transform transform hover:scale-105"
              onClick={() =>
                document
                  .getElementById("produce-showcase")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Our Products
            </Button>
          </motion.div>
        </div>
      </section>
      {/* announcement */}
      <Announcement />
      <Services />
      <ProduceShowcase />
      <AnimatedProcessSection />
      <CTASection />
      <section
        id="faq"
        className="bg-gradient-to-br from-green-50 to-green-100"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div
            className="bg-cover bg-center min-h-[400px] lg:min-h-full"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            }}
            aria-label="A farmer working in a lush green field."
          ></div>

          <div className="py-20 px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="max-w-2xl">
              <div className="text-left mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Your questions, answered. Here's some information you might
                  find helpful.
                </p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-300 pb-4">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 hover:text-green-700 focus:outline-none py-2"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === index && (
                      <div className="mt-2 text-gray-700 leading-relaxed pr-4">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgriTechLanding;
