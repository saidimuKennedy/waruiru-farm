import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const CTASection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 text-center bg-gray-50">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Ready to Taste the Difference?
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Get in touch with us today to learn more about our products and
        services.
      </p>
      <Link href="/contact" passHref>
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-4 text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Contact Us
        </Button>
      </Link>
    </section>
  );
};

export default CTASection;
