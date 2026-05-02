import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
const initialForm = {
  title: "",
  description: "",
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
  const { user } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
   const [uploading, setUploading] = useState(false);
  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  //  FETCH PRODUCTS
  const fetchProducts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);
    else console.error(error);
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  // IMAGE UPLOAD
 const handleImageUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!user) {
    alert("Login required");
    return;
  }

  // validation
  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Max size 2MB");
    return;
  }

  try {
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error.message);
      alert("Upload failed");
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      alert("Could not get image URL");
      return;
    }

    updateField("thumbnail", data.publicUrl);
  } finally {
    setUploading(false);
  }
};
  // ADD PRODUCT
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      alert("Login first");
      return;
    }

    const title = form.title.trim();
    const price = Number(form.price);

    if (!title || !price || price <= 0) {
  alert("Enter valid title & price");
  return;
}

if (!form.thumbnail) {
  alert("Add image (upload or URL)");
  return;
}

if (uploading) {
  alert("Please wait, image is uploading...");
  return;
}
    const { error } = await supabase.from("products").insert([
      {
        title,
        description: form.description.trim() || "Seller listed product",
        category: form.category,
        price,
        image: form.thumbnail,
        stock: 1,
        seller_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding product");
      return;
    }

    setForm(initialForm);
    fetchProducts();
  };

  // 🔥 DELETE PRODUCT
  const removeProduct = async (id) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) console.error(error);
    else fetchProducts();
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
                onChange={(event) => updateField("title", event.target.value.trim())}
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
    onError={(e) => (e.target.style.display = "none")}
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
                        src={product.image}
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
