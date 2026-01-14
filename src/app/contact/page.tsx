"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  AlertCircle,
  Check,
  Leaf,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { Card } from "@/components/ui/card";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().min(1, { message: "Email is required." }),
  subject: z.string().min(1, { message: "Subject is required." }),
  message: z.string().min(1, { message: "Message is required." }),
});

/**
 * Contact Us page component.
 * Displays contact information, a contact form (via EmailJS), and a location map.
 */
const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = ContactSchema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string>);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log("Email sent:", response.text);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending email:", error);
      // Optionally set an error message for the user
    } finally {
      setIsSubmitting(false);
    }
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div
        className="relative h-64 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: "url('/waruiru&logo.png')",
        }}
      >
        <div
          className="absolute inset-0 bg-black/50"
          style={{ backdropFilter: "blur(4px)" }}
        ></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-50 via-green-200 to-lime-600 bg-clip-text text-transparent mb-2">
            Contact Us
          </h1>
          <p className="text-lg mt-2">We'd love to hear from you!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Our Farm
                  </h3>
                  <p className="text-gray-600">
                    Ole Langas Rd, Matasia, Ngong, Kenya
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Email Us
                  </h3>
                  <p className="text-gray-600 hover:text-green-600 transition-colors">
                    <a href="mailto:hello@waruirufarm.com">
                      info@waruirufarm.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Call Us
                  </h3>
                  <p className="text-gray-600">+254 114-102-575</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 shadow-lg">
              {isSubmitted ? (
                <div className="relative text-center py-12">
                  <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Check className="h-12 w-12 text-emerald-600" />

                    {/* Leaf on top */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md">
                      <Leaf className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mt-6">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Thank you for reaching out. We'll get back to you as soon as
                    possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Send a Message
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Saidimu Waruiru"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="saidimu.w@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Question about subscription"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message here..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Tuko Hapa!</h2>
            <p className="text-lg text-gray-600 mt-2">
              Visit our farm location in Ngong
            </p>
          </div>
          <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15957.519097960334!2d36.63857582312683!3d-1.4285746736237272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f7c040d7c0f13%3A0x6b8d9c1b7a2e7c4!2sMatasia%2C%20Ngong!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Waruiru Farm Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
