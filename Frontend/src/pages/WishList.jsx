import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function WishList() {
  const { wishlist } = useWishlist();

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6">

      <h1 className="text-3xl text-white mb-6">Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <p className="text-stone-400">No items yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}

    </div>
  );
}