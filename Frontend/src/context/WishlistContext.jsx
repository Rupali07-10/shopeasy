import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 🔥 Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!user?.id) {
      setWishlist([]);
      return;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id);

    if (!error) {
      setWishlist(data || []);
    } else {
      console.error("Wishlist fetch error:", error);
    }
  }, [user?.id]);

  // 🔥 Realtime subscription (FIXED)
  useEffect(() => {
    if (!user?.id) return;

    let channel;

    const setup = async () => {
      await fetchWishlist();

      // ✅ Unique channel (prevents duplicate subscription bug)
      channel = supabase.channel(
        `wishlist-${user.id}-${Date.now()}`
      );

      // ✅ Attach listener BEFORE subscribe
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchWishlist();
        }
      );

      // ✅ Subscribe AFTER on()
      await channel.subscribe();
    };

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]); // ❗ important: only depend on user.id

  // ➕ Add to wishlist
  const addToWishlist = async (productId) => {
    if (!user?.id) return false;

    const { error } = await supabase.from("wishlist").insert([
      {
        user_id: user.id,
        product_id: productId.toString(),
      },
    ]);

    if (!error) {
      await fetchWishlist();
      return true;
    }

    console.error(error);
    return false;
  };

  // ❌ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user?.id) return false;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId.toString());

    if (!error) {
      await fetchWishlist();
      return true;
    }

    console.error(error);
    return false;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};