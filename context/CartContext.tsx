"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
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
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart
  useEffect(() => {
    const savedCart = localStorage.getItem("dotverse-cart");

    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem(
      "dotverse-cart",
      JSON.stringify(items)
    );
  }, [items]);

  const addToCart = (
    item: Omit<CartItem, "quantity">
  ) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
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
              quantity,
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
