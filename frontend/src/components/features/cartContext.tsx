"use client"
import React, { createContext, useContext, useState } from "react";

// Define kiểu dữ liệu trong context
interface CartItem {
  id: string;
  title: string;
  price: number;
}

// Define giao diện Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
}

// Tạo context với kiểu dữ liệu `undefined` ban đầu
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Tạo provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // Trạng thái hiển thị giỏ hàng

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook an toàn
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
