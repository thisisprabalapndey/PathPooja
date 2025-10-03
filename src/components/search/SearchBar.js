"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { products } from '../../data/products';

export default function SearchBar({ isExpanded = false, onClose }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  // Enhanced spiritual search suggestions
  const spiritualSuggestions = [
    "🪔 Premium Brass Diya",
    "🌺 Mata Ki Chunri", 
    "📿 Rudraksha Mala",
    "🔥 Havan Samagri",
    "📖 Bhagavad Gita",
    "🕉️ Chandan Powder",
    "⚱️ Copper Kalash",
    "🎯 Hanuman Chalisa"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enhanced search with better matching
  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        
        const filteredResults = products.filter(product => {
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

          return searchTerms.some(term => searchableText.includes(term));
        }).slice(0, 8);
        
        // Sort by relevance (more matches = higher priority)
        filteredResults.sort((a, b) => {
          const aMatches = searchTerms.filter(term => 
            (a.name + ' ' + (a.description || '')).toLowerCase().includes(term)
          ).length;
          const bMatches = searchTerms.filter(term => 
            (b.name + ' ' + (b.description || '')).toLowerCase().includes(term)
          ).length;
          if (aMatches !== bMatches) return bMatches - aMatches;
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
        });
        
        setResults(filteredResults);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductClick = (product) => {
    console.log('🔍 SearchBar: Clicking product:', product.name);
    console.log('🔍 SearchBar: Product slug:', product.slug);
    console.log('🔍 SearchBar: Navigating to:', `/product/${product.slug}`);
    
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${product.slug}`);
  };

  const handleSuggestionClick = (suggestion) => {
    const cleanQuery = suggestion.replace(/[🪔🌺📿🔥📖🕉️⚱️🎯]/g, '').trim();
    setQuery(cleanQuery);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className={`relative flex items-center ${isExpanded ? 'mb-4' : ''}`}>
          <div className="absolute left-4 z-10">
            <Search size={20} className="text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for diyas, pooja items, holy books..."
            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
          
          {isExpanded && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-3 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {query.length === 0 ? (
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-orange-500" />
                  <h3 className="font-semibold text-gray-900">🕉️ Popular Spiritual Searches</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {spiritualSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-left p-3 hover:bg-orange-50 rounded-xl transition-colors text-sm text-gray-700 hover:text-orange-600 border border-transparent hover:border-orange-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-gray-600">🔍 Searching blessed products...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    <div className="text-sm text-gray-500 px-4 py-2 flex items-center justify-between">
                      <span>Found {results.length} sacred items</span>
                      {results.length === 8 && (
                        <button 
                          onClick={handleSearchSubmit}
                          className="text-orange-600 hover:text-orange-700 text-xs flex items-center gap-1 font-medium"
                        >
                          View All <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                    {results.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-orange-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center&q=80';
                            }}
                          />
                          {product.isBestseller && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h4 className="font-medium text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-orange-600 font-bold">₹{product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-gray-500 text-sm line-through">₹{product.originalPrice}</span>
                            )}
                            <span className="text-xs text-gray-400">• {product.subcategory || product.category}</span>
                          </div>
                        </div>
                        <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          {product.category}
                        </div>
                        <ArrowRight size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="font-bold text-gray-900 mb-2">No sacred items found</h3>
                    <p className="text-gray-600 text-sm mb-6">Try searching for "diya", "gita", "rudraksha", or "chunri"</p>
                    
                    {/* Quick suggestions */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {['diya', 'gita', 'rudraksha', 'chunri'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setQuery(suggestion)}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    
                    <button 
                      onClick={handleSearchSubmit}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg"
                    >
                      View All Search Results
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

