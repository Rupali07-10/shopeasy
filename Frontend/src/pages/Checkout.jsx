import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { supabase } from "../services/supabaseClient";

export default function Checkout() {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    addressLine: "",
  });

  const handleInput = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (Number(item.product?.price) || 0) *
        item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!user) {
      return toast.error("Login first");
    }

    if (
      !address.name ||
      !address.phone ||
      !address.city ||
      !address.state ||
      !address.pincode ||
      !address.addressLine
    ) {
      return toast.error("Fill all fields");
    }

    try {
      setLoading(true);

      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.product,
      }));

      const { error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            items: orderItems,
            total,
            payment_method: paymentMethod,
            status: "Placed",
          },
        ]);

      if (error) {
        toast.error(error.message);
        return;
      }

      // 🔥 CLEAR CART
      for (const item of cart) {
        await removeFromCart(item.product_id);
      }

      toast.success("Payment Successful ✅");
      toast.success("Order Placed 🎉");

      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-20 transition-colors">

      <Navbar setSearch={() => {}} />

      <div className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-stone-400">
            Cart is empty
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">

            {/* ADDRESS */}
            <div className="bg-white dark:bg-[#171717] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">

              <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
                Delivery Address
              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-white outline-none"
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-white outline-none"
                />

                <textarea
                  name="addressLine"
                  placeholder="Address"
                  value={address.addressLine}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-white outline-none"
                />

                <div className="grid grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleInput}
                    className="w-full p-3 rounded bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-white outline-none"
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={address.state}
                    onChange={handleInput}
                    className="w-full p-3 rounded bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-white outline-none"
                  />

                </div>

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleInput}
                  className="w-full p-3 rounded bg-gray-100 dark:bg-black/20 text-gray-900 dark:text-white outline-none"
                />

              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white dark:bg-[#171717] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">

              <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-4">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-3"
                  >
                    <img
                      src={
                        item.product?.thumbnail ||
                        item.product?.image ||
                        "/favicon.svg"
                      }
                      alt={item.product?.title}
                      className="w-16 h-16 object-contain rounded"
                    />

                    <div className="flex-1">

                      <h3 className="text-sm text-gray-900 dark:text-white">
                        {item.product?.title}
                      </h3>

                      <p className="text-sm text-[#d4b06a]">
                        ₹{item.product?.price}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                    </div>
                  </div>
                ))}

                {/* PAYMENT METHOD */}
                <div className="mt-6">

                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Payment Method
                  </h3>

                  <div className="space-y-3">

                    <label className="flex items-center gap-3 text-gray-700 dark:text-white">
                      <input
                        type="radio"
                        checked={paymentMethod === "COD"}
                        onChange={() =>
                          setPaymentMethod("COD")
                        }
                      />
                      Cash on Delivery
                    </label>

                    <label className="flex items-center gap-3 text-gray-700 dark:text-white">
                      <input
                        type="radio"
                        checked={paymentMethod === "UPI"}
                        onChange={() =>
                          setPaymentMethod("UPI")
                        }
                      />
                      UPI Payment
                    </label>

                    <label className="flex items-center gap-3 text-gray-700 dark:text-white">
                      <input
                        type="radio"
                        checked={paymentMethod === "Card"}
                        onChange={() =>
                          setPaymentMethod("Card")
                        }
                      />
                      Credit / Debit Card
                    </label>

                  </div>
                </div>

                {/* TOTAL */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10">

                  <div className="flex justify-between mb-2 text-gray-700 dark:text-stone-300">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>

                  <div className="flex justify-between mb-2 text-gray-700 dark:text-stone-300">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full mt-6 bg-black dark:bg-[#d4b06a] text-white dark:text-black py-3 rounded hover:bg-gray-800 dark:hover:bg-[#e3bf77] transition"
                  >
                    {loading
                      ? "Placing Order..."
                      : "Place Order"}
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}