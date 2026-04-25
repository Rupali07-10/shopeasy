export default function Footer() {
  return (
    <div className="bg-gray-900 text-gray-300 mt-10">

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-3">ShopEasy</h3>
          <p className="text-sm">
            ShopEasy is a modern e-commerce platform where users can explore trending
            products and sellers can easily list their items.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Cart</li>
            <li className="hover:text-white cursor-pointer">Become Seller</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="text-sm space-y-2">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Returns</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* App / Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Download App</h3>
          <p className="text-sm mb-3">
            Get the app for better experience
          </p>

          <div className="flex gap-3">
            <div className="bg-gray-800 px-3 py-2 rounded text-xs">
              Play Store
            </div>
            <div className="bg-gray-800 px-3 py-2 rounded text-xs">
              App Store
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 text-center text-sm py-4">
        © 2026 ShopEasy | All rights reserved
      </div>

    </div>
  );
}