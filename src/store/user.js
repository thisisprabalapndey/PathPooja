
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { auth } from '../lib/supabase';

const useUserStore = create()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      session: null,
      
      // User preferences
      wishlist: [],
      recentlyViewed: [],
      addresses: [],
      
      // Set hydration complete
      setHydrated: () => set({ isHydrated: true }),
      
      // Initialize auth listener
      initialize: () => {
        console.log('🔧 Initializing auth system...');
        
        try {
          // Get initial session
          auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
              console.error('❌ Error getting session:', error);
            } else if (session) {
              console.log('✅ Found existing session for:', session.user.email);
              get().setSession(session);
            } else {
              console.log('ℹ️ No existing session found');
            }
            get().setHydrated();
          });

          // Listen for auth changes
          const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
            console.log('🔔 Auth state changed:', event, session?.user?.email);
            
            if (event === 'SIGNED_IN' && session) {
              get().setSession(session);
            } else if (event === 'SIGNED_OUT') {
              get().clearSession();
            }
          });

          return () => {
            console.log('🧹 Cleaning up auth listener');
            subscription?.unsubscribe?.();
          };
        } catch (error) {
          console.error('❌ Auth initialization failed:', error);
          get().setHydrated();
          return () => {};
        }
      },

      // Set session and user data
      setSession: (session) => {
        if (!session) return;
        
        const user = session.user;
        const userData = {
          id: user?.id || '',
          email: user?.email || '',
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
          avatar: user?.user_metadata?.avatar_url || user?.user_metadata?.picture,
          provider: user?.app_metadata?.provider || 'google',
          memberSince: user?.created_at ? new Date(user.created_at).getFullYear().toString() : '2024'
        };

        console.log('✅ Setting user session for:', userData.email);
        set({
          user: userData,
          session,
          isAuthenticated: true,
          isLoading: false
        });
      },

      // Clear session
      clearSession: () => {
        console.log('🚪 Clearing user session');
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false
        });
      },

      // Authentication actions
      signInWithGoogle: async () => {
        set({ isLoading: true });
        console.log('🔐 Starting Google sign in...');
        
        try {
          const { data, error } = await auth.signInWithGoogle();
          
          if (error) {
            console.error('❌ Google sign in failed:', error);
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          
          console.log('✅ Google sign in initiated successfully');
          // Don't set loading to false here - let the auth state change handle it
          return { success: true };
        } catch (error) {
          console.error('❌ Google sign in error:', error);
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          const { error } = await auth.signOut();
          if (error) throw error;
          get().clearSession();
          return { success: true };
        } catch (error) {
          console.error('❌ Sign out error:', error);
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      updateUser: (userData) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      },
      
      // Wishlist actions
      addToWishlist: (productId) => {
        set(state => ({
          wishlist: state.wishlist.includes(productId) 
            ? state.wishlist 
            : [...state.wishlist, productId]
        }));
      },
      
      removeFromWishlist: (productId) => {
        set(state => ({
          wishlist: state.wishlist.filter(id => id !== productId)
        }));
      },
      
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          get().removeFromWishlist(productId);
        } else {
          get().addToWishlist(productId);
        }
      },
      
      // Recently viewed actions
      addToRecentlyViewed: (productId) => {
        set(state => {
          const filtered = state.recentlyViewed.filter(id => id !== productId);
          return {
            recentlyViewed: [productId, ...filtered].slice(0, 10)
          };
        });
      },
      
      // Address actions
      addAddress: (address) => {
        set(state => ({
          addresses: [...state.addresses, { ...address, id: Date.now() }]
        }));
      },
      
      updateAddress: (addressId, updatedAddress) => {
        set(state => ({
          addresses: state.addresses.map(addr => 
            addr.id === addressId ? { ...addr, ...updatedAddress } : addr
          )
        }));
      },
      
      deleteAddress: (addressId) => {
        set(state => ({
          addresses: state.addresses.filter(addr => addr.id !== addressId)
        }));
      },
      
      // Demo user login (for development)
      loginDemo: () => {
        const demoUser = {
          id: 'demo-user-123',
          email: 'demo@storenova.com',
          name: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&q=60',
          provider: 'demo',
          memberSince: '2024',
          pendingOrders: 2
        };

        set({
          user: demoUser,
          isAuthenticated: true,
          session: { user: demoUser }
        });
      },
      
      // Utility getters
      getWishlistCount: () => get().wishlist.length,
      isInWishlist: (productId) => get().wishlist.includes(productId)
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
          console.log('💾 User data rehydrated');
        }
      },
      partialize: (state) => ({
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        addresses: state.addresses
      }),
    }
  )
);

export { useUserStore };

