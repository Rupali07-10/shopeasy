import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🛒 ADD TO CART LOGIC
  const handleCart = () => {
    if (!user) {
      toast.error("Please login first 🔐");
      navigate("/login");
      return;
    }

    addToCart(product);
    toast.success("Added to cart 🛒");
  };

  // ❤️ WISHLIST LOGIC
  const handleWishlist = () => {
    if (!user) {
      toast.error("Login to use wishlist ❤️");
      navigate("/login");
      return;
    }

    toggleWishlist(product);

    if (isInWishlist(product.id)) {
      toast("Removed from wishlist ❌");
    } else {
      toast.success("Added to wishlist ❤️");
    }
  };

  return (
    <div className="bg-[#171717] rounded-2xl overflow-hidden border border-white/10 hover:scale-[1.02] transition">

      {/* IMAGE */}
      <div className="relative">
        <img
          src={product.thumbnail}
          className="h-56 w-full object-cover"
        />

        {/* ❤️ */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-black/60 p-2 rounded-full text-white"
        >
          {isInWishlist(product.id) ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 text-white">

        <h3 className="font-semibold">{product.title}</h3>

        <p className="text-[#d4b06a] mt-1">₹{product.price}</p>

        {/* BUTTONS */}
        <div className="mt-3 flex gap-2">

          <Link
            to={`/product/${product.id}`}
            state={{ product }}
            className="flex-1 bg-[#d4b06a] text-black py-2 rounded-lg text-center"
          >
            View
          </Link>

          <button
            onClick={handleCart}
            className="flex-1 border border-[#d4b06a] text-[#d4b06a] py-2 rounded-lg"
          >
            Add
          </button>

        </div>

      </div>
    </div>
  );
}