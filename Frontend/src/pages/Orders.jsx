import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id);

      setOrders(data || []);
    };

    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">My Orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-3">
          <p>Total: ₹{order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}