import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CartProvider, WishlistProvider, AuthProvider } from "./lib/store";
import { ProductsProvider } from "./lib/products-store";
import { Toaster } from "./components/ui/sonner";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <ProductsProvider>
            <WishlistProvider>
              <CartProvider>
                <App />
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: {
                      background: "var(--color-ink)",
                      color: "white",
                      border: "none",
                    },
                  }}
                />
              </CartProvider>
            </WishlistProvider>
          </ProductsProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}
