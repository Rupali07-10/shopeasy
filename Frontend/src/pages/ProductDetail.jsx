import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { state } = useLocation();
  const product = state?.product;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return <div className="text-white p-6">No product</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-6 py-10">

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}
        <div className="bg-[#171717] p-6 rounded-2xl border border-white/10 flex justify-center">
          <img
            src={product.thumbnail}
            className="h-[350px] object-contain"
          />
        </div>

        {/* RIGHT DETAILS */}
        <div>

          <h1 className="text-3xl font-serif mb-2">
            {product.title}
          </h1>

          <p className="text-stone-400 mb-4">
            {product.description}
          </p>

          <p className="text-2xl text-[#d4b06a] mb-4">
            ₹{product.price}
          </p>

          <p className="text-sm text-stone-400 mb-2">
            Category: {product.category}
          </p>

          <p className="text-sm text-stone-400 mb-6">
            Rating: ⭐ {product.rating}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4">

            <button
              onClick={() => {
                addToCart(product);
                toast.success("Added to cart 🛒");
              }}
              className="bg-[#d4b06a] text-black px-6 py-3 rounded-xl hover:bg-[#e3bf77]"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                toggleWishlist(product);
                toast.success(
                  isInWishlist(product.id)
                    ? "Removed ❌"
                    : "Added ❤️"
                );
              }}
              className="border border-white/20 px-6 py-3 rounded-xl"
            >
              {isInWishlist(product.id) ? "Remove ❤️" : "Wishlist ❤️"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}