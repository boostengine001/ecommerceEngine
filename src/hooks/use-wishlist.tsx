
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { IProduct } from '@/models/Product';
import { useToast } from './use-toast';

export type WishlistItem = IProduct;

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('bluecart_wishlist');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bluecart_wishlist', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlistItems]);
  
  const addToWishlist = useCallback((product: IProduct) => {
    setWishlistItems(prevItems => {
      if (prevItems.some(item => item._id === product._id)) {
        return prevItems;
      }
      return [...prevItems, product];
    });
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  }, [toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
     toast({
      title: "Removed from wishlist",
      description: `The item has been removed from your wishlist.`,
    });
  }, [toast]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.some(item => item._id === productId);
  }, [wishlistItems]);


  const totalItems = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist, totalItems }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
