
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Heart, Star } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2025); // Default fallback
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Don't render dynamic content until mounted
  if (!mounted) {
    return (
      <footer className="bg-gradient-to-r from-orange-900 via-red-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🕉️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PoojaPath</h3>
                  <p className="text-orange-200 text-sm">Sacred Shopping 🇮🇳</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-orange-700/30 bg-orange-950/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-orange-200 text-sm">
                <span>© 2025 PoojaPath.</span>
                <span>Made with</span>
                <Heart size={14} className="text-red-400 fill-current" />
                <span>for devotees in India</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-r from-orange-900 via-red-900 to-pink-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🕉️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PoojaPath</h3>
                  <p className="text-orange-200 text-sm">Sacred Shopping 🇮🇳</p>
                </div>
              </div>
              <p className="text-orange-100 text-sm leading-6 mb-4">
                India's most trusted spiritual ecommerce platform. Authentic pooja items, holy books, and sacred essentials delivered with devotion across the country.
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-200">
                <Star size={14} className="fill-current text-yellow-400" />
                <span>Trusted by 10L+ Devotees</span>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-200">Sacred Categories</h4>
            <ul className="space-y-3">
              {[
                { name: "🪔 Pooja Items", href: "/pooja-items" },
                { name: "📿 Holy Books", href: "/holy-books" },
                { name: "🔥 Havan Items", href: "/havan-items" },
                { name: "🌺 Mata Ki Chunri", href: "/mata-ki-chunri" },
                { name: "🪔 Brass Diyas", href: "/pooja-items?category=diyas" },
                { name: "📖 Spiritual Books", href: "/holy-books?category=scriptures" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-orange-100 hover:text-white transition-colors text-sm flex items-center gap-2 hover:translate-x-1 transition-transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-200">Customer Care</h4>
            <ul className="space-y-3">
              {[
                { name: "My Account", href: "/profile" },
                { name: "Track Order", href: "/track-order" },
                { name: "Help Center", href: "/help" },
                { name: "Return Policy", href: "/returns" },
                { name: "Shipping Info", href: "/shipping" },
                { name: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-orange-100 hover:text-white transition-colors text-sm hover:translate-x-1 transition-transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-200">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-orange-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">+91 98765-43210</p>
                  <p className="text-orange-100 text-sm">Mon-Sat 9AM-7PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-orange-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">care@poojapath.com</p>
                  <p className="text-orange-100 text-sm">24/7 Email Support</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-orange-300 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">New Delhi, India</p>
                  <p className="text-orange-100 text-sm">Pan India Delivery</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <p className="text-orange-200 text-sm mb-3">Follow Our Journey</p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Youtube, href: "#", label: "YouTube" }
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spiritual Blessings Section */}
      <div className="border-t border-orange-700/30 bg-gradient-to-r from-orange-950 to-red-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-3">
              <span className="text-2xl"></span>
              <p className="text-orange-200 font-medium">
                 Om Namah Shivaya | Har Har Mahadev | Jay Mata Di 
              </p>
              <span className="text-2xl"></span>
            </div>
            <p className="text-orange-300 text-sm">
              Blessed shopping experience for devotees across India 🇮🇳
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-orange-700/30 bg-orange-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-orange-200 text-sm">
              <span>© {currentYear} PoojaPath.</span>
              <span>Made with</span>
              <Heart size={14} className="text-red-400 fill-current" />
              <span>for devotees in India</span>
            </div>
            
            <div className="flex items-center gap-6 text-orange-200 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

