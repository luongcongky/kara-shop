import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlistItems: number[]; // Array of product IDs
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const utils = api.useContext();

  // Fetch wishlist from DB if logged in
  const { isLoading: isFetchingDB } = api.wishlist.getWishlist.useQuery(undefined, {
    enabled: !!session,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setWishlistItems(data.map((item) => item.productId));
    },
  });

  const toggleMutation = api.wishlist.toggleWishlist.useMutation({
    onSuccess: (data) => {
      if (data.action === 'added') {
        toast.success('Đã thêm vào yêu thích');
      } else {
        toast.success('Đã xóa khỏi yêu thích');
      }
      utils.wishlist.getWishlist.invalidate();
    },
    onError: (err, variables, context: { previousWishlist?: number[] } | undefined) => {
      // Rollback optimistic update
      if (context?.previousWishlist) {
        setWishlistItems(context.previousWishlist);
      }
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    },
  });

  const syncMutation = api.wishlist.syncWishlist.useMutation({
    onSuccess: (data) => {
      setWishlistItems(data.map(item => item.productId));
      localStorage.removeItem('wishlist');
    }
  });

  // Load from local storage initially (for guest or before DB sync)
  useEffect(() => {
    const localData = localStorage.getItem('wishlist');
    if (localData) {
      try {
        const parsed = JSON.parse(localData) as number[];
        if (!session) {
          setWishlistItems(parsed);
        } else {
          // If logged in, sync local to DB
          syncMutation.mutate(parsed);
        }
      } catch (e) {
        console.error('Failed to parse wishlist from local storage', e);
      }
    }
    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]); // Only depend on session, not syncMutation to avoid infinite loop

  // Persist to local storage if guest
  useEffect(() => {
    if (isInitialized && !session) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, session, isInitialized]);

  const toggleWishlist = (productId: number) => {
    const isCurrentlyIn = wishlistItems.includes(productId);
    
    // Optimistic Update
    const newWishlist = isCurrentlyIn 
      ? wishlistItems.filter(id => id !== productId)
      : [...wishlistItems, productId];
    
    setWishlistItems(newWishlist);

    if (session) {
      toggleMutation.mutate({ productId });
    } else {
      if (isCurrentlyIn) {
        toast.success('Đã xóa khỏi yêu thích');
      } else {
        toast.success('Đã thêm vào yêu thích');
      }
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        isLoading: !isInitialized || (!!session && isFetchingDB),
      }}
    >
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
