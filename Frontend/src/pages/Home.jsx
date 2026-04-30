import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import customProducts from "../data/customProducts.json";
import BannerCarousel from "../components/BannerCarousel";

export default function Home() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("https://dummyjson.com/products");

        // 🔥 Normalize API data
        const apiProducts = res.data.products.map((p) => ({
          ...p,
          thumbnail: p.thumbnail || p.images?.[0],
          category: p.category?.toLowerCase(),
        }));

        const sellerProducts =
          JSON.parse(localStorage.getItem("sellerProducts")) || [];

        const normalizedSellerProducts = sellerProducts.map((p) => ({
          ...p,
          price: Number(p.price),
          category: p.category?.toLowerCase(),
        }));

        setProducts([
          ...normalizedSellerProducts,
          ...customProducts,
          ...apiProducts,
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    getProducts();
  }, []);
  const filterBySearch = (list) =>
    list.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );

  // 🔥 CATEGORY LOGIC (CORRECT)
  const categorySections = [
    {
      id: "women",
      title: "Women Fashion",
      products: products.filter((p) => p.category?.includes("women")),
    },
    {
      id: "men",
      title: "Men Fashion",
      products: products.filter(
        (p) => p.category === "men-fashion" || p.category?.startsWith("mens")
      ),
    },
    {
      id: "electronics",
      title: "Electronics",
      products: products.filter((p) =>
        ["electronics", "smartphones", "laptops"].includes(p.category)
      ),
    },
    {
      id: "deals",
      title: "Today's Deals",
      products: products.filter((p) => p.category === "deals"),
    },
    {
      id: "kids",
      title: "Kids",
      products: products.filter((p) => p.category === "kids"),
    },
    {
      id: "home-appliances",
      title: "Home Appliances",
      products: products.filter((p) => p.category === "home-appliances"),
    },
    {
      id: "jewellery",
      title: "Jewellery",
      products: products.filter((p) => p.category === "jewellery"),
    },
    {
      id: "healthcare",
      title: "Healthcare",
      products: products.filter((p) => p.category === "healthcare"),
    },
  ];

  useEffect(() => {
    const target = location.state?.scrollTo;
    const selectedSearch = location.state?.search;

    if (selectedSearch) {
      setSearch(selectedSearch);
    }

    if (!target || products.length === 0) return;

    const timeout = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.state, products.length]);

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-[104px] transition-colors">

      <Navbar setSearch={setSearch} products={products} />
      <CategoryBar />

      {/* 🔥 HERO BANNER */}
      <BannerCarousel products={products} />

      {categorySections.map((section) => {
        const sectionProducts = filterBySearch(section.products);

        if (sectionProducts.length === 0) return null;

        return (
          <div
            key={section.id}
            id={section.id}
            className="max-w-7xl mx-auto px-4 mt-10 scroll-mt-24 last:mb-10"
          >
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-[#d4b06a] mx-auto mt-2 mb-6 rounded"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {sectionProducts.map((p, i) => (
                <ProductCard key={p.id || i} product={p} />
              ))}
            </div>
          </div>
        );
      })}

      <Footer />
    </div>
  );
}
