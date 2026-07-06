import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import customProducts from "../data/customProducts.json";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { supabase } from "../services/supabaseClient";
import toast from "react-hot-toast";
export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://dummyjson.com/products");
        const apiProducts = res.data.products.map((p) => ({
          id: `api-${p.id}`,
          title: p.title,
          price: Number(p.price),
          thumbnail: p.thumbnail,
        }));
        const { data: dbProducts } = await supabase
          .from("products")
          .select("*");
        const formattedDb = (dbProducts || []).map((p) => ({
          id: `db-${p.id}`,
          title: p.title,
          price: Number(p.price),
          thumbnail: p.image,
        }));
        const formattedCustom = customProducts.map((p) => ({
          id: `custom-${p.id}`,
          title: p.title,
          price: Number(p.price),
          thumbnail: p.thumbnail,
        }));
        setProducts([
          ...formattedDb,
          ...formattedCustom,
          ...apiProducts,
        ]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);
  const enrichedWishlist = wishlist
    .map((item) => {
      const product = products.find(
        (p) => p.id === item.product_id
      );
      return { ...item, product };
    })
    .filter((item) => item.product);
  const removeItem = async (productId) => {
    const ok = await removeFromWishlist(productId);
    if (ok) toast.success("Removed from wishlist");
  };
  const moveToCart = async (product) => {
    const added = await addToCart(product);
    if (added) {
      await removeFromWishlist(product.id);
      toast.success("Moved to cart");
    } else {
      toast.error("Failed to move");
    }
  };
  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-28 transition-colors">
      <Navbar setSearch={() => {}} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          My Wishlist
        </h1>
        <div className="w-20 h-1 bg-[#d4b06a] mx-auto mt-2 mb-8 rounded"></div>
        {!user ? (
          <p className="text-center text-gray-500">
            Login to see your wishlist
          </p>
        ) : enrichedWishlist.length === 0 ? (
          <p className="text-center text-gray-500">
            Your wishlist is empty
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {enrichedWishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#171717] p-3 rounded-xl"
              >
                <img
                  src={item.product.thumbnail}
                  className="h-32 object-contain mx-auto"
                />
                <h3 className="text-sm mt-2 text-white">
                  {item.product.title}
                </h3>
                <p className="text-[#d4b06a]">
                  ₹{item.product.price}
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => moveToCart(item.product)}
                    className="bg-black dark:bg-[#d4b06a] text-white dark:text-black text-sm py-1 rounded hover:opacity-90"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}