
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Share2, ArrowLeft, Plus, Minus, Package, Truck, Shield, RotateCcw, Award, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '../../../store/cart';
import { useUserStore } from '../../../store/user';
import { products } from '../../../data/products';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUserStore();

  useEffect(() => {
    setIsClient(true);
    setIsLoading(false);
  }, []);

  // Debug logs to help troubleshoot
  console.log('🔍 Product Page Debug:');
  console.log('Looking for product with slug:', params.slug);
  console.log('Available products:', products.length);
  console.log('Available slugs:', products.map(p => p.slug));

  // Find product by slug
  const product = products.find(p => p.slug === params.slug);
  console.log('Found product:', product ? product.name : 'NOT FOUND');

  // If product not found, show detailed 404
  if (!isLoading && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sacred Item Not Found</h1>
          <p className="text-gray-600 mb-4">We couldn't find the product with slug:</p>
          <code className="bg-gray-100 px-3 py-2 rounded-lg text-orange-600 mb-6 block text-sm">
            {params.slug}
          </code>
          
          <div className="space-y-4">
            <Link href="/search">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all w-full">
                🔍 Search Sacred Products
              </button>
            </Link>
            <Link href="/pooja-items">
              <button className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-all w-full">
                🪔 Browse Pooja Items
              </button>
            </Link>
            <Link href="/">
              <button className="border-2 border-gray-300 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all w-full">
                🕉️ Return Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sacred product...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: product.originalPrice,
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    // Add to cart first
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: product.originalPrice,
      quantity: quantity
    });
    
    console.log('⚡ Buy Now clicked for:', product.name, 'Quantity:', quantity);
    
    // Redirect to checkout immediately
    setTimeout(() => {
      router.push('/checkout');
    }, 100);
  };

  const handleToggleWishlist = () => {
    if (isClient) {
      toggleWishlist(product.id.toString());
    }
  };

  const safeIsInWishlist = () => {
    if (!isClient) return false;
    return isInWishlist(product.id.toString());
  };

  // Get product images (handle both single image and array)
  const productImages = Array.isArray(product.images) ? product.images : [product.image];
  
  // Related products (same category)
  const relatedProducts = products.filter(p => 
    p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-gray-600 mb-8"
        >
          <Link href="/" className="hover:text-orange-600 transition-colors">🏠 Home</Link>
          <ChevronRight size={16} />
          <Link href="/search" className="hover:text-orange-600 transition-colors">🔍 Search</Link>
          <ChevronRight size={16} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-orange-500 shadow-lg' : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Product Header */}
            <div>
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                {product.isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">NEW</span>
                )}
                {product.isBestseller && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">⭐ BESTSELLER</span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">{product.discount}% OFF</span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{product.rating}</span>
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-orange-600">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">✨ Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.material && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">Material:</span>
                  <p className="text-gray-700">{product.material}</p>
                </div>
              )}
              {product.dimensions && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">Dimensions:</span>
                  <p className="text-gray-700">{product.dimensions}</p>
                </div>
              )}
              {product.weight && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">Weight:</span>
                  <p className="text-gray-700">{product.weight}</p>
                </div>
              )}
              {product.occasion && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-900">Perfect For:</span>
                  <p className="text-gray-700">{product.occasion.join(', ')}</p>
                </div>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="font-bold text-gray-900">Quantity:</label>
                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Buy Now Button - Primary */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <Zap size={20} />
                  Buy Now - Express Checkout
                </motion.button>

                {/* Secondary Actions */}
                <div className="flex gap-4">
                  {/* Add to Cart */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart size={20} />
                    Add to Sacred Cart
                  </motion.button>

                  {/* Wishlist */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleWishlist}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      safeIsInWishlist() 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart size={20} className={safeIsInWishlist() ? 'fill-current' : ''} />
                  </motion.button>

                  {/* Share */}
                  <button className="p-4 rounded-2xl border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <Truck className="text-orange-500" size={24} />
                <div>
                  <div className="font-bold text-gray-900">Fast Delivery</div>
                  <div className="text-sm text-gray-600">2-3 Days</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <Shield className="text-green-500" size={24} />
                <div>
                  <div className="font-bold text-gray-900">100% Authentic</div>
                  <div className="text-sm text-gray-600">Blessed Quality</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <RotateCcw className="text-blue-500" size={24} />
                <div>
                  <div className="font-bold text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">7-Day Policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-md">
                <Award className="text-purple-500" size={24} />
                <div>
                  <div className="font-bold text-gray-900">Blessed</div>
                  <div className="text-sm text-gray-600">Before Dispatch</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">🕉️ More Sacred Items Like This</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <motion.div
                  key={relatedProduct.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <div className="cursor-pointer">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80';
                        }}
                      />
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-orange-600">₹{relatedProduct.price}</span>
                          {relatedProduct.originalPrice > relatedProduct.price && (
                            <span className="text-sm text-gray-500 line-through">₹{relatedProduct.originalPrice}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Back to Search */}
        <div className="text-center">
          <Link href="/search">
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2 mx-auto shadow-lg">
              <ArrowLeft size={20} />
              Continue Sacred Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

