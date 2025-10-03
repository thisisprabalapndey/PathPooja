

"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Star, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../../store/user';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithGoogle, isAuthenticated, isHydrated, loginDemo } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    const result = await signInWithGoogle();
    
    if (!result.success) {
      setError(result.error || 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.push('/');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('Email login coming soon! Please use Google or try the Demo login for now.');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-white to-green-500 rounded-2xl shadow-lg flex items-center justify-center border-2 border-white">
                    <span className="text-xl font-bold text-gray-800">SN</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      Store<span className="bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">Nova</span>
                    </h1>
                    <p className="text-orange-600 font-medium">🇮🇳 Made for India</p>
                  </div>
                </div>
                
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Welcome to the
                  <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Future of Shopping
                  </span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join millions of happy customers shopping on India's most trusted ecommerce platform.
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-6">
                {[
                  { icon: Shield, title: "100% Secure", desc: "Bank-grade security for all transactions" },
                  { icon: Zap, title: "Lightning Fast", desc: "Quick delivery across India" },
                  { icon: Users, title: "10M+ Users", desc: "Trusted by millions of Indians" },
                  { icon: Star, title: "4.9 Rating", desc: "Highest rated shopping app" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                    className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center lg:hidden">
                  <span className="text-2xl font-bold text-white">SN</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Sign in to continue your shopping journey</p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
                </motion.div>
              )}

              {/* Google Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full mb-4 bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-gray-300 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </span>
              </motion.button>

              {/* Demo Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDemoLogin}
                className="w-full mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4 flex items-center justify-center gap-3 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Users size={20} />
                <span className="font-medium">Try Demo Login</span>
              </motion.button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Sign In
                  <ArrowRight size={20} />
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-orange-600 font-semibold hover:text-orange-700">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

