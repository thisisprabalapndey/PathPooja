"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, UserPlus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../../store/user";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithGoogle, isAuthenticated, isHydrated } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError("");
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || "Failed to sign up with Google.");
      setIsLoading(false);
    }
  };

  // Handle email+password registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("Only Google sign up is supported for now.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border border-orange-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SN</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Start shopping the StoreNova way</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full mb-6 bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-3 hover:border-gray-300 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25 ... (Google G icon paths, same as login page)"/>
              {/* You can copy the SVG path used on your login page */}
            </svg>
            <span className="font-medium text-gray-700 group-hover:text-gray-900">
              {isLoading ? "Signing up..." : "Sign up with Google"}
            </span>
          </motion.button>

          {/* Email/Password registration can be implemented here in the future */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-colors bg-gray-100"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  disabled
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none transition-colors bg-gray-100"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-semibold
                hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Sign Up
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-orange-600 font-semibold hover:text-orange-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
