import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const normalizeCartRows = (rows = []) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const productId = row.product_id?.toString();
    if (!productId) return;

    const quantity = Number(row.quantity) || 0;
    const existing = grouped.get(productId);

    if (existing) {
      existing.quantity += quantity;
      existing.duplicateIds.push(row.id);
      return;
    }

    grouped.set(productId, {
      ...row,
      product_id: productId,
      quantity,
      duplicateIds: [],
    });
  });

  return Array.from(grouped.values());
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select("id, user_id, product_id, quantity")
      .eq("user_id", user.id);

    if (error) {
      console.error("Fetch cart error:", error);
      return;
    }

    setCart(normalizeCartRows(data));
  }, [user]);

  const removeDuplicateRows = async (rows) => {
    const duplicateIds = rows.slice(1).map((row) => row.id);

    if (duplicateIds.length === 0) return true;

    const { error } = await supabase.from("cart").delete().in("id", duplicateIds);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  };

  const getCartRows = async (productId) => {
    const { data, error } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId.toString());

    if (error) {
      console.error(error);
      return [];
    }

    return data || [];
  };

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    fetchCart();

    const channel = supabase.channel(`cart-${user.id}`);

    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cart",
        filter: `user_id=eq.${user.id}`,
      },
      fetchCart
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCart, user]);

  const addToCart = async (product) => {
    if (!user || !product?.id) return false;

    const productId = product.id.toString();
    const existingRows = await getCartRows(productId);

    if (existingRows.length > 0) {
      const nextQuantity =
        existingRows.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0) + 1;

      const { error } = await supabase
        .from("cart")
        .update({ quantity: nextQuantity })
        .eq("id", existingRows[0].id);

      if (error) {
        console.error(error);
        return false;
      }

      if (!(await removeDuplicateRows(existingRows))) return false;
    } else {
      const { error } = await supabase.from("cart").insert([
        {
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        },
      ]);

      if (error) {
        console.error(error);
        return false;
      }
    }

    await fetchCart();
    return true;
  };

  const removeFromCart = async (productId) => {
    if (!user || !productId) return false;

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId.toString());

    if (error) {
      console.error(error);
      return false;
    }

    await fetchCart();
    return true;
  };

  const increaseQty = async (productId) => {
    if (!user || !productId) return false;

    const existingRows = await getCartRows(productId);
    if (existingRows.length === 0) return false;

    const nextQuantity =
      existingRows.reduce((sum, row) => sum + (Number(row.quantity) || 0), 0) + 1;

    const { error } = await supabase
      .from("cart")
      .update({ quantity: nextQuantity })
      .eq("id", existingRows[0].id);

    if (error) {
      console.error(error);
      return false;
    }

    if (!(await removeDuplicateRows(existingRows))) return false;

    await fetchCart();
    return true;
  };

  const decreaseQty = async (productId) => {
    if (!user || !productId) return false;

    const existingRows = await getCartRows(productId);
    if (existingRows.length === 0) return false;

    const currentQuantity = existingRows.reduce(
      (sum, row) => sum + (Number(row.quantity) || 0),
      0
    );

    if (currentQuantity <= 1) {
      return removeFromCart(productId);
    }

    const { error } = await supabase
      .from("cart")
      .update({ quantity: currentQuantity - 1 })
      .eq("id", existingRows[0].id);

    if (error) {
      console.error(error);
      return false;
    }

    if (!(await removeDuplicateRows(existingRows))) return false;

    await fetchCart();
    return true;
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        totalItems,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
