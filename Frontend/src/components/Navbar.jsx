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

  // 🔥 NEW: mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

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

    if (e.key === "Enter" && activeIndex >= 0) {
      selectSuggestion(suggestions[activeIndex]);
    }

    if (e.key === "Escape") setShowSuggestions(false);
  };

  const selectSuggestion = (product) => {
    setQuery(product.title);
    setSearch?.(product.title);
    setShowSuggestions(false);

    navigate(`/product/${product.id}`, {
      state: { product },
    });
  };

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

    const { count } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
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

    return () => supabase.removeChannel(channel);
  }, [fetchWishCount, user]);

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

          {/* 🔥 Hamburger (mobile only) */}
          <button onClick={toggleMenu} className="md:hidden text-xl">
            ☰
          </button>

          <Link to="/" className="text-xl font-bold text-[#d4b06a]">
            ShopEasy
          </Link>

          {/* SEARCH */}
          <div className="relative w-[35%]">
            <input
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-black/40 px-4 py-2 rounded-full outline-none border border-white/20"
            />
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-[#d4b06a]">Home</Link>
            <button onClick={() => scrollToSection("deals")}>Deals</button>
            <Link to="/seller">Sell</Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <button onClick={toggleTheme}>
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {user ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <button onClick={() => setOpenAuth(true)}>Login</button>
            )}

            <Link to="/wishlist"><FaHeart /></Link>
            <Link to="/cart"><FaShoppingCart /></Link>
          </div>
        </div>
      </div>

      {/* 🔥 MOBILE DRAWER */}
<div
  className={`fixed top-0 left-0 h-full w-[260px] bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
    menuOpen ? "translate-x-0" : "-translate-x-full"
  } md:hidden`}
  onTouchStart={(e) => (window.startX = e.touches[0].clientX)}
  onTouchEnd={(e) => {
    const endX = e.changedTouches[0].clientX;
    if (window.startX - endX > 50) setMenuOpen(false); // swipe left to close
  }}
>
  {/* HEADER */}
  <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
    <span className="text-lg font-semibold text-[#d4b06a]">Menu</span>
    <button onClick={toggleMenu} className="text-xl">✕</button>
  </div>

  {/* MENU ITEMS */}
  <div className="flex flex-col gap-5 px-5 py-6 text-base">

    <Link
      to="/"
      onClick={toggleMenu}
      className="flex items-center gap-3 hover:text-[#d4b06a]"
    >
      🏠 Home
    </Link>

    <button
      onClick={() => {
        scrollToSection("deals");
        toggleMenu();
      }}
      className="flex items-center gap-3 hover:text-[#d4b06a]"
    >
      🔥 Deals
    </button>

    <Link
      to="/seller"
      onClick={toggleMenu}
      className="flex items-center gap-3 hover:text-[#d4b06a]"
    >
      💼 Sell
    </Link>

    <Link
      to="/wishlist"
      onClick={toggleMenu}
      className="flex items-center gap-3 hover:text-[#d4b06a]"
    >
      ❤️ Wishlist
    </Link>

    <Link
      to="/cart"
      onClick={toggleMenu}
      className="flex items-center gap-3 hover:text-[#d4b06a]"
    >
      🛒 Cart
    </Link>
  </div>
</div>

{/* 🔥 OVERLAY */}
{menuOpen && (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
    onClick={toggleMenu}
  />
)}

      <AuthModal isOpen={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}