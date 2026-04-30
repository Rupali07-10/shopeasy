import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import customProducts from "../data/customProducts.json";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart() {
  const { user } = useAuth();
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoadingProducts(true);

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

        if (isMounted) {
          setProducts([
            ...normalizedSellerProducts,
            ...customProducts,
            ...apiProducts,
          ]);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setProducts([...normalizedSellerProducts, ...customProducts]);
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const enrichedCart = useMemo(
    () =>
      cart.map((item) => {
        const product = products.find(
          (candidate) => candidate.id?.toString() === item.product_id
        );

        return {
          ...item,
          product,
        };
      }),
    [cart, products]
  );

  const total = enrichedCart.reduce(
    (acc, item) => acc + (Number(item.product?.price) || 0) * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-16 transition-colors">
      <Navbar setSearch={() => {}} products={products} />

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          My Cart
        </h2>

        {!user ? (
          <p className="text-center text-gray-500 dark:text-stone-400">
            Login to see your cart
          </p>
        ) : enrichedCart.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-stone-400">
            Cart is empty
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {enrichedCart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#171717] p-4 rounded-lg shadow flex flex-col sm:flex-row sm:items-center gap-4 border border-transparent dark:border-white/10"
              >
                <img
                  src={item.product?.thumbnail || "/favicon.svg"}
                  alt={item.product?.title || "Product"}
                  className="w-24 h-24 object-contain rounded bg-gray-50 dark:bg-black/20"
                />

                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.product?.title ||
                      (loadingProducts ? "Loading product..." : "Product unavailable")}
                  </h3>

                  <p className="text-gray-500 dark:text-[#d4b06a]">
                    {formatPrice(item.product?.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(item.product_id)}
                    className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded text-gray-900 dark:text-white"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>

                  <span className="min-w-8 text-center text-gray-900 dark:text-white">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.product_id)}
                    className="w-8 h-8 bg-gray-200 dark:bg-white/10 rounded text-gray-900 dark:text-white"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 text-sm font-medium self-start sm:self-auto"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="text-right mt-6 text-xl font-semibold text-gray-900 dark:text-white">
              Total: {formatPrice(total)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
