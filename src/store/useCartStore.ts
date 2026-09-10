import { create } from "zustand";

export interface CartItem {
  id: string; // unique hash: e.g., productId-weight-grind
  productId: string;
  name: string;
  weight: string;
  grind: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "id" | "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: (isOpen?: boolean) => void;
  clearCart: () => void;
  
  // Calculations
  getSubtotal: () => number;
  getRemainingForFreeShipping: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  isOpen: false,

  addItem: (item, quantity = 1) => {
    // Generate unique ID based on item options
    const uniqueId = `${item.productId}-${item.weight}-${item.grind.toLowerCase().replace(/\s+/g, "-")}`;
    
    set((state) => {
      const existingItemIndex = state.cart.findIndex((i) => i.id === uniqueId);
      
      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += quantity;
        return { cart: updatedCart, isOpen: true }; // Automatically open cart drawer on add
      }
      
      return {
        cart: [...state.cart, { ...item, id: uniqueId, quantity }],
        isOpen: true,
      };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }));
  },

  toggleCart: (isOpen) => {
    set((state) => ({
      isOpen: isOpen !== undefined ? isOpen : !state.isOpen,
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  getSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getRemainingForFreeShipping: () => {
    const subtotal = get().getSubtotal();
    return Math.max(0, 499 - subtotal);
  },
}));
