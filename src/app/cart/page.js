
"use client";
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, ArrowLeft, Lock, Truck, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const shippingCost = getTotalPrice() > 100 ? 0 : 9.99;
  const tax = getTotalPrice() * 0.08; // 8% tax
  const finalTotal = getTotalPrice() + shippingCost + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 11H6L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Continue Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4">
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{getTotalItems()} items in your cart</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Clear Cart Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cart Items</h2>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-6">
                    
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.category}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Color & Size */}
                      <div className="flex items-center gap-4 mb-4">
                        {item.selectedColor && (
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.selectedColor.value }}
                            />
                            <span className="text-sm text-gray-600">{item.selectedColor.name}</span>
                          </div>
                        )}
                        {item.selectedSize && (
                          <span className="text-sm text-gray-600">Size: {item.selectedSize}</span>
                        )}
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="mt-4 text-right">
                        <span className="text-sm text-gray-600">Item Total: </span>
                        <span className="font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-24"
          >
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            {/* Items Preview */}
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    {item.selectedColor && (
                      <div className="flex items-center gap-1 mt-1">
                        <div 
                          className="w-2 h-2 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.selectedColor.value }}
                        />
                        <span className="text-xs text-gray-500">{item.selectedColor.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <span className="font-semibold text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary Details */}
            <div className="space-y-3 mb-6 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                <span className="font-medium">{formatPrice(getTotalPrice())}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Free Shipping Banner */}
            {getTotalPrice() < 100 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  Add {formatPrice(100 - getTotalPrice())} more for <strong>FREE shipping!</strong>
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors mb-4 flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              Proceed to Checkout
            </motion.button>

            {/* Security Features */}
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>Secure SSL Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-blue-500" />
                <span>Free shipping on orders over $100</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

