import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext"; // ✅ added
import customProducts from "../data/customProducts.json";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { user } = useAuth();
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist(); // ✅ added
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoadingProducts(true);

      try {
        // API products
        const res = await axios.get("https://dummyjson.com/products");
        const apiProducts = res.data.products.map((p) => ({
          id: `api-${p.id}`,
          originalId: p.id,
          title: p.title,
          price: Number(p.price) || 0,
          thumbnail: p.thumbnail || p.images?.[0],
        }));

        // Supabase products
        const { data: dbProducts, error } = await supabase
          .from("products")
          .select("*");

        if (error) {
          console.error(error);
          toast.error("Failed to load seller products");
        }

        const formattedDbProducts = (dbProducts || []).map((p) => ({
          id: `db-${p.id}`,
          originalId: p.id,
          title: p.title,
          price: Number(p.price) || 0,
          thumbnail: p.image,
        }));

        // Custom products
        const formattedCustom = customProducts.map((p) => ({
          id: `custom-${p.id}`,
          originalId: p.id,
          title: p.title,
          price: Number(p.price) || 0,
          thumbnail: p.thumbnail,
        }));

        if (isMounted) {
          setProducts([
            ...formattedDbProducts,
            ...formattedCustom,
            ...apiProducts,
          ]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading products");
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔥 Match products
  const enrichedCart = useMemo(
    () =>
      cart.map((item) => {
        const product = products.find(
          (p) =>
            p.id === item.product_id ||
            p.id === `api-${item.product_id}` ||
            p.id === `db-${item.product_id}` ||
            p.id === `custom-${item.product_id}`
        );

        return { ...item, product };
      }),
    [cart, products]
  );

  const total = enrichedCart.reduce(
    (acc, item) =>
      acc + (Number(item.product?.price) || 0) * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  // 🔥 Move to Wishlist
  const moveToWishlist = async (product) => {
    if (!product) return;

    const added = await addToWishlist(product.id);

    if (added) {
      await removeFromCart(product.id);
      toast.success("Moved to wishlist");
    } else {
      toast.error("Failed to move");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-16 transition-colors">
      <Navbar setSearch={() => {}} products={products} />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          My Cart
        </h2>

        {!user ? (
          <p className="text-center text-gray-500 dark:text-stone-400">
            Login to see your cart
          </p>
        ) : enrichedCart.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-stone-400">
            Cart is empty
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {enrichedCart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#171717] p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center gap-4 border border-transparent dark:border-white/10"
              >
                <img
                  src={item.product?.thumbnail || "/favicon.svg"}
                  alt={item.product?.title || "Product"}
                  className="w-24 h-24 object-contain rounded bg-gray-50 dark:bg-black/20"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.product?.title ||
                      (loadingProducts
                        ? "Loading product..."
                        : "Product unavailable")}
                  </h3>

                  <p className="text-gray-500 dark:text-[#d4b06a]">
                    {formatPrice(item.product?.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item.product_id)}
                    className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded text-gray-900 dark:text-white"
                  >
                    -
                  </button>

                  <span className="min-w-8 text-center text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.product_id)}
                    className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded text-gray-900 dark:text-white"
                  >
                    +
                  </button>
                </div>

                {/* 🔥 ACTIONS */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveToWishlist(item.product)}
                    className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-300 dark:hover:text-yellow-200 text-sm font-semibold"
                  >
                    Move to Wishlist
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right mt-6">
              <div className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Total: {formatPrice(total)}
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-500 hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-300 text-black dark:text-black px-4 py-2 rounded transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}