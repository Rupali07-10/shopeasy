import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
   <ThemeProvider>
    <AuthProvider>
     <CartProvider>
      <WishlistProvider>
        <App />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "10px",
            },
            success: {
              style: {
                background: "#047857",
                color: "#fff",
              },
            },
            error: {
              style: {
                background: "#b91c1c",
                color: "#fff",
              },
            },
          }}
        />
       </WishlistProvider>
     </CartProvider>
    </AuthProvider>
   </ThemeProvider>
  </StrictMode>
);
