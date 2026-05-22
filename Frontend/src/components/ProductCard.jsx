import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isLiked = wishlist.some(
    (item) => item.product_id === product.id.toString()
  );
  const toggleWishlist = async () => {
    if (!user) return toast.error("Login first");
    if (isLiked) {
      const ok = await removeFromWishlist(product.id);
      if (ok) toast.success("Removed from wishlist");
      else toast.error("Failed to remove");
    } else {
      const ok = await addToWishlist(product.id);
      if (ok) toast.success("Added to wishlist");
      else toast.error("Failed to add");
    }
  };
  const handleAddToCart = async () => {
    if (!user) return toast.error("Login first");

    const added = await addToCartContext(product);

    if (added) toast.success("Added to cart");
    else toast.error("Could not add item");
  };
  return (
    <div className="group bg-white dark:bg-[#171717] rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-3 flex flex-col border border-gray-100 dark:border-white/10">
      <div className="relative h-40 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-black/20">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
        />
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 rounded-full border bg-white dark:bg-[#222] p-2 shadow-sm hover:scale-110 transition ${
            isLiked ? "border-red-500" : "border-transparent"
          }`}
        >
          {isLiked ? (
            <FaHeart className="text-base text-red-500" />
          ) : (
            <FaRegHeart className="text-base text-black dark:text-white" />
          )}
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-1 flex-grow">
        <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">
          {product.title}
        </h3>
        <p className="text-lg font-semibold text-gray-900 dark:text-[#d4b06a]">
          ₹{product.price}
        </p>
      </div>
      <div className="flex gap-2 mt-3">
        <Link
          to={`/product/${product.id}`}
          state={{ product }}
          className="flex-1 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white text-sm py-2 rounded text-center hover:border-black dark:hover:border-[#d4b06a] hover:bg-gray-50 dark:hover:bg-white/10 transition">View Item </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-black dark:bg-[#d4b06a] text-white dark:text-black text-sm py-2 rounded hover:bg-gray-800 dark:hover:bg-[#e3bf77] transition">Add</button>
      </div>
    </div>
  );
}