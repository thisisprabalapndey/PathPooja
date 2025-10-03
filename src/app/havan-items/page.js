
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';
import { products } from '../../data/products';

export default function HavanItemsPage() {
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUserStore();

  // Filter products for Havan Items category
  const havanItems = products.filter(p => p.category === 'Havan Items');

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: product.originalPrice,
      quantity: 1
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-yellow-50/30 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 py-16 bg-gradient-to-br from-red-500 to-yellow-500 rounded-3xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="text-6xl mb-4">🔥</div>
            <h1 className="text-5xl font-bold mb-4">Sacred Havan Items</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Complete collection for sacred fire rituals and yagnas. 
              From pure havan samagri to copper vessels - everything for your spiritual fire ceremonies.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{havanItems.length}+</div>
                <div className="text-white/90">Fire Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">Pure</div>
                <div className="text-white/90">Ingredients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.7★</div>
                <div className="text-white/90">Sacred Rating</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {havanItems.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative"
            >
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id.toString())}
                className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
              >
                <Heart
                  size={18}
                  className={isInWishlist(product.id.toString()) 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-600 hover:text-red-500'
                  }
                />
              </button>

              <Link href={`/product/${product.slug}`}>
                <div className="cursor-pointer">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 space-y-2">
                      {product.discount > 0 && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {product.discount}% OFF
                        </div>
                      )}
                      {product.isBestseller && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          🔥 SACRED
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{product.rating}</span>
                      <span className="text-sm text-gray-400">({product.reviews})</span>
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Add to Cart Button */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white py-3 px-6 rounded-2xl font-bold hover:from-red-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

