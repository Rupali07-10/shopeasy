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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // 🔥 NEW
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  // debounce
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
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".user-menu") ){
        setShowUserMenu(false);}
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }
  , []);
  // 🔥 USER INFO
  const userName =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const userImage = user?.user_metadata?.avatar_url || null;

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

          {/* HAMBURGER */}
          <button onClick={toggleMenu} className="md:hidden text-xl">
            ☰
          </button>

          <Link to="/" className="text-xl font-bold text-[#d4b06a]">
            ShopEasy
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="relative w-[35%] hidden md:block">
            <input
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              className="w-full bg-black/40 px-4 py-2 rounded-full border border-white/20"
            />
          </div>

          {/* MOBILE SEARCH ICON */}
          <button
            className="md:hidden"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <FaSearch />
          </button>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/">Home</Link>
            <button onClick={() => scrollToSection("deals")}>Deals</button>
            <Link to="/seller">Sell</Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">

            <button onClick={toggleTheme}>
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {/* USER */}
            {user ? (
              <div className="relative user-menu">
  <button
    onClick={() => setShowUserMenu((prev) => !prev)}
    className="flex items-center gap-2"
  >
    {userImage ? (
      <img
        src={userImage}
        className="w-7 h-7 rounded-full object-cover"
      />
    ) : (
      <FaUser />
    )}

    <span className="hidden md:block text-sm">
      {userName.split(" ")[0]}
    </span>
  </button>

  {/* 🔥 DROPDOWN */}
  {showUserMenu && (
    <div className="absolute right-0 mt-2 w-44 bg-[#111] border border-white/10 rounded-lg shadow-lg z-50">
      
      <div className="px-4 py-3 border-b border-white/10 text-sm">
        <p className="text-white font-semibold">{user?.user_metadata?.name||"User"}</p>
        <p className="text-gray-400 text-xs">{user?.email}</p>
      </div>
<button
  onClick={() => navigate("/profile")}
  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10">
       Profile
      </button>
      <button
  onClick={() => navigate("/orders")}
  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10"
>
  My Orders
</button>
      <button
        onClick={() => {
          logout();
          setShowUserMenu(false);
        }}
        className="w-full text-left px-4 py-2 text-sm hover:bg-white/10"
      >
        Logout
      </button>
    </div>
  )}
</div>
            ) : (
              <button onClick={() => setOpenAuth(true)}>
                <FaUser />
              </button>
            )}

            {/* WISHLIST */}
            <Link to="/wishlist" className="relative">
              <FaHeart />
              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 px-1 rounded-full">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* CART */}
            <Link to="/cart" className="relative">
              <FaShoppingCart />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 px-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        {showSearch && (
          <div className="md:hidden px-4 pb-2">
            <input
              placeholder="Search..."
              value={query}
              onChange={handleSearchChange}
              className="w-full bg-black/40 px-4 py-2 rounded-full border border-white/20"
            />
          </div>
        )}
      </div>

      <AuthModal isOpen={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
}