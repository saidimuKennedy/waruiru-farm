"use client";
import emailjs from "@emailjs/browser";
import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus("pending");

    try {
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_1!,
        {
          email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log("Email sent:", response.text);
      setStatus("success");
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("error");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
      <p className="text-gray-300 mb-4">
        Subscribe to our newsletter for the latest updates.
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          required
          placeholder="Your email"
          className="w-full px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-r-md"
          disabled={status === "pending"}
        >
          {status === "pending" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {status === "pending" && (
        <p className="text-green-500 mt-2">Subscribed successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-500 mt-2">Something went wrong</p>
      )}
    </div>
  );
}
