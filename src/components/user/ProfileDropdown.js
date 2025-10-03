
"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, LogIn, UserPlus, Heart, Package, MapPin, Settings, 
  HelpCircle, LogOut, ChevronDown, Star, Gift, CreditCard,
  Bell, Shield, Headphones, Loader, Crown, Sparkles, Coffee
} from 'lucide-react';
import Link from 'next/link';
import { useUserStore } from '../../store/user';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  
  const { 
    user, 
    profile,
    wishlist,
    orders,
    isAuthenticated, 
    isHydrated, 
    isLoading,
    signOut, // ✅ Use signOut instead of logout
    getWishlistCount,
    loginDemo 
  } = useUserStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isHydrated || isLoading) {
    return (
      <div className="p-3 rounded-full bg-gray-100 animate-pulse">
        <Loader size={20} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    
    setTimeout(async () => {
      // ✅ Use signOut if it exists, otherwise try other logout methods
      if (signOut) {
        await signOut();
      } else {
        // Fallback to manual logout if signOut doesn't exist
        window.location.href = '/api/auth/signout'; // Google Auth logout
      }
      setIsLoggingOut(false);
    }, 500);
  };

  const handleDemoLogin = () => {
    setIsOpen(false);
    if (loginDemo) {
      loginDemo();
    }
  };

  // Use the getWishlistCount function if available, otherwise use wishlist length
  const wishlistCount = getWishlistCount ? getWishlistCount() : (wishlist?.length || 0);
  const ordersCount = orders?.length || 0;

  // Get user data from either user or profile object
  const userData = user || profile || {};
  const userName = userData?.name || user?.displayName || profile?.name || 'User';
  const userEmail = userData?.email || user?.email || profile?.email || '';
  const userAvatar = userData?.avatar || user?.photoURL || user?.picture || profile?.avatar || '';

  const guestMenuItems = [
    {
      icon: LogIn,
      label: 'Sign In',
      href: '/auth/login',
      description: 'Access your account',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: UserPlus,
      label: 'Create Account',
      href: '/auth/register',
      description: 'Join PoojaPath family',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    { type: 'divider' },
    {
      icon: Coffee,
      label: 'Try Demo Login',
      href: '#',
      description: 'Experience the full features',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      onClick: handleDemoLogin
    },
    { type: 'divider' },
    {
      icon: Package,
      label: 'Track Order',
      href: '/track-order',
      description: 'Check your order status'
    },
    {
      icon: HelpCircle,
      label: 'Help Center',
      href: '/help',
      description: 'Get support & FAQs'
    }
  ];

  const userMenuItems = [
    {
      icon: User,
      label: 'My Profile',
      href: '/profile',
      description: 'Manage your account',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: Package,
      label: 'My Orders',
      href: '/orders', // ✅ Fixed route
      description: 'Track & manage orders',
      badge: ordersCount || null,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Heart,
      label: 'Wishlist',
      href: '/wishlist', // ✅ Fixed route
      description: 'Your saved items',
      badge: wishlistCount > 0 ? wishlistCount : null,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: MapPin,
      label: 'Addresses',
      href: '/addresses',
      description: 'Manage delivery addresses',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { type: 'divider' },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      description: 'Preferences & privacy',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      icon: HelpCircle,
      label: 'Help Center',
      href: '/help',
      description: 'Support & FAQs'
    }
  ];

  const menuItems = isAuthenticated ? userMenuItems : guestMenuItems;

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoggingOut}
        className={`relative flex items-center gap-2 p-2 rounded-full transition-all duration-300 group ${
          isOpen 
            ? 'bg-orange-100 text-orange-600' 
            : 'bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600'
        } ${isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* User Avatar */}
        <div className="relative">
          {isAuthenticated && userAvatar ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                src={userAvatar}
                alt={userName || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-xs hidden items-center justify-center">
                {getUserInitials(userName)}
              </div>
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold ${
              isAuthenticated 
                ? 'bg-gradient-to-br from-orange-500 to-red-500 border-white text-white' 
                : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}>
              {isAuthenticated ? getUserInitials(userName) : <User size={16} />}
            </div>
          )}
          
          {/* Online indicator */}
          {isAuthenticated && !isLoggingOut && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" 
            />
          )}
        </div>

        {/* Name & Chevron */}
        <div className="hidden sm:flex items-center gap-1">
          <div className="text-left">
            <p className="text-sm font-medium leading-none">
              {isLoggingOut ? 'Signing out...' : (isAuthenticated ? userName : 'Account')}
            </p>
            {isAuthenticated && !isLoggingOut && (
              <p className="text-xs text-gray-500 leading-none mt-0.5">
                Welcome back!
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </div>

        {/* Wishlist badge */}
        {isAuthenticated && wishlistCount > 0 && !isLoggingOut && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
          >
            {wishlistCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !isLoggingOut && (
          <>
            <div 
              className="fixed inset-0 z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {userAvatar ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={userAvatar}
                            alt={userName || 'User'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-lg hidden items-center justify-center">
                            {getUserInitials(userName)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                          {getUserInitials(userName)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {userName}
                      </h3>
                      <p className="text-sm text-gray-600">{userEmail}</p>
                      <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                        <Star size={10} className="fill-current" />
                        Member since 2024
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Welcome to PoojaPath!</h3>
                    <p className="text-sm text-gray-600">Sign in to access your sacred account</p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {isAuthenticated && (
                <div className="grid grid-cols-3 gap-1 p-4 border-b border-gray-200">
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <div className="text-lg font-bold text-orange-600">{ordersCount}</div>
                    <div className="text-xs text-gray-600">Orders</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-xl">
                    <div className="text-lg font-bold text-red-600">{wishlistCount}</div>
                    <div className="text-xs text-gray-600">Wishlist</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-lg font-bold text-green-600">₹{profile?.stats?.savedAmount || 0}</div>
                    <div className="text-xs text-gray-600">Saved</div>
                  </div>
                </div>
              )}

              {/* Menu Items */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {menuItems.map((item, index) => {
                  if (item.type === 'divider') {
                    return <div key={index} className="h-px bg-gray-200 my-2 mx-4" />;
                  }

                  const Icon = item.icon;
                  
                  if (item.onClick) {
                    return (
                      <motion.button
                        key={item.label}
                        whileHover={{ backgroundColor: '#FFF7ED' }}
                        onClick={item.onClick}
                        className={`w-full flex items-center gap-3 px-6 py-3 transition-colors cursor-pointer ${
                          item.bgColor || 'hover:bg-orange-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${item.bgColor?.replace('hover:', '') || 'bg-gray-100'}`}>
                          <Icon size={16} className={item.color || 'text-gray-600'} />
                        </div>
                        
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.label}</span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  }
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        whileHover={{ backgroundColor: '#FFF7ED' }}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-6 py-3 transition-colors cursor-pointer ${
                          item.bgColor || 'hover:bg-orange-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${item.bgColor?.replace('hover:', '') || 'bg-gray-100'}`}>
                          <Icon size={16} className={item.color || 'text-gray-600'} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{item.label}</span>
                            {item.badge && (
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                typeof item.badge === 'number' 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                {isAuthenticated && (
                  <>
                    <div className="h-px bg-gray-200 my-2 mx-4" />
                    <motion.button
                      whileHover={{ backgroundColor: '#FEF2F2' }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-red-50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-red-100">
                        <LogOut size={16} className="text-red-600" />
                      </div>
                      <div>
                        <span className="font-medium text-red-700">Sign Out</span>
                        <p className="text-xs text-red-500 mt-0.5">See you again soon!</p>
                      </div>
                    </motion.button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500">
                  🇮🇳 Made with ❤️ for India | PoojaPath v2.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

