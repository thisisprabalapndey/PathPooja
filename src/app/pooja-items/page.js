"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Star, Heart, ShoppingCart, ArrowRight, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';
import { products } from '../../data/products';

export default function PoojaItemsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isClient, setIsClient] = useState(false); // Add client-side flag
  
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUserStore();

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filter products for Pooja Items category
  const poojaItems = products.filter(p => p.category === 'Pooja Items');

  // Get unique subcategories
  const subcategories = [...new Set(poojaItems.map(p => p.subcategory))];

  // Filter and sort products
  let filteredProducts = poojaItems;

  if (selectedSubcategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.subcategory === selectedSubcategory);
  }

  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    filteredProducts = filteredProducts.filter(p => {
      if (max) return p.price >= min && p.price <= max;
      return p.price >= min;
    });
  }

  // Sort products
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default: // featured
      filteredProducts.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  }

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

  const handleToggleWishlist = (productId) => {
    // Only allow wishlist operations after client hydration
    if (isClient) {
      toggleWishlist(productId.toString());
    }
  };

  // Safe wishlist check that doesn't cause hydration mismatch
  const safeIsInWishlist = (productId) => {
    // Always return false during SSR to prevent hydration mismatch
    if (!isClient) return false;
    return isInWishlist(productId.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 py-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <div className="text-6xl mb-4">🪔</div>
            <h1 className="text-5xl font-bold mb-4">Sacred Pooja Items</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Complete collection of authentic pooja essentials for your daily worship and festivals. 
              From traditional brass diyas to sacred chunris - blessed with devotion.
            </p>
            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{poojaItems.length}+</div>
                <div className="text-white/90">Sacred Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-white/90">Authentic</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.8★</div>
                <div className="text-white/90">Average Rating</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-md border border-gray-200"
          >
            <SlidersHorizontal size={20} />
            <span>Filters</span>
          </button>

          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Subcategory Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">🕉️ Sacred Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="subcategory"
                      value="all"
                      checked={selectedSubcategory === 'all'}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="mr-3"
                    />
                    <span>All Items ({poojaItems.length})</span>
                  </label>
                  {subcategories.map(sub => (
                    <label key={sub} className="flex items-center">
                      <input
                        type="radio"
                        name="subcategory"
                        value={sub}
                        checked={selectedSubcategory === sub}
                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                        className="mr-3"
                      />
                      <span>{sub} ({poojaItems.filter(p => p.subcategory === sub).length})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">💰 Price Range</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: '0-500', label: 'Under ₹500' },
                    { value: '500-1000', label: '₹500 - ₹1000' },
                    { value: '1000-2000', label: '₹1000 - ₹2000' },
                    { value: '2000', label: 'Above ₹2000' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.value}
                        checked={priceRange === range.value}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="mr-3"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">⚡ Quick Filters</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors">
                    🏆 Bestsellers
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
                    ✨ New Arrivals
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors">
                    🔥 On Sale
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Sort and View Controls */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                  {filteredProducts.length} Sacred Items Found
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                >
                  <option value="featured">🌟 Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="newest">✨ Newest First</option>
                </select>
                
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-600'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-6"
            }>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group relative ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Wishlist Button - Fixed hydration issue */}
                  {isClient && (
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <Heart
                        size={18}
                        className={safeIsInWishlist(product.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-600 hover:text-red-500'
                        }
                      />
                    </button>
                  )}

                  {/* Show placeholder during SSR */}
                  {!isClient && (
                    <div className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <Heart
                        size={18}
                        className="text-gray-600"
                      />
                    </div>
                  )}

                  <Link href={`/product/${product.slug}`}>
                    <div className={`cursor-pointer ${viewMode === 'list' ? 'flex w-full' : ''}`}>
                      <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                            viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
                          }`}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 space-y-2">
                          {product.discount > 0 && (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              {product.discount}% OFF
                            </div>
                          )}
                          {product.isNew && (
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              NEW
                            </div>
                          )}
                          {product.isBestseller && (
                            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              ⭐ BESTSELLER
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
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
                        <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        {/* Description (List view only) */}
                        {viewMode === 'list' && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        
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
                  <div className={`${viewMode === 'list' ? 'p-6 flex items-end' : 'px-6 pb-6'}`}>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more sacred items.</p>
                <button
                  onClick={() => {
                    setSelectedSubcategory('all');
                    setPriceRange('all');
                  }}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
