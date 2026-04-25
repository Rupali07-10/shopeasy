import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty, totalPrice } = useCart();

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white px-6 py-10">

      <h1 className="text-3xl mb-8 font-serif">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-stone-400">Cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT ITEMS */}
          <div className="md:col-span-2 space-y-6">

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-[#171717] p-5 rounded-2xl border border-white/10 flex gap-5"
              >
                <img
                  src={item.thumbnail}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="flex-1">

                  <h2 className="text-lg">{item.title}</h2>

                  <p className="text-[#d4b06a] mt-1">
                    ₹{item.price}
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 bg-stone-700 rounded-lg"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 bg-stone-700 rounded-lg"
                    >
                      +
                    </button>

                  </div>

                  <p className="text-sm text-stone-400 mt-2">
                    Subtotal: ₹{item.price * item.quantity}
                  </p>

                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          {/* RIGHT SUMMARY */}
          <div className="bg-[#171717] p-6 rounded-2xl border border-white/10 h-fit">

            <h2 className="text-xl mb-4">Price Details</h2>

            <div className="flex justify-between text-stone-400 mb-2">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between text-stone-400 mb-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <button className="w-full bg-[#d4b06a] text-black py-3 rounded-xl hover:bg-[#e3bf77]">
              Place Order
            </button>

          </div>

        </div>
      )}
    </div>
  );
}