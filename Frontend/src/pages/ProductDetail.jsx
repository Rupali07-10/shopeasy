import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import customProducts from "../data/customProducts.json";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { supabase } from "../services/supabaseClient";
export default function ProductDetail() {
  const { state } = useLocation();
  const product = state?.product;
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);

  useEffect(() => {
  const getProducts = async () => {
    try {
      // 1️⃣ API products
      const res = await axios.get("https://dummyjson.com/products");
      const apiProducts = res.data.products.map((p) => ({
        ...p,
        id: `api-${p.id}`,
        thumbnail: p.thumbnail || p.images?.[0],
        category:
          p.category?.includes("womens")
            ? "women-fashion"
            : p.category?.includes("mens")
            ? "men-fashion"
            : ["smartphones", "laptops"].includes(p.category)
            ? "electronics"
            : p.category,
      }));

      // 2️⃣ Supabase products
      const { data: dbProducts, error } = await supabase
        .from("products")
        .select("*");

      if (error) console.error(error);

      const formattedDbProducts = (dbProducts || []).map((p) => ({
        id: `db-${p.id}`,
        title: p.title,
        price: p.price,
        category: p.category,
        thumbnail: p.image,
        description: p.description,
        rating: 4.5,
      }));

      // 3️⃣ Custom JSON
      const formattedCustomProducts = customProducts.map((p) => ({
        ...p,
        id: `custom-${p.id}`,
      }));

      // 🔥 FINAL COMBINE
      setProducts([
        ...formattedDbProducts,
        ...formattedCustomProducts,
        ...apiProducts,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  getProducts();
}, []);
  const similarProducts = products
    .filter((item) => {
      if (!product || item.id === product.id) return false;

      const sameCategory = item.category === product.category;
      const titleWords = product.title?.toLowerCase().split(/\s+/) || [];
      const sharedTitleWord = titleWords.some(
        (word) => word.length > 3 && item.title?.toLowerCase().includes(word)
      );

      return sameCategory || sharedTitleWord;
    })
    .slice(0, 5);

  if (!product) {
    return (
      <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-28 transition-colors">
        <Navbar setSearch={() => {}} products={products} />
        <CategoryBar />
        <main className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-white dark:bg-[#171717] rounded-xl shadow-sm p-10 text-center border border-transparent dark:border-white/10">
            <p className="text-gray-500 dark:text-stone-400">
              Product not found
            </p>
            <Link
              to="/"
              className="inline-block mt-4 text-sm font-medium text-[#b8944f] hover:underline"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-28 transition-colors">
      <Navbar setSearch={() => {}} products={products} />
      <CategoryBar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <Link
          to="/"
          className="text-sm font-medium text-[#b8944f] hover:underline mb-4 inline-block"
        >
          Back to Home
        </Link>

        <div className="bg-white dark:bg-[#171717] rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-5 md:p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-black/20 rounded-lg">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-contain p-4"
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              {product.title}
            </h1>

            <p className="text-sm text-gray-600 dark:text-stone-400 mb-4">
              {product.description}
            </p>

            <p className="text-3xl font-semibold text-gray-900 dark:text-[#d4b06a] mb-4">
              Rs. {product.price}
            </p>

            <div className="space-y-2 text-sm text-gray-600 dark:text-stone-400 mb-6">
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Category:
                </span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Rating:
                </span>{" "}
                {product.rating || "4.5"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={async () => {
                  if (!user) return toast.error("Login first");

                  const added = await addToCart(product);

                  if (added) {
                    toast.success("Added to cart");
                  } else {
                    toast.error("Could not add item");
                  }
                }}
                className="bg-black dark:bg-[#d4b06a] text-white dark:text-black px-6 py-3 rounded hover:bg-gray-800 dark:hover:bg-[#e3bf77] transition"
              >
                Add to Cart
              </button>

              <button
                onClick={() => {
                  if (!user) return toast.error("Login first");
                  toggleWishlist(product);
                  toast.success(
                    isInWishlist(product.id)
                      ? "Removed from wishlist"
                      : "Added to wishlist"
                  );
                }}
                className="border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white px-6 py-3 rounded hover:bg-gray-50 dark:hover:bg-white/10 transition"
              >
                {isInWishlist(product.id) ? "Remove Wishlist" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              Similar Products
            </h2>
            <div className="w-20 h-1 bg-[#d4b06a] mx-auto mt-2 mb-6 rounded"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
