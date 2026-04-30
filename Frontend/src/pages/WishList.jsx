import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import customProducts from "../data/customProducts.json";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const sellerProducts =
        JSON.parse(localStorage.getItem("sellerProducts")) || [];
      const normalizedSellerProducts = sellerProducts.map((product) => ({
        ...product,
        price: Number(product.price) || 0,
        category: product.category?.toLowerCase(),
      }));

      try {
        const res = await axios.get("https://dummyjson.com/products");
        const apiProducts = res.data.products.map((product) => ({
          ...product,
          thumbnail: product.thumbnail || product.images?.[0],
          category: product.category?.toLowerCase(),
        }));

        setProducts([
          ...normalizedSellerProducts,
          ...customProducts,
          ...apiProducts,
        ]);
      } catch (error) {
        console.error(error);
        setProducts([...normalizedSellerProducts, ...customProducts]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const fetchWishlist = async () => {
      const { data } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", user.id);

      setWishlist(data || []);
    };

    fetchWishlist();
  }, [user]);

  const enrichedWishlist = wishlist
    .map((item) => {
      const product = products.find(
        (p) => p.id.toString() === item.product_id
      );

      return { ...item, product };
    })
    .filter((item) => item.product);

  const removeItem = async (id) => {
    await supabase.from("wishlist").delete().eq("id", id);
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-28 transition-colors">
      <Navbar setSearch={() => {}} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">Your Wishlist</h1>
        <div className="w-20 h-1 bg-[#d4b06a] mx-auto mt-2 mb-8 rounded"></div>

        {!user ? (
          <div className="bg-white dark:bg-[#171717] rounded-xl shadow-sm p-10 text-center border border-transparent dark:border-white/10">
            <p className="text-gray-500 dark:text-stone-400">Login to see your wishlist</p>
          </div>
        ) : enrichedWishlist.length === 0 ? (
          <div className="bg-white dark:bg-[#171717] rounded-xl shadow-sm p-10 text-center border border-transparent dark:border-white/10">
            <p className="text-gray-500 dark:text-stone-400">
              Your wishlist is looking a bit empty
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {enrichedWishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#171717] rounded-xl shadow-sm hover:shadow-md transition duration-300 p-3 flex flex-col border border-transparent dark:border-white/10"
              >
                <div className="h-36 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-black/20">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="h-full object-contain"
                  />
                </div>

                <div className="mt-2 flex flex-col gap-1 flex-grow">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">
                    {item.product.title}
                  </h3>

                  <p className="text-base font-semibold text-gray-900 dark:text-[#d4b06a]">
                    Rs. {item.product.price}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="mt-3 border border-red-500 text-red-500 text-sm py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
