
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, Heart, ArrowRight, Sparkles, CreditCard, Gift, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';

export default function CartSidebar() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getCartSummary,
    isHydrated 
  } = useCartStore();
  
  const { addToWishlist } = useUserStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until hydrated
  if (!isClient || !isHydrated) {
    return null;
  }

  const summary = getCartSummary();

  const handleMoveToWishlist = (item) => {
    const productId = item.product?.id || item.id;
    addToWishlist(productId.toString());
    removeFromCart(productId);
  };

  // Enhanced checkout handler
  const handleProceedToCheckout = () => {
    if (!summary.isEmpty && summary.totalItems > 0) {
      closeCart(); // Close the sidebar first
      setTimeout(() => {
        router.push('/checkout'); // Navigate to checkout
      }, 200); // Small delay to ensure smooth transition
    }
  };

  // Helper function to get product image (handles both formats)
  const getProductImage = (item) => {
    // Try different possible image sources
    if (item.product?.images && item.product.images.length > 0) {
      return item.product.images[0]; // Array format
    }
    if (item.product?.image) {
      return item.product.image; // Single image format (our spiritual products)
    }
    if (item.image) {
      return item.image; // Direct image property
    }
    // Fallback spiritual image
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center&q=80';
  };

  // Helper function to get product name
  const getProductName = (item) => {
    return item.product?.name || item.name || 'Spiritual Product';
  };

  // Helper function to get product price
  const getProductPrice = (item) => {
    return item.product?.price || item.price || 0;
  };

  // Helper function to get original price
  const getOriginalPrice = (item) => {
    return item.product?.originalPrice || item.originalPrice || item.product?.price || item.price || 0;
  };

  // Calculate delivery info
  const deliveryFee = summary.totalPrice >= 500 ? 0 : 50;
  const finalTotal = summary.totalPrice + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sacred Cart</h2>
                  <p className="text-sm text-gray-600">{summary.totalItems} blessed {summary.totalItems === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2.5 hover:bg-white/70 rounded-full transition-all"
              >
                <X size={22} className="text-gray-600" />
              </button>
            </div>

            {/* Cart Content - Scrollable */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {summary.isEmpty ? (
                // Empty Cart State
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-sm">
                    <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <ShoppingBag size={36} className="text-orange-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Sacred Cart is Empty</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">Add some blessed items to begin your spiritual journey and experience divine shopping</p>
                    <button
                      onClick={closeCart}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full"
                    >
                      <Sparkles size={20} />
                      🕉️ Continue Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    <AnimatePresence>
                      {items.map((item, index) => {
                        const itemId = item.id || `item-${index}`;
                        const productId = item.product?.id || item.id;
                        
                        return (
                          <motion.div
                            key={itemId}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="group bg-gradient-to-r from-orange-50/60 to-red-50/60 rounded-2xl p-4 border border-orange-100 hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                          >
                            {/* Product Container */}
                            <div className="flex gap-4">
                              {/* Product Image */}
                              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                                <img
                                  src={getProductImage(item)}
                                  alt={getProductName(item)}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback to spiritual placeholder if image fails
                                    e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center&q=80';
                                  }}
                                />
                                {/* Sale badge */}
                                {getOriginalPrice(item) > getProductPrice(item) && (
                                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                                    SALE
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                {/* Product Name */}
                                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                                  {getProductName(item)}
                                </h3>
                                
                                {/* Price Row */}
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="font-bold text-orange-600 text-lg">₹{getProductPrice(item)}</span>
                                  {getOriginalPrice(item) > getProductPrice(item) && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{getOriginalPrice(item)}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Quantity & Actions Row */}
                                <div className="flex items-center justify-between">
                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm">
                                    <button
                                      onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                      className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all active:scale-95"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleMoveToWishlist(item)}
                                      className="p-2 hover:bg-white/80 rounded-full transition-all active:scale-95"
                                      title="Move to Wishlist"
                                    >
                                      <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
                                    </button>
                                    <button
                                      onClick={() => removeFromCart(productId)}
                                      className="p-2 hover:bg-white/80 rounded-full transition-all active:scale-95"
                                      title="Remove from Cart"
                                    >
                                      <Trash2 size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Cart Footer - Fixed */}
                  <div className="border-t border-gray-200 bg-gradient-to-r from-orange-50/30 to-red-50/30 shrink-0">
                    <div className="p-6 space-y-4">
                      
                      {/* Promotional Messages */}
                      <div className="space-y-3">
                        {/* Free shipping message */}
                        {summary.totalPrice < 500 && (
                          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2 text-blue-700">
                              <Truck size={16} />
                              <span className="text-sm font-medium">
                                Add ₹{500 - summary.totalPrice} more for FREE delivery! 🚚
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Savings message */}
                        {summary.savings > 0 && (
                          <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 text-green-700">
                              <Gift size={16} />
                              <span className="text-sm font-medium">
                                🎉 You're saving ₹{Math.round(summary.savings)} on this order!
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price Breakdown */}
                      <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal ({summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'})</span>
                          <span className="font-semibold text-gray-900">₹{summary.totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivery Charges</span>
                          <span className={`font-semibold ${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {deliveryFee === 0 ? 'FREE 🚚' : `₹${deliveryFee}`}
                          </span>
                        </div>
                        {summary.savings > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Total Savings</span>
                            <span className="font-semibold">-₹{Math.round(summary.savings)}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Grand Total</span>
                            <span className="text-2xl font-bold text-orange-600">₹{finalTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Primary Checkout Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleProceedToCheckout}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                        >
                          <CreditCard size={20} />
                          Proceed to Checkout
                          <ArrowRight size={20} />
                        </motion.button>
                        
                        {/* Secondary Actions */}
                        <div className="flex gap-3">
                          <button
                            onClick={closeCart}
                            className="flex-1 border-2 border-orange-500 text-orange-600 py-3 px-4 rounded-2xl font-bold hover:bg-orange-50 hover:border-orange-600 transition-all"
                          >
                            Continue Shopping
                          </button>
                          <button
                            onClick={clearCart}
                            className="px-4 py-3 border-2 border-gray-300 text-gray-600 rounded-2xl hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all"
                            title="Clear Entire Cart"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Trust Badges */}
                      <div className="flex items-center justify-center gap-6 text-xs text-gray-500 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Fast Delivery</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Easy Returns</span>
                        </div>
                      </div>

                      {/* Spiritual Blessing Message */}
                      <div className="text-center text-sm text-orange-700 bg-orange-50 py-3 px-4 rounded-xl font-medium border border-orange-100">
                        <span className="text-lg">🕉️</span> Your sacred order will be blessed before dispatch <span className="text-lg">🙏</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

