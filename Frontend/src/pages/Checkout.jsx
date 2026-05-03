import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    return sum + item.quantity * (item.product?.price || 0);
  }, 0);

  const placeOrder = async () => {
    if (!user) return toast.error("Login first");

    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        items: cart,
        total,
        status: "placed",
      },
    ]);

    if (error) {
      toast.error("Order failed");
    } else {
      toast.success("Order placed successfully");
      navigate("/orders");
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Checkout</h2>

      <p>Total: ₹{total}</p>

      <button
        onClick={placeOrder}
        className="mt-4 bg-[#d4b06a] px-4 py-2 rounded text-black"
      >
        Place Order (COD)
      </button>
    </div>
  );
}