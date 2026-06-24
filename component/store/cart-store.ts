import { ProductParams } from "@/shared.types";
import { create } from "zustand";

export interface CartItem extends ProductParams {
  cartQuantity: number;
}

interface CartState {
  items: CartItem[];

  addItem: (product: ProductParams) => void;

  increaseQty: (id: string) => void;

  decreaseQty: (id: string) => void;

  removeItem: (id: string) => void;

  clearCart: () => void;
}

export const cartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    const existing = get().items.find((item) => item.id === product.id);

    if (existing) {
      set({
        items: get().items.map((item) =>
          item.id === product.id
            ? {
                ...item,
                cartQuantity: item.cartQuantity + 1,
              }
            : item,
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            ...product,
            cartQuantity: 1,
          },
        ],
      });
    }
  },

  increaseQty: (id) => {
    set({
      items: get().items.map((item) =>
        item.id === id
          ? {
              ...item,
              cartQuantity: item.cartQuantity + 1,
            }
          : item,
      ),
    });
  },

  decreaseQty: (id) => {
    set({
      items: get()
        .items.map((item) =>
          item.id === id
            ? {
                ...item,
                cartQuantity: item.cartQuantity - 1,
              }
            : item,
        )
        .filter((item) => item.cartQuantity > 0),
    });
  },

  removeItem: (id) => {
    set({
      items: get().items.filter((item) => item.id !== id),
    });
  },

  clearCart: () => {
    set({
      items: [],
    });
  },
}));
