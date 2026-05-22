import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen pt-20">

      <Navbar setSearch={() => {}} />

      <div className="max-w-4xl mx-auto px-4 py-10">

        <div className="bg-white dark:bg-[#171717] rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-sm">

          <div className="flex flex-col items-center text-center">

            <div className="w-24 h-24 rounded-full bg-[#d4b06a] text-black flex items-center justify-center text-3xl font-bold mb-4">

              {user?.user_metadata?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.user_metadata?.name ||
                "User"}
            </h1>

            <p className="text-gray-500 dark:text-stone-400 mt-2">
              {user?.email}
            </p>

          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6">

            <div className="bg-gray-100 dark:bg-black/20 rounded-xl p-5">

              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                Account Information
              </h2>

              <p className="text-sm text-gray-600 dark:text-stone-400">
                Username:
              </p>

              <p className="text-gray-900 dark:text-white mb-4">
                {user?.user_metadata?.name}
              </p>

              <p className="text-sm text-gray-600 dark:text-stone-400">
                Email:
              </p>

              <p className="text-gray-900 dark:text-white">
                {user?.email}
              </p>

            </div>

            <div className="bg-gray-100 dark:bg-black/20 rounded-xl p-5">

              <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
                Quick Links
              </h2>

              <div className="flex flex-col gap-3">

                <a
                  href="/orders"
                  className="text-[#d4b06a]"
                >
                  My Orders
                </a>

                <a
                  href="/wishlist"
                  className="text-[#d4b06a]"
                >
                  Wishlist
                </a>

                <a
                  href="/cart"
                  className="text-[#d4b06a]"
                >
                  Cart
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}