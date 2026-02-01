import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';
import { Product } from '@/types';
import { useLocalStorage } from 'react-use';

interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>('kara-guest-cart', []);
  const [isSyncing, setIsSyncing] = useState(false);

  const utils = api.useContext();
  const { data: dbCart, isLoading: isDbLoading } = api.cart.getCart.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const syncCartMutation = api.cart.syncCart.useMutation({
    onSuccess: () => {
      setLocalCart([]);
      setIsSyncing(false);
      utils.cart.getCart.invalidate();
    },
  });

  const addItemMutation = api.cart.addItem.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const updateQuantityMutation = api.cart.updateQuantity.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  const removeItemMutation = api.cart.removeItem.useMutation({
    onSuccess: () => utils.cart.getCart.invalidate(),
  });

  // Sync guest cart to DB on login
  useEffect(() => {
    if (status === 'authenticated' && localCart && localCart.length > 0 && !isSyncing) {
      setIsSyncing(true);
      syncCartMutation.mutate(
        localCart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, localCart, isSyncing]); // Removed syncCartMutation to avoid infinite loop

  const items = useMemo(() => {
    if (status === 'authenticated' && dbCart) {
      return dbCart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        product: item.product as unknown as Product, // Cast to Product type
      }));
    }
    return localCart || [];
  }, [status, dbCart, localCart]);

  const addItem = (product: Product, quantity = 1) => {
    if (status === 'authenticated') {
      addItemMutation.mutate({ productId: product.id, quantity });
    } else {
      const existing = localCart?.find((item) => item.productId === product.id);
      if (existing) {
        setLocalCart(
          localCart?.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setLocalCart([...(localCart || []), { productId: product.id, quantity, product }]);
      }
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (status === 'authenticated') {
      updateQuantityMutation.mutate({ productId, quantity });
    } else {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        setLocalCart(
          localCart?.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          )
        );
      }
    }
  };

  const removeItem = (productId: number) => {
    if (status === 'authenticated') {
      removeItemMutation.mutate({ productId });
    } else {
      setLocalCart(localCart?.filter((item) => item.productId !== productId));
    }
  };

  const clearCart = () => {
    if (status === 'authenticated') {
      // We might need a clearCart mutation if we want to delete all from DB
      // For now, let's just clear local if guest or ignore for DB (or implement later)
    } else {
      setLocalCart([]);
    }
  };

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
        isLoading: status === 'loading' || isDbLoading || syncCartMutation.isLoading,
        isSyncing,
      }}
    >
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
