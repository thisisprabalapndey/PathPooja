
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ShoppingCart, X, Star, Filter, Search, Grid, List, 
  ArrowRight, Share2, Gift, Trash2, Plus, Eye, Zap, Package,
  Calendar, TrendingUp, BookOpen, Sparkles, Copy, Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/user';
import { useCartStore } from '../../store/cart';
import { products } from '../../data/products';

export default function WishlistPage() {
  const [isClient, setIsClient] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { wishlist, removeFromWishlist, clearWishlist, profile } = useUserStore();
  const { addToCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sacred wishlist...</p>
        </div>
      </div>
    );
  }

  // Get wishlist products with full details
  const wishlistProducts = products.filter(product => 
    wishlist.includes(product.id.toString())
  );

  // Filter and sort wishlist products
  const filteredWishlist = wishlistProducts.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default: // newest
        return wishlist.indexOf(b.id.toString()) - wishlist.indexOf(a.id.toString());
    }
  });

  // Get unique categories from wishlist
  const wishlistCategories = ['all', ...new Set(wishlistProducts.map(p => p.category))];

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

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    setTimeout(() => {
      router.push('/checkout');
    }, 100);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId.toString());
    setSelectedItems(prev => prev.filter(id => id !== productId));
  };

  const handleBulkAddToCart = () => {
    selectedItems.forEach(productId => {
      const product = wishlistProducts.find(p => p.id === productId);
      if (product) {
        handleAddToCart(product);
      }
    });
    setSelectedItems([]);
  };

  const handleBulkRemove = () => {
    selectedItems.forEach(productId => {
      handleRemoveFromWishlist(productId);
    });
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredWishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredWishlist.map(p => p.id));
    }
  };

  const handleShareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist?shared=${profile?.name || 'user'}`;
    navigator.clipboard.writeText(wishlistUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sortOptions = [
    { value: 'newest', label: 'Recently Added' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  const totalWishlistValue = wishlistProducts.reduce((sum, product) => sum + product.price, 0);
  const totalSavingsValue = wishlistProducts.reduce((sum, product) => 
    sum + ((product.originalPrice || product.price) - product.price), 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-orange-600 transition-colors">🏠 Home</Link>
            <ArrowRight size={16} />
            <Link href="/profile" className="hover:text-orange-600 transition-colors">👤 Profile</Link>
            <ArrowRight size={16} />
            <span className="text-gray-900 font-medium">My Wishlist</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Heart className="text-red-500 fill-current" size={32} />
                My Sacred Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlistProducts.length} blessed items • Total value: ₹{totalWishlistValue.toLocaleString()}
                {totalSavingsValue > 0 && (
                  <span className="text-green-600 ml-2">• Potential savings: ₹{totalSavingsValue.toLocaleString()}</span>
                )}
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                >
                  <Share2 size={16} />
                  Share List
                </button>
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {wishlistProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Heart className="text-red-500" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{wishlistProducts.length}</div>
                    <div className="text-sm text-gray-600">Saved Items</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">₹{totalWishlistValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Gift className="text-green-500" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">₹{totalSavingsValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Potential Savings</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-purple-500" size={20} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{wishlistCategories.length - 1}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          {wishlistProducts.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {wishlistCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border-2 border-gray-200 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-orange-900">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    {selectedItems.length === filteredWishlist.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBulkAddToCart}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBulkRemove}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Wishlist Content */}
        <AnimatePresence>
          {filteredWishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center"
            >
              {wishlistProducts.length === 0 ? (
                // Empty wishlist
                <>
                  <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Heart size={48} className="text-red-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    Start saving your favorite spiritual products! Click the heart icon on any product to add it to your wishlist.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/search')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={20} />
                      Discover Sacred Products
                    </button>
                    <button
                      onClick={() => router.push('/profile')}
                      className="border-2 border-gray-300 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Back to Profile
                    </button>
                  </div>
                </>
              ) : (
                // No search results
                <>
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No Items Found</h3>
                  <p className="text-gray-600 mb-6">
                    No items in your wishlist match your search criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
                  >
                    Clear Filters
                  </button>
                </>
              )}
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' ? 
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 
              'space-y-6'
            }>
              {filteredWishlist.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative group ${
                    viewMode === 'list' ? 'flex items-center p-6' : ''
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(prev => [...prev, product.id]);
                        } else {
                          setSelectedItems(prev => prev.filter(id => id !== product.id));
                        }
                      }}
                      className="w-5 h-5 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X size={16} className="text-red-500" />
                  </button>

                  {viewMode === 'grid' ? (
                    <>
                      {/* Product Image */}
                      <Link href={`/product/${product.slug}`}>
                        <div className="relative aspect-square overflow-hidden cursor-pointer">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80';
                            }}
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-16 space-y-2">
                            {product.discount > 0 && (
                              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {product.discount}% OFF
                              </div>
                            )}
                            {product.isBestseller && (
                              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                ⭐ BESTSELLER
                              </div>
                            )}
                          </div>

                          {/* Quick Actions Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleBuyNow(product);
                              }}
                              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all"
                              title="Buy Now"
                            >
                              <Zap size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all"
                              title="Add to Cart"
                            >
                              <ShoppingCart size={16} />
                            </button>
                            <Link href={`/product/${product.slug}`}>
                              <button className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all" title="View Details">
                                <Eye size={16} />
                              </button>
                            </Link>
                          </div>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.reviews})</span>
                        </div>

                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => handleBuyNow(product)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                          >
                            <Zap size={16} />
                            Buy Now
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={16} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <>
                      <Link href={`/product/${product.slug}`}>
                        <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center&q=80';
                            }}
                          />
                        </div>
                      </Link>

                      <div className="flex-1 ml-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/product/${product.slug}`}>
                              <h3 className="font-bold text-gray-900 text-xl mb-2 hover:text-orange-600 transition-colors cursor-pointer">
                                {product.name}
                              </h3>
                            </Link>
                            
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
                              <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
                              {product.originalPrice > product.price && (
                                <span className="text-lg text-gray-500 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 ml-6">
                            <button
                              onClick={() => handleBuyNow(product)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
                            >
                              <Zap size={16} />
                              Buy Now
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
                            >
                              <ShoppingCart size={16} />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Quick Actions Bar */}
        {filteredWishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-4 flex items-center gap-6 z-40"
          >
            <div className="text-sm text-gray-600">
              {filteredWishlist.length} items • ₹{totalWishlistValue.toLocaleString()} total
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={() => {
                filteredWishlist.forEach(product => handleAddToCart(product));
              }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Add All to Cart
            </button>
          </motion.div>
        )}

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowShareModal(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 p-8 w-full max-w-md"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Wishlist</h3>
                  <p className="text-gray-600">Let others see your favorite spiritual products</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-2">Wishlist URL:</div>
                    <div className="flex items-center gap-2">
                      <input
                        readOnly
                        value={`poojapath.com/wishlist/${profile?.name || 'user'}`}
                        className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={handleShareWishlist}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all">
                      <span>📱</span> WhatsApp
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all">
                      <span>📧</span> Email
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all">
                      <span>🐦</span> Twitter
                    </button>
                    <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all">
                      <span>📋</span> Copy Link
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full mt-6 px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

