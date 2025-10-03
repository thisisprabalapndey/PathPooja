
"use client";
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, ArrowRight, Play, Star, Users, Award } from 'lucide-react';
import Image from 'next/image';

const FEATURED_PRODUCTS = [
  {
    name: "Premium Wireless Headphones",
    tagline: "Sound. Perfected.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80",
    price: "$299"
  },
  {
    name: "Minimalist Backpack", 
    tagline: "Carry. Everything.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80",
    price: "$129"
  },
  {
    name: "Athletic Running Shoes",
    tagline: "Run. Beyond.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80",
    price: "$159"
  }
];

export default function HeroSection() {
  const [currentProduct, setCurrentProduct] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % FEATURED_PRODUCTS.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <motion.div 
            style={{ y, opacity }}
            className="text-white space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm"
            >
              <Award size={16} className="text-yellow-400" />
              <span>Award-winning design</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Store
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Nova
                </span>
              </h1>
              
              <motion.h2 
                key={currentProduct}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-2xl lg:text-4xl font-light mt-4 text-gray-300"
              >
                {FEATURED_PRODUCTS[currentProduct].tagline}
              </motion.h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 leading-relaxed max-w-lg"
            >
              Premium lifestyle products designed for perfection. Experience the future of ecommerce with curated collections that define excellence.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Users size={14} />
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center gap-1">
                  4.9 <Star size={16} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition-all duration-300"
              >
                <ShoppingBag size={20} />
                Shop Collection
                <ArrowRight size={16} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-white/10 transition-all duration-300"
              >
                <Play size={16} />
                Watch Story
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Product Showcase */}
          <motion.div 
            className="relative h-[600px] lg:h-[700px]"
            style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
          >
            {/* Main Product Display */}
            <div className="relative w-full h-full">
              <motion.div
                key={currentProduct}
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -45 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative">
                  {/* Product Image */}
                  <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-700">
                    <Image
                      src={FEATURED_PRODUCTS[currentProduct].image}
                      alt={FEATURED_PRODUCTS[currentProduct].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Floating Price Tag */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -right-8 top-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl"
                  >
                    <div className="text-2xl font-bold text-gray-900">
                      {FEATURED_PRODUCTS[currentProduct].price}
                    </div>
                    <div className="text-sm text-gray-600">Starting at</div>
                  </motion.div>

                  {/* Floating Product Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -left-8 bottom-8 bg-black/80 backdrop-blur-sm text-white rounded-2xl p-4 shadow-xl max-w-48"
                  >
                    <div className="font-semibold text-sm">
                      {FEATURED_PRODUCTS[currentProduct].name}
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      Premium Quality
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Product Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {FEATURED_PRODUCTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProduct(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProduct 
                      ? 'bg-white scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

