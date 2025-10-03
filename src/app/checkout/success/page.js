
"use client";
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, Download, ArrowLeft, Star, Truck, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutSuccess() {
  const [orderNumber, setOrderNumber] = useState('');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  useEffect(() => {
    // Generate order number and delivery date
    setOrderNumber(`SN-${Date.now().toString().slice(-8)}`);
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
    setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            stiffness: 100,
            damping: 15 
          }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <CheckCircle size={48} className="text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Order Confirmed! 🎉
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-2"
          >
            Thank you for choosing StoreNova
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 inline-block shadow-lg border border-white/50"
          >
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 font-mono tracking-wider">
              {orderNumber}
            </p>
          </motion.div>
        </motion.div>

        {/* Order Details Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Mail className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h3 className="font-bold text-lg mb-2">Email Confirmation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We've sent a detailed confirmation email with your order receipt and tracking information.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center"
          >
            <motion.div
              whileHover={{ rotate: -10 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Truck className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="font-bold text-lg mb-2">Fast Shipping</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your order will be processed and shipped within 24 hours.
            </p>
            <div className="mt-3 p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700 font-medium">
                Estimated delivery: {estimatedDelivery}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-purple-600" />
            </motion.div>
            <h3 className="font-bold text-lg mb-2">Purchase Protection</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              30-day money-back guarantee and full purchase protection coverage.
            </p>
          </motion.div>
        </div>

        {/* Order Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">What happens next?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: "Order Processing", desc: "We prepare your items", icon: Package },
              { step: 2, title: "Quality Check", desc: "Each item is inspected", icon: Star },
              { step: 3, title: "Shipped", desc: "Your order is on its way", icon: Truck },
              { step: 4, title: "Delivered", desc: "Enjoy your purchase!", icon: CheckCircle }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3"
                  >
                    <Icon size={20} className="text-gray-600" />
                  </motion.div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
              >
                Continue Shopping
                <Package size={18} />
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-400 hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
            >
              <Download size={18} />
              Download Receipt
            </motion.button>
          </div>
          
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-600 hover:text-black transition-colors inline-flex items-center gap-2 mt-4"
            >
              <ArrowLeft size={16} />
              Back to Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Customer Service */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-12 p-6 bg-gray-900/5 rounded-2xl"
        >
          <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="mailto:support@storenova.com" className="text-blue-600 hover:text-blue-800 transition-colors">
              Email Support
            </a>
            <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-800 transition-colors">
              Call Us
            </a>
            <Link href="/help" className="text-blue-600 hover:text-blue-800 transition-colors">
              Help Center
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

