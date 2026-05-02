import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import customProducts from "../data/customProducts.json";
import BannerCarousel from "../components/BannerCarousel";
import { supabase } from "../services/supabaseClient";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        //  Dummy API
        const res = await axios.get("https://dummyjson.com/products");
        const apiProducts = res.data.products;

        //  Supabase products
        const { data: dbProducts, error } = await supabase
          .from("products")
          .select("*");

        if (error) console.error("DB error:", error);

        //  Format DB products
        const formattedDbProducts = (dbProducts || []).map((p) => ({
          id: `db-${p.id}`,
          title: p.title,
          price: p.price,
          category: p.category,
          thumbnail: p.image,
        }));

        // Format API products (normalize category)
        const formattedApiProducts = apiProducts.map((p) => ({
          ...p,
          id: `api-${p.id}`,
          category:
            p.category.includes("womens")
              ? "women-fashion"
              : p.category.includes("mens")
              ? "men-fashion"
              : ["smartphones", "laptops"].includes(p.category)
              ? "electronics"
              : p.category,
        }));

        //  Format custom JSON
        const formattedCustomProducts = customProducts.map((p) => ({
          ...p,
          id: `custom-${p.id}`,
        }));

        //  Combine all sources
        setProducts([
          ...formattedDbProducts,
          ...formattedCustomProducts,
          ...formattedApiProducts,
        ]);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const filterBySearch = (list) =>
    list.filter((p) =>
      p.title?.toLowerCase().includes(search.toLowerCase())
    );

  const searchedProducts = filterBySearch(products);
  const categorySections =
  search.trim().length > 0
    ? [
        {
          id: "search",
          title: "Search Results",
          products: searchedProducts,
        },
      ]
    : [
        {
          id: "women",
          title: "Women Fashion",
          products: products.filter((p) => p.category === "women-fashion"),
        },
        {
          id: "men",
          title: "Men Fashion",
          products: products.filter((p) => p.category === "men-fashion"),
        },
        {
          id: "electronics",
          title: "Electronics",
          products: products.filter((p) => p.category === "electronics"),
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

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-[104px] transition-colors">

      <Navbar setSearch={setSearch} />
      <CategoryBar />

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
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white">
              {section.title}
            </h2>
            <div className="w-20 h-1 bg-[#d4b06a] mx-auto mt-2 mb-6 rounded tracking-wide"></div>
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
