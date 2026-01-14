import {
  Leaf,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "./forms/newsLetterForm";

/**
 * Global footer component displaying links, contact info, and newsletter form.
 */
export default function Footer() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];
  return (
    <footer className="bg-green-950 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-1 mb-4">
              <Image
                src="/waruiru_logo.png"
                width={50}
                height={50}
                alt="Waruiru Farm Logo"
                className="w-12 h-12"
              />
              <span className="text-2xl font-bold">Waruiru Farm</span>
            </div>
            <p className="text-gray-300">Sustainable farming, fresh produce.</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-gray-300 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>info@waruirufarm.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>+254 114 102575</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                <span>Ngong, Kenya</span>
              </li>
            </ul>
          </div>

          <NewsletterForm />
        </div>

        <div className="relative border-t border-green-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Waruiru Farm. All rights reserved.</p>
          <p className="absolute bottom-0 right-0 text-xs">
            {" "}
            a product of{" "}
            <Link href="https://jiaminie.inc">
              <span className="text-emerald-400 text-sm hover:text-xl cursor-pointer">
                Jiaminie.inc
              </span>
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
