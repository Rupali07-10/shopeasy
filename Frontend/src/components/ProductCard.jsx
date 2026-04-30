import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { user } = useAuth();

  // 🔥 rename to avoid confusion
  const { addToCart: addToCartContext } = useCart();

  const [liked, setLiked] = useState(false);

  // ❤️ Wishlist
  const addToWishlist = async () => {
    if (!user) return toast.error("Login first");

    const { data: existing, error: fetchError } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id.toString())
      .limit(1);

    if (fetchError) {
      toast.error(fetchError.message);
      return;
    }

    if (existing?.length > 0) {
      setLiked(true);
      toast.success("Already in wishlist");
      return;
    }

    const { error } = await supabase.from("wishlist").insert([
      {
        user_id: user.id,
        product_id: product.id.toString(),
      },
    ]);

    if (error) {
      toast.error(error.message);
    } else {
      setLiked(true);
      toast.success("Added to wishlist");
    }
  };

  // 🛒 Cart (FIXED)
  const handleAddToCart = async () => {
    if (!user) return toast.error("Login first");

    const added = await addToCartContext(product);

    if (added) {
      toast.success("Added to cart");
    } else {
      toast.error("Could not add item");
    }
  };

  return (
    <div className="group bg-white dark:bg-[#171717] rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-3 flex flex-col border border-gray-100 dark:border-white/10">

      {/* IMAGE + HEART */}
      <div className="relative h-40 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-black/20">

        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
        />

        {/* ❤️ WISHLIST */}
        <button
          onClick={addToWishlist}
          className={`absolute top-2 right-2 rounded-full border bg-white dark:bg-[#222] p-2 shadow-sm hover:scale-110 transition ${
            liked ? "border-red-500" : "border-transparent"
          }`}
        >
          {liked ? (
            <FaHeart className="text-base text-red-500" />
          ) : (
            <FaRegHeart className="text-base text-black dark:text-white" />
          )}
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-3 flex flex-col gap-1 flex-grow">

        <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">
          {product.title}
        </h3>

        <p className="text-lg font-semibold text-gray-900 dark:text-[#d4b06a]">
          ₹{product.price}
        </p>

      </div>

      {/* BUTTONS */}
      <div className="flex gap-2 mt-3">

        {/* VIEW */}
        <Link
          to={`/product/${product.id}`}
          state={{ product }}
          className="flex-1 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white text-sm py-2 rounded text-center hover:border-black dark:hover:border-[#d4b06a] hover:bg-gray-50 dark:hover:bg-white/10 transition"
        >
          View Item
        </Link>

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-black dark:bg-[#d4b06a] text-white dark:text-black text-sm py-2 rounded hover:bg-gray-800 dark:hover:bg-[#e3bf77] transition"
        >
          Add
        </button>

      </div>
    </div>
  );
}
