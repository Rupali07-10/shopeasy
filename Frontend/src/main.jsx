import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
   <AuthProvider>
    <CartProvider>
     <WishlistProvider>
       <App />
        <Toaster
          position="top-right"
          toastOptions={{
           style: {
            background: "#171717",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
           },
         }}
       />
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
  </StrictMode>
);