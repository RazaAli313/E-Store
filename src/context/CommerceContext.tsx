import type { JSX, ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { ProductListItem } from '#/types/products/product.types';

export interface CartItem {
  product: ProductListItem;
  quantity: number;
}

interface CommerceContextValue {
  cartItems: CartItem[];
  cartCount: number;
  subtotal: number;
  wishlistIds: number[];
  addToCart: (product: ProductListItem) => void;
  removeFromCart: (productId: number) => void;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
}

const CommerceContext = createContext<CommerceContextValue | null>(null);

export const CommerceProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);

  const addToCart = useCallback((product: ProductListItem) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);

      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems(currentItems => currentItems.filter(item => item.product.id !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlistIds(currentIds =>
      currentIds.includes(productId) ? currentIds.filter(id => id !== productId) : [...currentIds, productId]
    );
  }, []);

  const isWishlisted = useCallback((productId: number) => wishlistIds.includes(productId), [wishlistIds]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      wishlistIds,
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
    }),
    [cartItems, cartCount, subtotal, wishlistIds, addToCart, removeFromCart, toggleWishlist, isWishlisted]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
};

export const useCommerce = (): CommerceContextValue => {
  const context = useContext(CommerceContext);
  if (!context) throw new Error('useCommerce must be used within a CommerceProvider');
  return context;
};
