"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, SlidersHorizontal, Star, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products, categories, subcategories, priceRanges } from '../../data/products';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';

const SORT_OPTIONS = [
  { value: 'relevance', label: '🔍 Most Relevant' },
  { value: 'price-low', label: '💰 Price: Low to High' },
  { value: 'price-high', label: '💎 Price: High to Low' },
  { value: 'rating', label: '⭐ Highest Rated' },
  { value: 'newest', label: '✨ Newest First' },
  { value: 'bestseller', label: '🏆 Bestsellers' }
];

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [isClient, setIsClient] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showBestsellers, setShowBestsellers] = useState(false);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useUserStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Enhanced search function for spiritual products
  const searchMatches = (product, searchQuery) => {
    if (!searchQuery) return true;
    
    const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const searchableText = [
      product.name || '',
      product.category || '',
      product.subcategory || '',
      product.description || '',
      ...(product.tags || []),
      ...(product.features || []),
      ...(product.occasion || []),
      product.material || ''
    ].join(' ').toLowerCase();

    // Check if all search terms are found
    return searchTerms.every(term => searchableText.includes(term));
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      // Search query filter
      const matchesQuery = searchMatches(product, query);
      
      // Category filter
      const matchesCategory = selectedCategory === 'all' || product.category === categories.find(c => c.id === selectedCategory)?.name;
      
      // Subcategory filter
      const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
      
      // Price filter
      let matchesPrice = true;
      if (selectedPriceRange !== 'all') {
        const range = priceRanges.find(r => r.id === selectedPriceRange);
        if (range) {
          matchesPrice = product.price >= range.min && product.price <= range.max;
        }
      }
      
      // Rating filter
      const matchesRating = !product.rating || product.rating >= minRating;
      
      // Stock filter
      const matchesStock = !inStockOnly || product.inStock !== false;
      
      // Bestseller filter
      const matchesBestseller = !showBestsellers || product.isBestseller;
      
      return matchesQuery && matchesCategory && matchesSubcategory && matchesPrice && matchesRating && matchesStock && matchesBestseller;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'bestseller':
        filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      default:
        // For relevance, sort by search term matches and bestsellers
        if (query) {
          const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
          filtered.sort((a, b) => {
            const aMatches = searchTerms.filter(term => 
              (a.name + ' ' + (a.description || '')).toLowerCase().includes(term)
            ).length;
            const bMatches = searchTerms.filter(term => 
              (b.name + ' ' + (b.description || '')).toLowerCase().includes(term)
            ).length;
            if (aMatches !== bMatches) return bMatches - aMatches;
            return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
          });
        } else {
          filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        }
        break;
    }

    setFilteredProducts(filtered);
  }, [query, selectedCategory, selectedSubcategory, selectedPriceRange, minRating, inStockOnly, showBestsellers, sortBy]);

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
    if (isClient) {
      toggleWishlist(productId.toString());
    }
  };

  const safeIsInWishlist = (productId) => {
    if (!isClient) return false;
    return isInWishlist(productId.toString());
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedPriceRange('all');
    setMinRating(0);
    setInStockOnly(false);
    setShowBestsellers(false);
    setSortBy('relevance');
  };

  // Get available subcategories for selected category
  const availableSubcategories = selectedCategory === 'all' 
    ? []
    : subcategories[categories.find(c => c.id === selectedCategory)?.name] || [];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sacred search...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {query ? (
                  <>🔍 Search Results for <span className="text-orange-600">"{query}"</span></>
                ) : (
                  '🕉️ All Sacred Products'
                )}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} blessed items found
                {query && filteredProducts.length === 0 && (
                  <span className="block text-orange-600 mt-1">
                    Try searching for: "diya", "gita", "rudraksha", "chunri", or "havan"
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex border-2 border-gray-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <Filter size={18} />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className={`lg:block ${isFilterOpen ? 'block' : 'hidden'} lg:sticky lg:top-24 lg:h-fit`}>
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">🔧 Sacred Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">🕉️ Sacred Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category.id}
                          onChange={() => {
                            setSelectedCategory(category.id);
                            setSelectedSubcategory('all'); // Reset subcategory
                          }}
                          className="mr-3 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm">
                          {category.icon} {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcategory Filter */}
                {availableSubcategories.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">📂 Subcategories</h3>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          checked={selectedSubcategory === 'all'}
                          onChange={() => setSelectedSubcategory('all')}
                          className="mr-3 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm">All Subcategories</span>
                      </label>
                      {availableSubcategories.map(sub => (
                        <label key={sub} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="subcategory"
                            checked={selectedSubcategory === sub}
                            onChange={() => setSelectedSubcategory(sub)}
                            className="mr-3 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm">{sub}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">💰 Price Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === 'all'}
                        onChange={() => setSelectedPriceRange('all')}
                        className="mr-3 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm">All Prices</span>
                    </label>
                    {priceRanges.map(range => (
                      <label key={range.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={selectedPriceRange === range.id}
                          onChange={() => setSelectedPriceRange(range.id)}
                          className="mr-3 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">⭐ Minimum Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === rating}
                          onChange={() => setMinRating(rating)}
                          className="mr-3 text-orange-500 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                            />
                          ))}
                          <span className="text-sm ml-1">{rating === 0 ? 'All Ratings' : `${rating}+ stars`}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">⚡ Quick Filters</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="mr-3 text-orange-500 focus:ring-orange-500 rounded"
                      />
                      <span className="text-sm">📦 In stock only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showBestsellers}
                        onChange={(e) => setShowBestsellers(e.target.checked)}
                        className="mr-3 text-orange-500 focus:ring-orange-500 rounded"
                      />
                      <span className="text-sm">🏆 Bestsellers only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 relative group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Wishlist Button */}
                    <button
                      onClick={() => handleToggleWishlist(product.id)}
                      className="absolute top-4 right-4 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <Heart
                        size={16}
                        className={`transition-colors ${
                          safeIsInWishlist(product.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-600 hover:text-red-500'
                        }`}
                      />
                    </button>

                    <Link href={`/product/${product.slug || product.id}`}>
                      <div className={`cursor-pointer ${viewMode === 'list' ? 'flex w-full' : ''}`}>
                        <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                              viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
                            }`}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80';
                            }}
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 space-y-2">
                            {product.discount > 0 && (
                              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {product.discount}% OFF
                              </div>
                            )}
                            {product.isNew && (
                              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                NEW
                              </div>
                            )}
                            {product.isBestseller && (
                              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
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
                                  className={i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{product.rating || 4.5}</span>
                            <span className="text-sm text-gray-400">({product.reviews || 100})</span>
                          </div>
                          
                          {/* Product Name */}
                          <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          
                          {/* Description (List view only) */}
                          {viewMode === 'list' && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {product.description || 'Authentic spiritual product blessed for your sacred journey.'}
                            </p>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
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
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <SlidersHorizontal size={64} className="mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Sacred Items Found</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  {query ? `We couldn't find any products matching "${query}"` : 'Try adjusting your filters to discover more blessed items'}
                </p>
                
                {/* Suggested searches */}
                {query && (
                  <div className="mb-8">
                    <p className="text-gray-500 mb-4">🔍 Try these sacred searches:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {['diya', 'gita', 'rudraksha', 'chunri', 'havan', 'chandan', 'kalash'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => router.push(`/search?q=${suggestion}`)}
                          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors font-medium"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                >
                  🧹 Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
