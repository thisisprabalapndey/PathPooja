
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Plus, Edit, Trash2, Home, Building, Users, Star, 
  ArrowRight, Check, X, Phone, Navigation, Copy, Search,
  Filter, MoreVertical, Shield, Truck, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/user';

export default function AddressesPage() {
  const [isClient, setIsClient] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'home'
  });

  const { 
    addresses, 
    profile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    getDefaultAddress
  } = useUserStore();
  
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your saved addresses...</p>
        </div>
      </div>
    );
  }

  const addressTypeIcons = {
    home: Home,
    office: Building,
    other: Users
  };

  const addressTypeLabels = {
    home: 'Home',
    office: 'Office',
    other: 'Other'
  };

  const addressTypeColors = {
    home: 'text-green-600 bg-green-50 border-green-200',
    office: 'text-blue-600 bg-blue-50 border-blue-200',
    other: 'text-purple-600 bg-purple-50 border-purple-200'
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const filteredAddresses = addresses?.filter(address => {
    const matchesSearch = !searchQuery || 
      address.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.addressLine1.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || address.addressType === filterType;
    
    return matchesSearch && matchesFilter;
  }) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
    } else {
      addAddress(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      label: '',
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      addressType: 'home'
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address) => {
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark,
      addressType: address.addressType
    });
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddress(addressId);
    }
  };

  const handleSetDefault = (addressId) => {
    setDefaultAddress(addressId);
  };

  const copyAddress = (address) => {
    const fullAddress = `${address.name}\n${address.addressLine1}\n${address.addressLine2 ? address.addressLine2 + '\n' : ''}${address.city}, ${address.state} ${address.pincode}\nPhone: ${address.phone}`;
    navigator.clipboard.writeText(fullAddress);
  };

  const filterOptions = [
    { id: 'all', label: 'All Addresses', count: addresses?.length || 0 },
    { id: 'home', label: 'Home', count: addresses?.filter(a => a.addressType === 'home').length || 0 },
    { id: 'office', label: 'Office', count: addresses?.filter(a => a.addressType === 'office').length || 0 },
    { id: 'other', label: 'Other', count: addresses?.filter(a => a.addressType === 'other').length || 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
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
            <span className="text-gray-900 font-medium">My Addresses</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MapPin className="text-orange-500" size={32} />
                My Delivery Addresses
              </h1>
              <p className="text-gray-600">
                Manage your delivery addresses for faster checkout
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              <Plus size={20} />
              Add New Address
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <MapPin className="text-orange-500" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{addresses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Total Addresses</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Home className="text-green-500" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{addresses?.filter(a => a.addressType === 'home').length || 0}</div>
                  <div className="text-sm text-gray-600">Home</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Building className="text-blue-500" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{addresses?.filter(a => a.addressType === 'office').length || 0}</div>
                  <div className="text-sm text-gray-600">Office</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Star className="text-purple-500" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">1</div>
                  <div className="text-sm text-gray-600">Default</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          {addresses?.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search addresses by name, city, or label..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                      filterType === filter.id
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
          )}
        </motion.div>

        {/* Address List */}
        {filteredAddresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center"
          >
            {addresses?.length === 0 ? (
              <>
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <MapPin size={48} className="text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No Addresses Added</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Add your delivery addresses to make checkout faster and ensure your sacred items reach you safely.
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddForm(true);
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Your First Address
                </button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Addresses Found</h3>
                <p className="text-gray-600 mb-6">
                  No addresses match your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                  }}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
                >
                  Clear Filters
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredAddresses.map((address, index) => {
                const IconComponent = addressTypeIcons[address.addressType];
                
                return (
                  <motion.div
                    key={address.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${
                      address.isDefault ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-6">
                      {/* Address Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${addressTypeColors[address.addressType]}`}>
                            <IconComponent size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{address.label}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${addressTypeColors[address.addressType]}`}>
                              {addressTypeLabels[address.addressType]}
                            </span>
                          </div>
                        </div>
                        
                        {address.isDefault && (
                          <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                            <Star size={12} className="fill-current" />
                            DEFAULT
                          </div>
                        )}
                      </div>

                      {/* Address Details */}
                      <div className="space-y-2 mb-6">
                        <p className="font-semibold text-gray-900">{address.name}</p>
                        <div className="text-gray-600 text-sm space-y-1">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.pincode}</p>
                          {address.landmark && <p className="text-gray-500">Near {address.landmark}</p>}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                          <Phone size={14} />
                          <span>{address.phone}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-2xl font-bold transition-all"
                          >
                            <Star size={16} />
                            Set as Default
                          </button>
                        )}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(address)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-2xl font-bold transition-all"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => copyAddress(address)}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl font-bold transition-all"
                          >
                            <Copy size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Add/Edit Address Modal */}
        <AnimatePresence>
          {showAddForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetForm}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 bg-white rounded-3xl shadow-2xl z-50 overflow-y-auto"
              >
                <div className="p-8">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Address Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(addressTypeLabels).map(([type, label]) => {
                          const IconComponent = addressTypeIcons[type];
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setFormData({ ...formData, addressType: type })}
                              className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                formData.addressType === type
                                  ? addressTypeColors[type]
                                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <IconComponent size={20} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Label */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="e.g., Home, Office, Mom's House"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Name and Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Address Lines */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        placeholder="House/Flat/Office No., Building Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        placeholder="Street, Area, Locality (Optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Enter city"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          required
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select State</option>
                          {indianStates.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          placeholder="123456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Landmark
                      </label>
                      <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        placeholder="e.g., Near Temple, Metro Station (Optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-6">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 py-4 px-6 border border-gray-300 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={20} />
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Trust Section */}
        {addresses?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 bg-white rounded-3xl shadow-xl border border-gray-200 p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🔒 Your Addresses Are Safe</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-green-500" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Secure Storage</h4>
                <p className="text-gray-600 text-sm">Your addresses are encrypted and stored securely</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck size={24} className="text-blue-500" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Fast Checkout</h4>
                <p className="text-gray-600 text-sm">Quick delivery selection during checkout</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} className="text-orange-500" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Time Saving</h4>
                <p className="text-gray-600 text-sm">No need to enter address details every time</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

