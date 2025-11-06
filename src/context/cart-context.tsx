
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useUser } from '@/firebase';

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  seller: string;
  dataAiHint: string;
  category: string;
  condition: string;
  location: string;
};

export type CartItem = Product & {
  quantity: number;
};

// Define a type for the coupon object
export type Coupon = {
  id: string;
  title: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  // Add any other properties your coupon might have
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.uid}`);
      const storedCoupon = localStorage.getItem(`coupon_${user.uid}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      if (storedCoupon) {
        setAppliedCoupon(JSON.parse(storedCoupon));
      }
    } else {
      setCart([]); // Clear cart on logout
      setAppliedCoupon(null); // Clear coupon on logout
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(cart));
      if (appliedCoupon) {
        localStorage.setItem(`coupon_${user.uid}`, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(`coupon_${user.uid}`);
      }
    }
  }, [cart, appliedCoupon, user]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };
  
  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, appliedCoupon, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
