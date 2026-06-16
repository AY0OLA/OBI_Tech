import { ProductParams } from "@/shared.types";
import { createStore } from "zustand";

export interface CartItem extends ProductParams {
  cartQuantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: ProductParams) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const cartStore = createStore<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    const existing = get().items.find((i) => i.id === product.id);
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === product.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...get().items, { ...product, cartQuantity: 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clearCart: () => set({ items: [] }),
}));
