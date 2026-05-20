import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetchAllProducts, type Product } from "./products";

type Ctx = {
  products: Product[];
  loading: boolean;
  bySlug: (slug: string) => Product | undefined;
  recentlyViewed: Product[];
  pushRecent: (slug: string) => void;
};

const ProductsContext = createContext<Ctx | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("lumina:recent") ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetchAllProducts()
      .then(setProducts)
      .catch((e) => console.error("Failed to load products", e))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lumina:recent", JSON.stringify(recentSlugs));
    } catch {
      // ignore
    }
  }, [recentSlugs]);

  const bySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  );

  const pushRecent = useCallback(
    (slug: string) =>
      setRecentSlugs((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8)),
    [],
  );

  const recentlyViewed = useMemo(
    () =>
      recentSlugs
        .map((s) => products.find((p) => p.slug === s))
        .filter((p): p is Product => !!p),
    [recentSlugs, products],
  );

  const value = useMemo(
    () => ({ products, loading, bySlug, recentlyViewed, pushRecent }),
    [products, loading, bySlug, recentlyViewed, pushRecent],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProducts() {
  const c = useContext(ProductsContext);
  if (!c) throw new Error("useProducts must be inside ProductsProvider");
  return c;
}
