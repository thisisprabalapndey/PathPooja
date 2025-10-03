
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Lock, CreditCard, Truck, MapPin, User, Mail, Phone, Wallet, Building, Smartphone, Banknote, ArrowRight, Gift, Shield } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../../store/cart';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 1, name: 'Shipping', icon: Truck },
  { id: 2, name: 'Payment', icon: CreditCard },
  { id: 3, name: 'Review', icon: Lock }
];

const PAYMENT_METHODS = [
  { 
    id: 'upi', 
    name: 'UPI Payment', 
    icon: Smartphone, 
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    color: 'green'
  },
  { 
    id: 'card', 
    name: 'Credit/Debit Card', 
    icon: CreditCard, 
    description: 'Visa, Mastercard, RuPay, Amex',
    color: 'blue'
  },
  { 
    id: 'wallet', 
    name: 'Digital Wallet', 
    icon: Wallet, 
    description: 'Paytm, Amazon Pay, Mobikwik',
    color: 'purple'
  },
  { 
    id: 'cod', 
    name: 'Cash on Delivery', 
    icon: Banknote, 
    description: 'Pay when product is delivered',
    color: 'orange'
  }
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Enhanced cart store access with proper compatibility
  const cartStore = useCartStore();
  const { 
    items = [], 
    isHydrated = false,
    getTotalPrice, 
    getTotalItems, 
    clearCart 
  } = cartStore;
  
  // Create cartItems alias for compatibility
  const cartItems = items || [];
  
  const router = useRouter();

  // Form data
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentData, setPaymentData] = useState({
    method: 'upi',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    upiId: '',
    codNote: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe redirect logic - wait for hydration and check cart
  useEffect(() => {
    if (isClient && isHydrated && cartItems.length === 0 && !orderComplete) {
      console.log('🔄 Redirecting - empty cart detected');
      router.push('/');
    }
  }, [isClient, isHydrated, cartItems.length, orderComplete, router]);

  // Show loading during initial hydration
  if (!isClient || !isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">🕉️ Loading sacred checkout...</p>
        </div>
      </div>
    );
  }

  // If cart is empty and no order completed, show empty message
  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Sacred Cart is Empty</h2>
          <p className="text-xl text-gray-600 mb-8">Add some blessed items to proceed to checkout</p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              🕉️ Continue Shopping
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Safe calculation of pricing with proper fallbacks
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const shippingCost = subtotal >= 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const finalTotal = subtotal + shippingCost + tax;
  const totalItems = getTotalItems ? getTotalItems() : cartItems.length;

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleOrderComplete();
    }
  };

  const handleOrderComplete = async () => {
    setIsProcessing(true);
    
    try {
      console.log('🕉️ Starting sacred order completion...');
      
      // Simulate order processing with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Prepare order data for completion
      const orderData = {
        items: [...cartItems],
        shippingInfo: shippingData,
        paymentInfo: {
          method: paymentData.method,
          ...(paymentData.method === 'card' && paymentData.cardNumber && {
            cardLastFour: paymentData.cardNumber.slice(-4)
          }),
          ...(paymentData.method === 'upi' && paymentData.upiId && {
            upiId: paymentData.upiId
          })
        },
        totals: {
          subtotal,
          shippingCost,
          tax,
          finalTotal
        },
        completedAt: new Date().toISOString(),
        orderNumber: `PJ${Date.now().toString().slice(-6)}`
      };
      
      console.log('📦 Order data prepared:', orderData);
      
      // Clear cart and complete order
      if (clearCart) {
        clearCart(orderData);
      }
      
      setOrderComplete(true);
      setIsProcessing(false);
      
      console.log('✅ Order completed successfully!');
      
      // Show success for 3 seconds then redirect
      setTimeout(() => {
        console.log('🔄 Redirecting to homepage...');
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Order processing failed:', error);
      setIsProcessing(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return shippingData.firstName && 
               shippingData.lastName && 
               shippingData.email && 
               shippingData.address && 
               shippingData.phone &&
               shippingData.city &&
               shippingData.state &&
               shippingData.zipCode;
      case 2:
        if (paymentData.method === 'card') {
          return paymentData.cardNumber && 
                 paymentData.expiryDate && 
                 paymentData.cvv && 
                 paymentData.cardName;
        }
        if (paymentData.method === 'upi') {
          return paymentData.upiId && paymentData.upiId.includes('@');
        }
        return true; // COD and wallet don't need validation
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingData(prev => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      setPaymentData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Show order success
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-2xl mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-6xl"
            >
              ✅
            </motion.div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            🎉 Order Placed Successfully!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Your sacred items are being prepared with love and care. You'll receive a confirmation email shortly.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-green-200 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">PJ{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items Ordered:</span>
                <span className="font-medium">{totalItems} sacred items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600 text-lg">₹{finalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expected Delivery:</span>
                <span className="font-medium">3-5 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{PAYMENT_METHODS.find(m => m.id === paymentData.method)?.name}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-500 mb-6"
          >
            Redirecting to homepage in a moment... ⏳
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-orange-600 font-medium"
          >
            🕉️ Om Namah Shivaya • Jay Mata Di 🕉️
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Processing Overlay */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-12 text-center shadow-2xl max-w-md mx-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"
                />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Processing Your Sacred Order</h3>
                <p className="text-gray-600 mb-4">Please wait while we confirm your payment...</p>
                <div className="text-sm text-orange-600 font-medium">
                  🕉️ Blessing your transaction...
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Sacred Checkout 🕉️</h1>
          <p className="text-xl text-gray-600">Complete your spiritual shopping journey</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center space-x-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all ${
                      isActive 
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                        : isCompleted 
                          ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/25'
                          : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    <Icon size={24} />
                  </motion.div>
                  <span className={`ml-3 font-bold text-lg ${
                    isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </span>
                  
                  {index < STEPS.length - 1 && (
                    <motion.div 
                      className={`ml-8 w-20 h-1 rounded-full transition-colors duration-500 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
              >
                
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                      <Truck size={32} className="text-orange-500" />
                      Delivery Address
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          placeholder="Enter your first name"
                          value={shippingData.firstName}
                          onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          placeholder="Enter your last name"
                          value={shippingData.lastName}
                          onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={shippingData.email}
                          onChange={(e) => handleInputChange('shipping', 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={shippingData.phone}
                          onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                        <textarea
                          placeholder="House no, Street, Area, Landmark"
                          value={shippingData.address}
                          onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          placeholder="Mumbai"
                          value={shippingData.city}
                          onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State & PIN Code *</label>
                        <input
                          type="text"
                          placeholder="Maharashtra 400001"
                          value={`${shippingData.state} ${shippingData.zipCode}`.trim()}
                          onChange={(e) => {
                            const parts = e.target.value.split(' ');
                            const pincode = parts.pop() || '';
                            const state = parts.join(' ') || '';
                            handleInputChange('shipping', 'state', state);
                            handleInputChange('shipping', 'zipCode', pincode);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                      <CreditCard size={32} className="text-orange-500" />
                      Payment Method
                    </h2>
                    
                    {/* Payment Method Selection */}
                    <div className="mb-8">
                      <div className="grid md:grid-cols-2 gap-4">
                        {PAYMENT_METHODS.map((method, index) => {
                          const Icon = method.icon;
                          return (
                            <motion.button
                              key={method.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleInputChange('payment', 'method', method.id)}
                              className={`p-6 border-2 rounded-2xl transition-all ${
                                paymentData.method === method.id
                                  ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <Icon 
                                  size={32} 
                                  className={paymentData.method === method.id ? 'text-orange-600' : 'text-gray-400'} 
                                />
                                <div className="text-left">
                                  <p className={`font-bold text-lg ${paymentData.method === method.id ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {method.name}
                                  </p>
                                  <p className="text-sm text-gray-500">{method.description}</p>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Payment Details */}
                    <AnimatePresence mode="wait">
                      {paymentData.method === 'card' && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              value={paymentData.cardNumber}
                              onChange={(e) => handleInputChange('payment', 'cardNumber', formatCardNumber(e.target.value))}
                              maxLength={19}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={paymentData.expiryDate}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/\D/g, '');
                                  if (value.length >= 2) {
                                    value = value.substring(0,2) + '/' + value.substring(2,4);
                                  }
                                  handleInputChange('payment', 'expiryDate', value);
                                }}
                                maxLength={5}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                              <input
                                type="text"
                                placeholder="123"
                                value={paymentData.cvv}
                                onChange={(e) => handleInputChange('payment', 'cvv', e.target.value.replace(/\D/g, '').slice(0,3))}
                                maxLength={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                            <input
                              type="text"
                              placeholder="John Doe"
                              value={paymentData.cardName}
                              onChange={(e) => handleInputChange('payment', 'cardName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                        </motion.div>
                      )}

                      {paymentData.method === 'upi' && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                            <input
                              type="text"
                              placeholder="yourname@paytm / yourname@oksbi"
                              value={paymentData.upiId}
                              onChange={(e) => handleInputChange('payment', 'upiId', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 transition-all"
                            />
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                            <p className="text-green-800 font-medium mb-2">📱 Quick UPI Payment</p>
                            <p className="text-green-700 text-sm">
                              You will be redirected to your UPI app to complete the payment securely.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {paymentData.method === 'wallet' && (
                        <motion.div
                          key="wallet"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center">
                            <Wallet className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                            <h3 className="font-bold text-purple-900 mb-2">Digital Wallet Payment</h3>
                            <p className="text-purple-800 text-sm">
                              Choose your preferred wallet on the next step
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {paymentData.method === 'cod' && (
                        <motion.div
                          key="cod"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
                            <Banknote className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                            <h3 className="font-bold text-orange-900 mb-2 text-xl">Cash on Delivery</h3>
                            <p className="text-orange-800 mb-4">
                              💰 Pay when your sacred items are delivered to your doorstep
                            </p>
                            <div className="text-sm text-orange-700 bg-orange-100 rounded-xl p-3">
                              <strong>Note:</strong> COD available for orders above ₹200. Additional handling charges of ₹20 may apply.
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Special Delivery Instructions (Optional)</label>
                            <textarea
                              placeholder="Any special instructions for delivery?"
                              value={paymentData.codNote}
                              onChange={(e) => handleInputChange('payment', 'codNote', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                      <Lock size={32} className="text-orange-500" />
                      Review Your Order
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="p-6 bg-orange-50 rounded-2xl border border-orange-200">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                          <Truck size={20} className="text-orange-600" />
                          Delivery Address
                        </h3>
                        <div className="text-gray-700 space-y-1">
                          <p className="font-medium text-lg">{shippingData.firstName} {shippingData.lastName}</p>
                          <p>{shippingData.address}</p>
                          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                          <p className="flex items-center gap-2">
                            <Phone size={16} />
                            {shippingData.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail size={16} />
                            {shippingData.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                          <CreditCard size={20} className="text-blue-600" />
                          Payment Method
                        </h3>
                        <div className="text-gray-700">
                          <p className="font-medium text-lg">{PAYMENT_METHODS.find(m => m.id === paymentData.method)?.name}</p>
                          {paymentData.method === 'card' && paymentData.cardNumber && (
                            <p className="text-sm mt-1">Card ending in {paymentData.cardNumber.slice(-4)}</p>
                          )}
                          {paymentData.method === 'upi' && paymentData.upiId && (
                            <p className="text-sm mt-1">UPI ID: {paymentData.upiId}</p>
                          )}
                          {paymentData.method === 'cod' && (
                            <p className="text-sm mt-1">💰 Pay when delivered</p>
                          )}
                        </div>
                      </div>

                      {/* Order Items Review */}
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200">
                        <h3 className="font-bold mb-4 text-gray-900">Order Items ({totalItems} items)</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-xl">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-orange-600">₹{item.price * item.quantity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1 || isProcessing}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                      currentStep === 1 || isProcessing 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'border-2 border-gray-300 hover:border-orange-500 hover:text-orange-600 text-gray-700'
                    }`}
                  >
                    ← Back
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: isStepValid(currentStep) && !isProcessing ? 1.02 : 1 }}
                    whileTap={{ scale: isStepValid(currentStep) && !isProcessing ? 0.98 : 1 }}
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep) || isProcessing}
                    className={`px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                      isStepValid(currentStep) && !isProcessing
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        🕉️ Complete Sacred Order
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 h-fit sticky top-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">🛒 Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.id}-summary`} className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                      <span className="font-bold text-orange-600">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charges</span>
                <span className="font-medium text-green-600">
                  {shippingCost === 0 ? 'FREE 🚚' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (18%)</span>
                <span className="font-medium">₹{tax}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-orange-600">₹{finalTotal}</span>
                </div>
              </div>
            </div>
            
            {/* Free Shipping Message */}
            {subtotal < 500 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700">
                  <Gift size={16} />
                  <span className="font-medium text-sm">
                    Add ₹{500 - subtotal} more for FREE delivery! 🚚
                  </span>
                </div>
              </div>
            )}
            
            {/* Savings Display */}
            {cartItems.some(item => item.originalPrice && item.originalPrice > item.price) && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Gift size={16} />
                  <span className="font-medium text-sm">
                    🎉 You're saving ₹{cartItems.reduce((total, item) => {
                      const original = item.originalPrice || item.price;
                      return total + ((original - item.price) * item.quantity);
                    }, 0)} on this order!
                  </span>
                </div>
              </div>
            )}
            
            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield size={16} className="text-green-500" />
                <span>100% Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={16} className="text-orange-500" />
                <span>Fast Delivery Across India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Gift size={16} className="text-purple-500" />
                <span>7-Day Easy Returns</span>
              </div>
            </div>
            
            {/* Spiritual Blessing */}
            <div className="mt-6 text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
              <p className="text-orange-800 font-medium text-sm">
                🕉️ Your order will be blessed before dispatch 🙏
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

