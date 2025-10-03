
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, Clock, X, Eye, RotateCcw, 
  MapPin, CreditCard, Phone, Calendar, ArrowRight, Filter,
  Search, Download, Star, MessageCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/user';

export default function OrdersPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const { orders, profile, cancelOrder, isAuthenticated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug log to check orders
  console.log('🔍 Orders Debug:', { orders, ordersLength: orders?.length, isAuthenticated });

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sacred orders...</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    placed: { 
      color: 'blue', 
      icon: Clock, 
      label: 'Order Placed',
      description: 'Your order has been received'
    },
    confirmed: { 
      color: 'purple', 
      icon: CheckCircle, 
      label: 'Confirmed',
      description: 'Order confirmed by merchant'
    },
    processing: { 
      color: 'yellow', 
      icon: Package, 
      label: 'Processing',
      description: 'Items being blessed and packed'
    },
    shipped: { 
      color: 'orange', 
      icon: Truck, 
      label: 'Shipped',
      description: 'Order is on the way'
    },
    delivered: { 
      color: 'green', 
      icon: CheckCircle, 
      label: 'Delivered',
      description: 'Order successfully delivered'
    },
    cancelled: { 
      color: 'red', 
      icon: X, 
      label: 'Cancelled',
      description: 'Order has been cancelled'
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders?.length || 0 },
    { id: 'delivered', label: 'Delivered', count: orders?.filter(o => o.status === 'delivered').length || 0 },
    { id: 'shipped', label: 'Shipped', count: orders?.filter(o => o.status === 'shipped').length || 0 },
    { id: 'processing', label: 'Processing', count: orders?.filter(o => o.status === 'processing').length || 0 },
    { id: 'cancelled', label: 'Cancelled', count: orders?.filter(o => o.status === 'cancelled').length || 0 }
  ];

  const filteredOrders = orders?.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = !searchQuery || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  }) || [];

  const handleOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleCancelOrder = (orderId, reason = 'Requested by customer') => {
    cancelOrder(orderId, reason);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sacred Orders</h1>
              <p className="text-gray-600">Track and manage your spiritual purchases</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all">
                <Download size={16} />
                Export Orders
              </button>
              <Link href="/profile">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-xl transition-all">
                  <ArrowRight size={16} />
                  Back to Profile
                </button>
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeFilter === filter.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                  }`}
                >
                  <Filter size={16} />
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center"
          >
            <Package size={64} className="text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {activeFilter === 'all' ? 'No Orders Found' : `No ${filterOptions.find(f => f.id === activeFilter)?.label} Orders`}
            </h3>
            <p className="text-gray-600 mb-8">
              {searchQuery 
                ? `No orders match your search "${searchQuery}"`
                : activeFilter === 'all' 
                  ? 'Start your spiritual shopping journey!'
                  : `You don't have any ${activeFilter} orders yet.`
              }
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              🕉️ Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => {
                const statusInfo = statusConfig[order.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
                  >
                    <div className="p-8">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}>
                              <StatusIcon size={16} />
                              {statusInfo.label}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>Ordered on {formatDate(order.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package size={14} />
                              <span>{order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">₹{order.total}</div>
                            {order.savedAmount > 0 && (
                              <div className="text-sm text-green-600">Saved ₹{order.savedAmount}</div>
                            )}
                          </div>
                          <button
                            onClick={() => handleOrderDetails(order)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-all"
                          >
                            <Eye size={16} />
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center&q=80';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                <span>₹{item.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl">
                            <span className="text-gray-600">+{order.items.length - 3} more items</span>
                          </div>
                        )}
                      </div>

                      {/* Order Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        {order.status === 'shipped' && order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                          >
                            <Truck size={16} />
                            Track Order
                          </a>
                        )}
                        
                        {order.canCancel && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                          >
                            <X size={16} />
                            Cancel Order
                          </button>
                        )}

                        {order.canReturn && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition-all">
                            <RotateCcw size={16} />
                            Return Items
                          </button>
                        )}

                        {order.status === 'delivered' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-all">
                            <Star size={16} />
                            Rate & Review
                          </button>
                        )}

                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all">
                          <MessageCircle size={16} />
                          Need Help?
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all">
                          <RefreshCw size={16} />
                          Reorder
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && selectedOrder && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowOrderDetails(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                    <button
                      onClick={() => setShowOrderDetails(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Order Summary */}
                    <div className="lg:col-span-2 space-y-8">
                      
                      {/* Order Items */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
                        <div className="space-y-4">
                          {selectedOrder.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 rounded-xl object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center&q=80';
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-orange-600">₹{item.price}</span>
                                    {item.originalPrice > item.price && (
                                      <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Order Timeline</h3>
                        <div className="space-y-4">
                          {selectedOrder.statusHistory.map((status, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className={`w-3 h-3 rounded-full mt-2 ${
                                status.status === selectedOrder.status ? 'bg-orange-500' : 'bg-green-500'
                              }`}></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-semibold text-gray-900">{status.description}</h4>
                                  {status.trackingId && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                      {status.trackingId}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{formatDateTime(status.date)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Order Info Sidebar */}
                    <div className="space-y-6">
                      
                      {/* Order Summary */}
                      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                        <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span>Order Number:</span>
                            <span className="font-medium">{selectedOrder.orderNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Order Date:</span>
                            <span className="font-medium">{formatDate(selectedOrder.date)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{selectedOrder.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-₹{selectedOrder.discount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delivery:</span>
                            <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}</span>
                          </div>
                          <div className="border-t border-orange-200 pt-3 flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-orange-600">₹{selectedOrder.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                          <MapPin size={18} />
                          Delivery Address
                        </h3>
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{selectedOrder.deliveryAddress.name}</p>
                          <p>{selectedOrder.deliveryAddress.address}</p>
                          <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state}</p>
                          <p>PIN: {selectedOrder.deliveryAddress.pincode}</p>
                          <p className="flex items-center gap-1 pt-2">
                            <Phone size={14} />
                            {selectedOrder.deliveryAddress.phone}
                          </p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                          <CreditCard size={18} />
                          Payment Method
                        </h3>
                        <div className="text-sm space-y-1">
                          <p className="font-medium">{selectedOrder.paymentMethod.type}</p>
                          <p>{selectedOrder.paymentMethod.details}</p>
                          <p className="text-gray-500">Transaction ID: {selectedOrder.paymentMethod.transactionId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

