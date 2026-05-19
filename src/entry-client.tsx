import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { CartProvider, WishlistProvider, AuthProvider } from "./lib/store";
import { ProductsProvider } from "./lib/products-store";
import { Toaster } from "./components/ui/sonner";
import "./styles.css";

const router = createRouter({
  routeTree,
  context: {},
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <ProductsProvider>
          <WishlistProvider>
            <CartProvider>
              <RouterProvider router={router} />
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
    </StrictMode>,
  );
}
