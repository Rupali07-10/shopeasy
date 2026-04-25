import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="text-center mt-10">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Navbar */}
      <Navbar />

      {/* Category Bar */}
      <CategoryBar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 mt-4 bg-white rounded">

        <Link
          to="/"
          className="text-blue-600 text-sm hover:underline mb-4 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* Image */}
          <div className="flex justify-center">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-80 object-contain"
            />
          </div>

          {/* Details */}
          <div>

            <h1 className="text-xl font-semibold mb-2">
              {product.title}
            </h1>

            <p className="text-gray-600 text-sm mb-3">
              {product.description}
            </p>

            <p className="text-green-600 text-xl font-bold mb-2">
              ₹{product.price}
            </p>

            <p className="text-sm mb-1">
              <span className="font-medium">Category:</span>{" "}
              {product.category}
            </p>

            {/* Fake Rating (for UI polish) */}
            <p className="text-sm mb-4">
              ⭐ 4.5 (120 reviews)
            </p>

            {/* Button */}
            <button
              onClick={() => {
                if (!user) {
                  alert("Please login first");
                  return;
                }
                addToCart(product);
              }}
              className="bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 transition"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}