"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';

export default function ProductCard({ product, index = 0 }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUserStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle different image structures (single image vs array)
  const getProductImages = () => {
    if (product.images && Array.isArray(product.images)) {
      return product.images;
    }
    return product.image ? [product.image] : ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80'];
  };

  const productImages = getProductImages();
  const currentImage = productImages[selectedImageIndex] || productImages[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      originalPrice: product.originalPrice,
      quantity: 1
    });
    console.log('🛒 Added to sacred cart:', product.name);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart first
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      originalPrice: product.originalPrice,
      quantity: 1
    });
    
    console.log('⚡ Buy Now clicked for:', product.name);
    
    // Redirect to checkout immediately
    setTimeout(() => {
      router.push('/checkout');
    }, 100);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isClient) {
      toggleWishlist(product.id.toString());
    }
  };

  const safeIsInWishlist = () => {
    if (!isClient) return false;
    return isInWishlist(product.id.toString());
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80';

  return (
    <Link href={`/product/${product.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 hover:border-orange-200"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
          <Image
            src={imageError ? fallbackImage : currentImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Wishlist Button */}
          {isClient && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            >
              <Heart 
                size={16} 
                className={`transition-colors ${
                  safeIsInWishlist() ? 'text-red-500 fill-red-500' : 'text-gray-700'
                }`} 
              />
            </motion.button>
          )}

          {/* Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {product.discount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {product.discount}% OFF
              </div>
            )}
            {product.isNew && (
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                NEW
              </div>
            )}
            {product.isBestseller && (
              <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ⭐ BESTSELLER
              </div>
            )}
          </div>

          {/* Image Dots */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImageIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all shadow-sm ${
                    selectedImageIndex === index ? 'bg-white' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">
            {product.category}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">{product.rating}</span>
            {product.reviews && (
              <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {product.features.length > 2 && (
                  <span className="text-xs text-gray-500">+{product.features.length - 2}</span>
                )}
              </div>
            </div>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-600">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            
            <div className="text-xs">
              {(product.inStock !== false) ? (
                <span className="text-green-600 font-medium">✓ In Stock</span>
              ) : (
                <span className="text-red-500 font-medium">✗ Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Buy Now Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              disabled={product.inStock === false}
              className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                (product.inStock !== false)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-xl'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Zap size={18} />
              {(product.inStock !== false) ? 'Buy Now' : 'Out of Stock'}
            </motion.button>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.inStock === false}
              className={`w-full py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                (product.inStock !== false)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-xl'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={18} />
              {(product.inStock !== false) ? 'Add to Cart' : 'Out of Stock'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

