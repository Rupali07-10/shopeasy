import { useState } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";

const initialForm = {
  title: "",
  description: "",
  brand: "",
  category: "deals",
  price: "",
  thumbnail: "",
};

const categories = [
  "women-fashion",
  "men-fashion",
  "electronics",
  "deals",
  "kids",
  "home-appliances",
  "jewellery",
  "healthcare",
];

export default function Seller() {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState(() => {
    return JSON.parse(localStorage.getItem("sellerProducts")) || [];
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
     if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  updateField("thumbnail", imageUrl);
};

  const saveProducts = (nextProducts) => {
    setProducts(nextProducts);
    localStorage.setItem("sellerProducts", JSON.stringify(nextProducts));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const price = Number(form.price);

    if (!title || !price || price <= 0) return;

    const newProduct = {
      id: `seller-${Date.now()}`,
      title,
      description: form.description.trim() || "Seller listed product",
      brand: form.brand.trim() || "ShopEasy Seller",
      category: form.category,
      rating: 4.5,
      price,
      stock: 1,
      thumbnail: form.thumbnail.trim() || "/favicon.svg",
      images: [form.thumbnail.trim() || "/favicon.svg"],
    };

    saveProducts([newProduct, ...products]);
    setForm(initialForm);
  };

  const removeProduct = (id) => {
    saveProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-[104px] transition-colors">
      <Navbar setSearch={() => {}} products={products} />
      <CategoryBar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Seller Dashboard
        </h1>
        <div className="w-20 h-1 bg-[#d4b06a] mx-auto mt-2 mb-8 rounded"></div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border border-gray-100 dark:border-white/10 p-5 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                Product name
              </label>
              <input
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#d4b06a]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="w-full min-h-24 rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#d4b06a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                  Brand
                </label>
                <input
                  value={form.brand}
                  onChange={(event) => updateField("brand", event.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#d4b06a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  className="w-full rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#d4b06a]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="w-full rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#d4b06a]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-stone-300 mb-1">
  Product Image
</label>

{/* URL INPUT */}
<input
  value={form.thumbnail}
  onChange={(event) => updateField("thumbnail", event.target.value)}
  className="w-full rounded border border-gray-300 dark:border-white/15 bg-white dark:bg-black/20 px-3 py-2 text-gray-900 dark:text-white outline-none focus:border-[#d4b06a]"
  placeholder="Paste image URL..."
/>

<p className="text-xs text-gray-400 mt-1 text-center">OR</p>

{/* FILE UPLOAD */}
<input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="mt-2 w-full text-sm text-gray-600 dark:text-gray-300"
/>

{/* PREVIEW */}
{form.thumbnail && (
  <img
    src={form.thumbnail}
    alt="preview"
    className="mt-3 h-24 object-contain border rounded"
  />
)}
            </div>

            <button
              type="submit"
              className="w-full bg-black dark:bg-[#d4b06a] text-white dark:text-black py-2 rounded font-medium hover:bg-gray-800 dark:hover:bg-[#e3bf77] transition"
            >
              Add Product
            </button>
          </form>

          <section className="min-w-0">
            {products.length === 0 ? (
              <div className="bg-white dark:bg-[#171717] rounded-lg shadow-sm p-10 text-center border border-transparent dark:border-white/10">
                <p className="text-gray-500 dark:text-stone-400">
                  No seller products yet
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border border-gray-100 dark:border-white/10 p-4 flex flex-col gap-3"
                  >
                    <div className="h-36 flex items-center justify-center bg-gray-50 dark:bg-black/20 rounded">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                        {product.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-stone-400">
                        {product.category}
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-[#d4b06a]">
                        Rs. {product.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="border border-red-500 text-red-500 text-sm py-2 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
