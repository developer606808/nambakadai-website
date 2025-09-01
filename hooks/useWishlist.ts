'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  createdAt: string;
  product: {
    id: number;
    title: string;
    price: number;
    images: string[];
    stock: number;
  };
}

interface UseWishlistReturn {
  wishlistItems: WishlistItem[];
  wishlistStatus: Record<number, boolean>;
  wishlistCount: number;
  isLoading: boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  checkWishlistStatus: (productIds: number[]) => Promise<void>;
  refreshWishlist: () => Promise<void>;
  refreshCount: () => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const { data: session } = useSession();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistStatus, setWishlistStatus] = useState<Record<number, boolean>>({});
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist count
  const refreshCount = useCallback(async () => {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/wishlist/count');
      if (response.ok) {
        const data = await response.json();
        setWishlistCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  }, [session?.user]);

  // Fetch wishlist items
  const refreshWishlist = useCallback(async () => {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const items = await response.json();
        setWishlistItems(items);

        // Update status map
        const statusMap: Record<number, boolean> = {};
        items.forEach((item: WishlistItem) => {
          statusMap[item.productId] = true;
        });
        setWishlistStatus(statusMap);
        setWishlistCount(items.length);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [session?.user]);

  // Check wishlist status for specific products
  const checkWishlistStatus = useCallback(async (productIds: number[]) => {
    if (!session?.user || productIds.length === 0) return;

    try {
      const response = await fetch(`/api/wishlist/status?productIds=${productIds.join(',')}`);
      if (response.ok) {
        const status = await response.json();
        setWishlistStatus(prev => ({ ...prev, ...status }));
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }, [session?.user]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (productId: number) => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action: 'add'
        }),
      });

      if (response.ok) {
        setWishlistStatus(prev => ({ ...prev, [productId]: true }));
        // Update count locally first for immediate UI feedback
        setWishlistCount(prev => prev + 1);
        // Then refresh from server to ensure accuracy
        await refreshCount();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, refreshCount]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (productId: number) => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/wishlist/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action: 'remove'
        }),
      });

      if (response.ok) {
        setWishlistStatus(prev => ({ ...prev, [productId]: false }));
        // Update count locally first for immediate UI feedback
        setWishlistCount(prev => Math.max(0, prev - 1));
        // Then refresh from server to ensure accuracy
        await refreshCount();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, refreshCount]);

  // Toggle wishlist status
  const toggleWishlist = useCallback(async (productId: number) => {
    const isInWishlist = wishlistStatus[productId];
    if (isInWishlist) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [wishlistStatus, addToWishlist, removeFromWishlist]);

  // Initialize wishlist data when user logs in
  useEffect(() => {
    if (session?.user) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
      setWishlistStatus({});
      setWishlistCount(0);
    }
  }, [session?.user, refreshWishlist]);

  return {
    wishlistItems,
    wishlistStatus,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    checkWishlistStatus,
    refreshWishlist,
    refreshCount,
  };
}