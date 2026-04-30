import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaMoon, FaSun } from "react-icons/fa";
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  // 🔥 debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("recentSearches")) || [];
  setRecentSearches(saved);
}, []);
  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "U";

  const initial = displayName.charAt(0).toUpperCase();

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔥 suggestions with debounce
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
    setActiveIndex(-1);
  };

  // 🔥 keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        selectSuggestion(suggestions[activeIndex]);
      }
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // 🔥 click selection
  const selectSuggestion = (product) => {
    setQuery(product.title);
    setSearch?.(product.title);
    setShowSuggestions(false);

    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

  // 🔥 highlight matching text
  const highlightMatch = (text) => {
    const value = debouncedQuery.trim();
    if (!value) return text;

    const parts = text.split(new RegExp(`(${value})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === value.toLowerCase() ? (
        <span key={i} className="font-semibold text-[#d4b06a]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const fetchWishCount = useCallback(async () => {
    if (!user) {
      setWishCount(0);
      return;
    }

    const { count, error } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (!error) setWishCount(count || 0);
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

    return () => supabase.removeChannel(channel);
  }, [fetchWishCount, user]);

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          <Link to="/" className="text-xl font-bold text-[#d4b06a]">
            ShopEasy
          </Link>

          {/* 🔍 SEARCH */}
          <div className="relative w-[35%]">
            <input
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-black/40 px-4 py-2 rounded-full outline-none border border-white/20"
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full bg-white dark:bg-[#171717] text-gray-900 dark:text-white rounded-xl shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden">
                {suggestions.map((product, index) => (
                  <button
                    key={product.id}
                    onMouseDown={() => selectSuggestion(product)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                      index === activeIndex
                        ? "bg-gray-200 dark:bg-white/20"
                        : "hover:bg-gray-50 dark:hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-9 h-9 object-contain rounded bg-gray-50 dark:bg-black/20"
                    />

                    <span className="min-w-0">
                      <span className="block text-sm font-medium truncate">
                        {highlightMatch(product.title)}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-stone-400 truncate">
                        {product.category}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
{/* NAV LINKS */}
<div className="hidden md:flex items-center gap-6 text-sm">
  <Link to="/" className="hover:text-[#d4b06a] transition">
    Home
  </Link>

  <button
    onClick={() => scrollToSection("deals")}
    className="hover:text-[#d4b06a] transition"
  >
    Deals
  </button>

  <Link to="/seller" className="hover:text-[#d4b06a] transition">
    Sell
  </Link>
</div>
          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                  {initial}
                </div>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <button onClick={() => setOpenAuth(true)}>Login</button>
            )}

            <Link to="/wishlist" className="relative">
              <FaHeart />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1 rounded-full">
                  {wishCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#d4b06a] text-black text-xs px-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <AuthModal isOpen={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}