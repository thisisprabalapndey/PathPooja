
"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User, ChevronDown, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';
import SearchBar from '../search/SearchBar';
import ProfileDropdown from '../user/ProfileDropdown';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = isClient ? getTotalItems() : 0;

  const handleLogoClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    
    try {
      router.push('/');
    } catch (error) {
      window.location.href = '/';
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-orange-200 shadow-lg' 
            : 'bg-gradient-to-r from-orange-50/80 via-white/80 to-red-50/80 backdrop-blur-md border-b border-orange-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* SPIRITUAL LOGO */}
            <div className="flex items-center cursor-pointer group flex-shrink-0">
              <Link href="/" onClick={handleLogoClick} className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {/* SPIRITUAL OM SYMBOL */}
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl shadow-lg flex items-center justify-center border-2 border-white group-hover:shadow-xl transition-all">
                        <span className="text-2xl">🕉️</span>
                      </div>
                      {/* SPIRITUAL GLOW EFFECT */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100"
                        animate={{ scale: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    
                    <div className="hidden sm:block">
                      {/* POOJAPATH BRAND NAME */}
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight group-hover:text-orange-600 transition-colors">
                        Pooja
                        <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                          Path
                        </span>
                      </h1>
                      {/* SPIRITUAL TAGLINE */}
                      <p className="text-xs text-orange-600 -mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1">
                        <Sparkles size={10} />
                        Sacred Shopping 🇮🇳
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* CLEAN SPIRITUAL NAVIGATION MENU */}
            <nav className="hidden xl:flex items-center space-x-1 flex-shrink-0">
              {[
                { name: "Home", href: "/", icon: Home, isHome: true },
                { name: "Pooja Items", href: "/pooja-items" },
                { name: "Holy Books", href: "/holy-books" },
                { name: "Havan Items", href: "/havan-items" }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="relative group"
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`relative text-gray-700 hover:text-orange-600 font-medium px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1 text-sm group-hover:bg-orange-50 ${
                        item.isHome ? 'text-orange-600 bg-orange-50' : ''
                      }`}
                    >
                      {item.icon && <item.icon size={14} />}
                      {item.name}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              
              {/* Mobile Search Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(249,115,22,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileSearchOpen(true)}
                className="lg:hidden p-3 rounded-full transition-all duration-300 text-gray-600 hover:text-orange-600"
              >
                <Search size={20} />
              </motion.button>

              {/* Profile Dropdown */}
              <ProfileDropdown />

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(249,115,22,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                className="relative p-3 rounded-full transition-all duration-300 text-gray-600 hover:text-orange-600 group"
              >
                <ShoppingBag size={20} />
                
                {/* Cart Badge */}
                {isClient && cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
                  >
                    {cartItemCount}
                  </motion.span>
                )}

                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Cart ({cartItemCount})
                </div>
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-3 rounded-full hover:bg-orange-50 transition-all duration-300 text-gray-600 hover:text-orange-600"
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-orange-200 p-4 z-40"
          >
            <SearchBar 
              isExpanded={true} 
              onClose={() => setIsMobileSearchOpen(false)} 
            />
          </motion.div>
        )}

        {/* CLEAN SPIRITUAL MOBILE MENU */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0, 
            opacity: isMobileMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="xl:hidden overflow-hidden bg-gradient-to-r from-orange-50/95 via-white/95 to-red-50/95 backdrop-blur-xl border-t border-orange-200"
        >
          <div className="px-6 py-6 space-y-4">
            {[
              { name: "🏠 Home", href: "/" },
              { name: "🕉️ Pooja Items", href: "/pooja-items" },
              { name: "📿 Holy Books", href: "/holy-books" },
              { name: "🔥 Havan Items", href: "/havan-items" },
              { name: "📞 Contact", href: "/contact" }
            ].map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
                transition={{ delay: index * 0.1 + 0.1 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-3 text-gray-700 font-medium py-3 text-lg hover:text-orange-600 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.header>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
}

