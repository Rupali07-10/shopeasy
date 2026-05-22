import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setOrders(data || []);
      }

      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-20 transition-colors">

      <Navbar setSearch={() => {}} />

      <div className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Orders
        </h1>

        {loading ? (
          <p className="text-gray-600 dark:text-stone-400">
            Loading...
          </p>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-[#171717] rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <p className="text-gray-600 dark:text-stone-400">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-[#171717] rounded-xl p-6 border border-gray-200 dark:border-white/10 shadow-sm"
              >

                {/* TOP */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Order Placed
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-stone-400">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left md:text-right">

                    <p className="text-gray-700 dark:text-stone-300">
                      Total:
                      <span className="font-semibold text-gray-900 dark:text-white ml-2">
                        ₹{order.total}
                      </span>
                    </p>

                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                      {order.status}
                    </span>

                  </div>
                </div>
                <div className="space-y-4">

                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border-b border-gray-200 dark:border-white/10 pb-4"
                    >

                      <img
                        src={
                          item.product?.thumbnail ||
                          item.product?.image ||
                          "/favicon.svg"
                        }
                        alt={item.product?.title}
                        className="w-20 h-20 object-contain rounded bg-gray-100 dark:bg-black/20"
                      />

                      <div className="flex-1">

                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.product?.title}
                        </h3>

                        <p className="text-[#d4b06a] mt-1">
                          ₹{item.product?.price}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-stone-400 mt-1">
                          Quantity: {item.quantity}
                        </p>

                      </div>
                    </div>
                  ))}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}