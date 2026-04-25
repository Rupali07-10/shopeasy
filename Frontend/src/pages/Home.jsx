import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import customProducts from "../data/customProducts.json";
import BannerCarousel from "../components/BannerCarousel";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get("https://dummyjson.com/products");
        const apiProducts = res.data.products;

        const sellerProducts =
          JSON.parse(localStorage.getItem("sellerProducts")) || [];

        const normalizedSellerProducts = sellerProducts.map((p) => ({
          ...p,
          price: Number(p.price),
        }));

        setProducts([
          ...normalizedSellerProducts,
          ...customProducts,
          ...apiProducts,
        ]);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // 🔥 SEARCH FILTER
  const filterBySearch = (list) =>
    list.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );

  // 🔥 CATEGORY GROUPING
  const womenProducts = filterBySearch(
    products.filter((p) =>
      p.category?.toLowerCase().includes("women")
    )
  );

  const menProducts = filterBySearch(
    products.filter((p) =>
      p.category?.toLowerCase().includes("men")
    )
  );

  const electronicsProducts = filterBySearch(
    products.filter((p) =>
      p.category?.toLowerCase().includes("electronics") ||
      p.category?.toLowerCase().includes("smartphones") ||
      p.category?.toLowerCase().includes("laptops")
    )
  );
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar setSearch={setSearch} />
      <CategoryBar />
      <BannerCarousel />
      <div id="women" className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-2xl font-bold mb-6 mt-2 text-center">Women Fashion</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {womenProducts.map((p, i) => (
            <ProductCard key={p.id || i} product={p} />
          ))}
        </div>
      </div>
      <div id="men" className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-2xl font-bold mb-6 mt-2 text-center">Men Fashion</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {menProducts.map((p, i) => (
            <ProductCard key={p.id || i} product={p} />
          ))}
        </div>
      </div>
      <div id="electronics" className="max-w-7xl mx-auto px-4 mt-14">
        <h2 className="text-2xl font-bold mb-6 mt-2 text-center">Electronics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {electronicsProducts.map((p, i) => (
            <ProductCard key={p.id || i} product={p} />
          ))}
        </div>
      </div>

      <Footer />

    </div>
  );
}