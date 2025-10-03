
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, Camera, Save, X, Star, Trophy, Gift, 
  ShoppingBag, Heart, Bell, Settings, Shield, CreditCard, Instagram, Twitter, 
  Youtube, Globe, BookOpen, Zap, TrendingUp, Award
} from 'lucide-react';
import { useUserStore } from '../../store/user';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editData, setEditData] = useState({});
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  
  const { profile, updateProfile, updateAvatar, wishlist } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (profile) {
      setEditData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.location?.address || '',
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        pincode: profile.location?.pincode || '',
        bio: profile.bio || '',
        interests: profile.interests?.join(', ') || ''
      });
    }
  }, [profile]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sacred profile...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile({
      name: editData.name,
      email: editData.email,
      phone: editData.phone,
      bio: editData.bio,
      interests: editData.interests.split(',').map(item => item.trim()).filter(item => item),
      location: {
        address: editData.address,
        city: editData.city,
        state: editData.state,
        pincode: editData.pincode
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.location?.address || '',
      city: profile.location?.city || '',
      state: profile.location?.state || '',
      pincode: profile.location?.pincode || '',
      bio: profile.bio || '',
      interests: profile.interests?.join(', ') || ''
    });
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open file picker and upload to cloud storage
    const newAvatar = `https://images.unsplash.com/photo-${Date.now() % 1000000 + 1500000000000}-1?w=150&h=150&fit=crop&crop=face&q=80`;
    updateAvatar(newAvatar);
    setShowAvatarUpload(false);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'orders', name: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const achievements = [
    { icon: Trophy, title: 'First Order', desc: 'Welcome to PoojaPath!', earned: true },
    { icon: Star, title: 'Loyal Customer', desc: '5+ orders completed', earned: profile?.stats?.totalOrders >= 5 },
    { icon: Gift, title: 'Big Spender', desc: 'Spent over ₹5000', earned: profile?.stats?.totalSpent >= 5000 },
    { icon: Heart, title: 'Wishlist Master', desc: '10+ items saved', earned: wishlist?.length >= 10 },
    { icon: BookOpen, title: 'Spiritual Reader', desc: 'Purchased holy books', earned: true },
    { icon: Zap, title: 'Quick Shopper', desc: 'Used Buy Now feature', earned: true }
  ];

  const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            
            {/* Avatar Section */}
            <div className="relative">
              <img
                src={profile?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face&q=80'}
                alt={profile?.name || 'Profile'}
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-200 shadow-lg"
              />
              <button 
                onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
              >
                <Camera size={16} />
              </button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
              
              {/* Avatar Upload Modal */}
              {showAvatarUpload && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border p-4 z-10 w-64">
                  <h4 className="font-semibold mb-3">Update Profile Picture</h4>
                  <div className="space-y-2">
                    <button 
                      onClick={handleAvatarChange}
                      className="w-full text-left p-2 hover:bg-orange-50 rounded-lg"
                    >
                      📸 Take Photo
                    </button>
                    <button 
                      onClick={handleAvatarChange}
                      className="w-full text-left p-2 hover:bg-orange-50 rounded-lg"
                    >
                      🖼️ Choose from Gallery
                    </button>
                    <button 
                      onClick={handleAvatarChange}
                      className="w-full text-left p-2 hover:bg-orange-50 rounded-lg"
                    >
                      🎨 Generate Avatar
                    </button>
                    <button 
                      onClick={() => setShowAvatarUpload(false)}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-gray-600"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.name || 'Prabal Pandey'}</h1>
                  <p className="text-gray-600 mb-2">{profile?.email || 'prabalpandey25@gmail.com'}</p>
                  
                  {/* Bio */}
                  {profile?.bio && (
                    <p className="text-gray-700 mb-3 text-sm leading-relaxed max-w-md">{profile.bio}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Joined {profile?.joinedDate || 'October 2024'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{profile?.location?.city || 'Kanpur'}, {profile?.location?.state || 'UP'}</span>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  {profile?.socialMedia && (
                    <div className="flex items-center gap-3 mb-4">
                      {Object.entries(profile.socialMedia).map(([platform, handle]) => {
                        const IconComponent = socialIcons[platform] || Globe;
                        return (
                          <a
                            key={platform}
                            href={`https://${platform}.com/${handle.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
                            title={`${platform}: ${handle}`}
                          >
                            <IconComponent size={16} className="text-gray-600 hover:text-orange-600" />
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Interests */}
                  {profile?.interests && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.interests.slice(0, 4).map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                      {profile.interests.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{profile.interests.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all"
                >
                  <Edit size={16} />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">{profile?.stats?.totalOrders || 0}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                  <div className="text-2xl font-bold text-red-600">₹{profile?.stats?.totalSpent || 0}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                  <div className="text-2xl font-bold text-green-600">₹{profile?.stats?.savedAmount || 0}</div>
                  <div className="text-sm text-gray-600">Money Saved</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">{profile?.stats?.loyaltyPoints || 0}</div>
                  <div className="text-sm text-gray-600">Loyalty Points</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto mb-8">
          <div className="flex gap-2 min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                    {isEditing && (
                      <div className="flex gap-3">
                        <button
                          onClick={handleCancel}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User size={16} />
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.name || 'Prabal Pandey'}</div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Mail size={16} />
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.email || 'prabalpandey25@gmail.com'}</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.phone || '+91 9876543210'}</div>
                      )}
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <BookOpen size={16} />
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editData.bio}
                          onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl min-h-[80px]">{profile?.bio || 'Add a bio to tell others about your spiritual journey...'}</div>
                      )}
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Star size={16} />
                        Interests (comma-separated)
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.interests}
                          onChange={(e) => setEditData({ ...editData, interests: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., Meditation, Yoga, Spiritual Reading"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.interests?.join(', ') || 'No interests added'}</div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <MapPin size={16} />
                          Address
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address}
                            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter your address"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.location?.address || '123 Temple Street, Swaroop Nagar'}</div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.city}
                            onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="City"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.location?.city || 'Kanpur'}</div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.state}
                            onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="State"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-gray-50 rounded-xl">{profile?.location?.state || 'Uttar Pradesh'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats & Actions */}
              <div className="space-y-8">
                
                {/* Quick Stats */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" size={24} />
                    Quick Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                      <span className="text-gray-700">Order Success Rate</span>
                      <span className="font-bold text-orange-600">100%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <span className="text-gray-700">Avg. Order Value</span>
                      <span className="font-bold text-green-600">₹{Math.round((profile?.stats?.totalSpent || 0) / Math.max(1, profile?.stats?.totalOrders || 1))}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                      <span className="text-gray-700">Member Since</span>
                      <span className="font-bold text-purple-600">{profile?.joinedDate?.split('-')[0] || '2024'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/orders')}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <ShoppingBag className="text-orange-500" size={20} />
                      <span>View My Orders</span>
                    </button>
                    <button
                      onClick={() => router.push('/wishlist')}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <Heart className="text-red-500" size={20} />
                      <span>View Wishlist</span>
                    </button>
                    <button
                      onClick={() => router.push('/addresses')}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <MapPin className="text-blue-500" size={20} />
                      <span>Manage Addresses</span>
                    </button>
                    <button
                      onClick={() => router.push('/notifications')}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <Bell className="text-purple-500" size={20} />
                      <span>Notifications</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs remain the same but updated with better content */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders ({profile?.stats?.totalOrders || 0})</h2>
              {(profile?.stats?.totalOrders || 0) === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag size={64} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 mb-6">Start your spiritual shopping journey with PoojaPath!</p>
                  <button
                    onClick={() => router.push('/')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    🕉️ Start Shopping
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-4">You have completed {profile.stats.totalOrders} orders successfully!</p>
                  <p className="text-sm text-gray-500">Order history and tracking coming soon...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist ({wishlist?.length || 0} items)</h2>
              {(!wishlist || wishlist.length === 0) ? (
                <div className="text-center py-16">
                  <Heart size={64} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Wishlist is Empty</h3>
                  <p className="text-gray-600 mb-6">Save items you love for later!</p>
                  <button
                    onClick={() => router.push('/')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    💖 Discover Products
                  </button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-4">You have {wishlist.length} sacred items in your wishlist</p>
                  <button
                    onClick={() => router.push('/wishlist')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    View Full Wishlist
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={28} />
                Spiritual Achievements
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-6 rounded-2xl transition-all ${
                      achievement.earned
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className={`p-3 rounded-full ${achievement.earned ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                      <achievement.icon
                        size={28}
                        className={achievement.earned ? 'text-yellow-600' : 'text-gray-400'}
                      />
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-lg ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </div>
                      <div className="text-gray-600 text-sm">{achievement.desc}</div>
                    </div>
                    {achievement.earned && (
                      <div className="text-2xl">🏆</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell size={20} />
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <input type="checkbox" className="toggle" defaultChecked={profile?.preferences?.notifications?.email} />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <input type="checkbox" className="toggle" defaultChecked={profile?.preferences?.notifications?.sms} />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Promotional Offers</span>
                      <input type="checkbox" className="toggle" defaultChecked={profile?.preferences?.notifications?.offers} />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>New Arrivals</span>
                      <input type="checkbox" className="toggle" defaultChecked={profile?.preferences?.notifications?.newArrivals} />
                    </label>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} />
                    Privacy & Security
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3">
                      <CreditCard size={16} />
                      <span>Change Password</span>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3">
                      <Shield size={16} />
                      <span>Two-Factor Authentication</span>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3">
                      <User size={16} />
                      <span>Privacy Settings</span>
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3">
                      <X size={16} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

