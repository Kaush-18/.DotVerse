"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  CartItem,
  clampCartQuantity,
  MAX_CART_QUANTITY,
  parseCartStorage,
  sameCartVariant,
  serializeCartStorage,
} from "@/lib/cart";

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (
    id: string,
    size: string,
    color: string
  ) => void;
  updateQuantity: (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(() => {
    return [];
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      // localStorage is an external browser store; hydrate after the server render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(parseCartStorage(window.localStorage.getItem(CART_STORAGE_KEY)));
    } catch {
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCartStorage(items));
    } catch {
      // Storage can be unavailable in private browsing; shopping still works in memory.
    }
  }, [isHydrated, items]);

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity = 1
  ) => {
    setItems((currentItems) => {
      const safeQuantity = Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)));
      const existingItem = currentItems.find((cartItem) => sameCartVariant(cartItem, item));

      if (existingItem) {
        return currentItems.map((cartItem) =>
          sameCartVariant(cartItem, item)
            ? {
                ...cartItem,
                quantity: clampCartQuantity(cartItem.quantity + safeQuantity),
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: safeQuantity,
        },
      ];
    });
  };

  const removeFromCart = (
    id: string,
    size: string,
    color: string
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const updateQuantity = (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity: clampCartQuantity(quantity),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
