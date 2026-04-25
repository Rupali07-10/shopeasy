import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar({ setSearch }) {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#0f0f0f] text-white border-b border-white/10">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-[#d4b06a]">
          ShopEasy
        </Link>

        {/* SEARCH */}
        <input
          placeholder="Search products..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-[40%] bg-[#1a1a1a] px-4 py-2 rounded-full outline-none"
        />

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* USER */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <FaUser />
                <span className="text-sm">{user.email}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 bg-[#171717] border border-white/10 rounded-xl p-3 w-40">
                  <button
                    onClick={logout}
                    className="w-full text-left hover:text-[#d4b06a]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

          {/* WISHLIST */}
          <Link to="/wishlist" className="relative">
            <FaHeart />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link to="/cart" className="relative">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#d4b06a] text-black text-xs px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

        </div>
      </div>
    </div>
  );
}