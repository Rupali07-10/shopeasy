import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaMoon,
  FaSun,
  FaUser,
  FaSearch,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { supabase } from "../services/supabaseClient";
import AuthModal from "../context/AuthModal";
export default function Navbar({ setSearch, products = [] }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [wishCount, setWishCount] = useState(0);
  const [openAuth, setOpenAuth] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("keydown", esc);
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu")) {
        setShowUserMenu(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const userName =
    user?.user_metadata?.name?.trim() ||
    user?.user_metadata?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "User";
  const firstName = userName.split(" ")[0];
  const userImage = user?.user_metadata?.avatar_url || null;
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", {
        state: { scrollTo: id },
      });
      return;
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };
  const suggestions = products
    .filter((product) => {
      const value = debouncedQuery.trim().toLowerCase();
      if (!value) return false;
      return (
        product.title?.toLowerCase().includes(value) ||
        product.category?.toLowerCase().includes(value) ||
        product.brand?.toLowerCase().includes(value)
      );
    })
    .slice(0, 6);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSearch?.(value);
    setShowSuggestions(true);
  };
  const selectSuggestion = (product) => {
    setQuery(product.title);
    setSearch?.(product.title);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };
  const fetchWishCount = useCallback(async () => {
    if (!user) {
      setWishCount(0);
      return;
    }
    const { count } = await supabase
      .from("wishlist")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);
    setWishCount(count || 0);
  }, [user]);
  useEffect(() => {
    if (!user) return;
    fetchWishCount();
    const channel = supabase
      .channel(`wishlist-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist",
          filter: `user_id=eq.${user.id}`,
        },
        fetchWishCount
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWishCount, user]);
  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <button
            onClick={toggleMenu}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
          <Link
            to="/"
            className="text-xl font-bold text-[#d4b06a]"
          >
            ShopEasy
          </Link>
          <div className="relative w-[35%] hidden md:block">
            <input
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              className="w-full bg-black/40 px-4 py-2 rounded-full border border-white/20 outline-none"
            />
            {/* SUGGESTIONS */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-[#171717] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => selectSuggestion(product)}
                    className="w-full px-4 py-3 text-left hover:bg-white/10 text-sm"
                  >
                    {product.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="md:hidden"
            onClick={() =>
              setShowSearch((prev) => !prev)
            }
          >
            <FaSearch />
          </button>
          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/">Home</Link>
            <button
              onClick={() =>
                scrollToSection("deals")
              }
            >
              Deals
            </button>
            <Link to="/seller">
              Sell
            </Link>
          </div>
          {/* RIGHT */}
          <div className="flex items-center gap-5">
            {/* THEME TOGGLE - DESKTOP */}
<button
  onClick={toggleTheme}
  className="hidden md:flex items-center justify-center w-10 h-10  border-white/20"
  title={isDark ? "Light Mode" : "Dark Mode"}
>
  {isDark ? (
    <FaSun className="text-yellow-400 text-lg" />
  ) : (
    <FaMoon className="text-gray-300 text-lg" />
  )}
</button>
            {/* USER */}
            {user ? (
              <div className="relative user-menu">
                <button
                  onClick={() =>
                    setShowUserMenu((prev) => !prev)
                  }
                  className="flex items-center gap-2"
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="user"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )}
                  {/* DESKTOP ONLY */}
                  <span className="hidden md:block text-sm">
                    {firstName}
                  </span>
                </button>
                {/* DROPDOWN */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="font-semibold text-sm">
                        {userName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/orders");
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setOpenAuth(true)}
              >
                <FaUser />
              </button>
            )}
            {/* WISHLIST */}
            <Link
              to="/wishlist"
              className="relative"
            >
              <FaHeart />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 w-4 h-4 rounded-full flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>
            {/* CART */}
            <Link
              to="/cart"
              className="relative"
            >
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-500 w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
        {/* MOBILE SEARCH */}
        {showSearch && (
          <div className="md:hidden px-4 pb-3">
            <input
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              className="w-full bg-black/40 px-4 py-2 rounded-full border border-white/20 outline-none"
            />
          </div>
        )}
      </div>
      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#111] text-white z-[70] transform transition-transform duration-300 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-[#d4b06a]">
            Menu
          </h2>
          <button
            onClick={toggleMenu}
            className="text-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col p-5 gap-5 text-sm">
          <Link
            to="/"
            onClick={toggleMenu}
            className="hover:text-[#d4b06a]"
          >
            Home
          </Link>
          <button
            onClick={() => {
              scrollToSection("deals");
              toggleMenu();
            }}
            className="text-left hover:text-[#d4b06a]"
          >
            Deals
          </button>
          <Link
            to="/seller"
            onClick={toggleMenu}
            className="hover:text-[#d4b06a]"
          >
            Sell Products
          </Link>
          <Link
            to="/orders"
            onClick={toggleMenu}
            className="hover:text-[#d4b06a]"
          >
            My Orders
          </Link>
          <Link
            to="/profile"
            onClick={toggleMenu}
            className="hover:text-[#d4b06a]"
          >
            Profile
          </Link>
<button
  onClick={toggleTheme}
  className="text-left hover:text-[#d4b06a]">
  {isDark ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>
        </div>
      </div>
      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={toggleMenu}
        />
      )}
      <AuthModal
        isOpen={openAuth}
        onClose={() => setOpenAuth(false)}
      />
    </>
  );
}