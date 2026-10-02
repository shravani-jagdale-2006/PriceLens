import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { triggerDealConfetti } from "../utils/formatters";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user, openAuthModal } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.getWishlist();
      if (res && res.data) {
        setWishlist(res.data);
      }
    } catch (err) {
      console.warn("Error loading wishlist:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId || item.productId === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    try {
      if (isInWishlist(productId)) {
        await api.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(item => item.id !== productId && item.productId !== productId));
      } else {
        await api.addToWishlist(productId);
        triggerDealConfetti();
        await fetchWishlist();
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.removeFromWishlist(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId && item.productId !== productId));
    } catch (err) {
      console.error("Wishlist remove error:", err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist,
        isWishlistOpen,
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false)
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
