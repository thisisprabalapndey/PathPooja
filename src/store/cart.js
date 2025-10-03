
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Simple function to extract only essential product data (prevents circular references)
const extractProductData = (productData) => {
  if (!productData) return null;
  
  // Extract only the properties we need - no nested objects or complex data
  return {
    id: productData.id,
    name: productData.name || '',
    price: Number(productData.price) || 0,
    originalPrice: Number(productData.originalPrice || productData.price) || 0,
    image: productData.image || '',
    category: productData.category || 'Spiritual Items',
    slug: productData.slug || '',
    quantity: Number(productData.quantity) || 1
  };
};

// Create clean cart item with only essential data
const createCartItem = (productData) => {
  const cleanProduct = extractProductData(productData);
  if (!cleanProduct) return null;
  
  return {
    id: `cart-${cleanProduct.id}-${Date.now()}`,
    product: cleanProduct,
    quantity: cleanProduct.quantity,
    selectedColor: null,
    selectedSize: null,
    // Direct properties for compatibility
    name: cleanProduct.name,
    price: cleanProduct.price,
    image: cleanProduct.image,
    originalPrice: cleanProduct.originalPrice
  };
};

const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,
      lastOrderData: null,
      
      // Set hydration complete
      setHydrated: () => set({ isHydrated: true }),
      
      // Legacy addItem for compatibility
      addItem: (product, quantity = 1, color, size) => {
        try {
          const cleanProduct = extractProductData(product);
          if (!cleanProduct) return;
          
          const existingItem = get().items.find(
            item => item.product?.id === cleanProduct.id
          );
          
          if (existingItem) {
            set(state => ({
              items: state.items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }));
          } else {
            const newItem = {
              id: `${cleanProduct.id}-${Date.now()}`,
              product: cleanProduct,
              quantity,
              selectedColor: color ? { value: color.value, name: color.name } : null,
              selectedSize: size
            };
            
            set(state => ({ items: [...state.items, newItem] }));
          }
        } catch (error) {
          console.error('Error adding item:', error);
        }
      },

      // Enhanced addToCart for spiritual products
      addToCart: (productData) => {
        try {
          const newItem = createCartItem(productData);
          if (!newItem) {
            console.error('Failed to create cart item');
            return;
          }
          
          const existingItem = get().items.find(item => 
            item.product?.id === newItem.product.id
          );
          
          if (existingItem) {
            // Update existing item quantity
            set(state => ({
              items: state.items.map(item =>
                item.product?.id === newItem.product.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              )
            }));
            console.log('🛒 Updated quantity for:', newItem.product.name);
          } else {
            // Add new item
            set(state => ({ items: [...state.items, newItem] }));
            console.log('🕉️ Added to cart:', newItem.product.name);
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      },
      
      // Remove item
      removeItem: (id) => {
        try {
          set(state => ({
            items: state.items.filter(item => 
              item.id !== id && item.product?.id !== id
            )
          }));
          console.log('🗑️ Removed from cart:', id);
        } catch (error) {
          console.error('Error removing item:', error);
        }
      },

      // Legacy removeFromCart
      removeFromCart: (productId) => get().removeItem(productId),
      
      // Update quantity
      updateQuantity: (id, quantity) => {
        try {
          if (quantity <= 0) {
            get().removeItem(id);
            return;
          }
          
          set(state => ({
            items: state.items.map(item =>
              (item.id === id || item.product?.id === id) 
                ? { ...item, quantity } 
                : item
            )
          }));
        } catch (error) {
          console.error('Error updating quantity:', error);
        }
      },
      
      // Clear cart (simplified)
      clearCart: (orderData = null) => {
        try {
          if (orderData) {
            // Only store essential order data
            const cleanOrderData = {
              orderNumber: orderData.orderNumber || `PP-${Date.now().toString().slice(-8)}`,
              completedAt: new Date().toISOString(),
              itemCount: get().items.length,
              total: get().getTotalPrice()
            };
            set({ items: [], lastOrderData: cleanOrderData });
          } else {
            set({ items: [] });
          }
          console.log('🧹 Cart cleared');
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ items: [] }); // Fallback
        }
      },
      
      // Complete order (simplified)
      completeOrder: (orderData) => {
        try {
          const items = get().items;
          const completeOrderInfo = {
            orderNumber: orderData?.orderNumber || `PP-${Date.now().toString().slice(-8)}`,
            completedAt: new Date().toISOString(),
            itemCount: items.length,
            totalAmount: get().getTotalPrice(),
            items: items.map(item => ({
              name: item.product?.name || item.name,
              quantity: item.quantity,
              price: item.product?.price || item.price
            }))
          };
          
          // Store in sessionStorage safely
          if (typeof window !== 'undefined') {
            try {
              sessionStorage.setItem('completedOrder', JSON.stringify(completeOrderInfo));
            } catch (e) {
              console.warn('Could not store in sessionStorage');
            }
          }
          
          set({ 
            items: [], 
            lastOrderData: completeOrderInfo,
            isOpen: false
          });
          
          console.log('✅ Order completed:', completeOrderInfo.orderNumber);
          return completeOrderInfo;
        } catch (error) {
          console.error('Error completing order:', error);
          return null;
        }
      },
      
      // Get last completed order
      getLastOrder: () => {
        try {
          const state = get();
          if (state.lastOrderData) return state.lastOrderData;
          
          if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('completedOrder');
            if (stored) {
              try {
                return JSON.parse(stored);
              } catch (e) {
                console.error('Error parsing stored order:', e);
              }
            }
          }
          return null;
        } catch (error) {
          console.error('Error getting last order:', error);
          return null;
        }
      },
      
      // Clear last order data
      clearLastOrder: () => {
        try {
          set({ lastOrderData: null });
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('completedOrder');
          }
        } catch (error) {
          console.error('Error clearing last order:', error);
        }
      },
      
      // Cart UI controls
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),
      openCart: () => set({ isOpen: true }),
      
      // Calculation functions
      getTotalItems: () => {
        try {
          return get().items.reduce((total, item) => total + (item.quantity || 0), 0);
        } catch (error) {
          console.error('Error calculating total items:', error);
          return 0;
        }
      },
      
      getTotalPrice: () => {
        try {
          return get().items.reduce((total, item) => {
            const price = item.product?.price || item.price || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
          }, 0);
        } catch (error) {
          console.error('Error calculating total price:', error);
          return 0;
        }
      },
      
      // Get cart summary
      getCartSummary: () => {
        try {
          const items = get().items;
          const totalItems = get().getTotalItems();
          const totalPrice = get().getTotalPrice();
          
          const originalTotal = items.reduce((total, item) => {
            const originalPrice = item.product?.originalPrice || item.originalPrice || item.product?.price || item.price || 0;
            const quantity = item.quantity || 0;
            return total + (originalPrice * quantity);
          }, 0);
          
          return {
            totalItems,
            totalPrice,
            originalTotal,
            savings: Math.max(0, originalTotal - totalPrice),
            isEmpty: items.length === 0
          };
        } catch (error) {
          console.error('Error getting cart summary:', error);
          return { totalItems: 0, totalPrice: 0, originalTotal: 0, savings: 0, isEmpty: true };
        }
      },
      
      // Utility functions
      getFormattedTotal: () => {
        try {
          const total = get().getTotalPrice();
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
          }).format(total);
        } catch (error) {
          return '₹0';
        }
      },
      
      isEmpty: () => get().items.length === 0,
      
      getProductQuantity: (productId) => {
        try {
          const items = get().items.filter(item => 
            (item.product?.id === productId) || (item.id === productId)
          );
          return items.reduce((total, item) => total + (item.quantity || 0), 0);
        } catch (error) {
          return 0;
        }
      },

      isInCart: (productId) => {
        try {
          return get().items.some(item => 
            (item.product?.id === productId) || (item.id === productId)
          );
        } catch (error) {
          return false;
        }
      },

      getItemQuantity: (productId) => {
        try {
          const item = get().items.find(item => 
            (item.product?.id === productId) || (item.id === productId)
          );
          return item ? item.quantity : 0;
        } catch (error) {
          return 0;
        }
      },

      getCartMessage: () => {
        try {
          const summary = get().getCartSummary();
          if (summary.isEmpty) {
            return "🕉️ Your sacred cart awaits divine products";
          }
          return `🛒 ${summary.totalItems} blessed items ready for checkout`;
        } catch (error) {
          return "🕉️ Your sacred cart";
        }
      }
    }),
    {
      name: 'poojapath-cart-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated();
          console.log('🛒 PoojaPath cart rehydrated');
        }
      },
      // Only persist essential data
      partialize: (state) => ({
        items: state.items || [],
        lastOrderData: state.lastOrderData || null,
        isHydrated: state.isHydrated || false
      })
    }
  )
);

// Enhanced hook with cartItems compatibility
const useEnhancedCartStore = () => {
  try {
    const state = useCartStore();
    return {
      ...state,
      cartItems: state.items || []
    };
  } catch (error) {
    console.error('Error using enhanced cart store:', error);
    // Return safe fallback
    return {
      items: [],
      cartItems: [],
      isOpen: false,
      isHydrated: false,
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
      addToCart: () => {},
      clearCart: () => {},
      isEmpty: () => true
    };
  }
};

export { useCartStore, useEnhancedCartStore };
export default useEnhancedCartStore;

