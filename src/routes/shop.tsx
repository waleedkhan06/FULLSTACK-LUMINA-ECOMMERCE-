import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X, Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { PillButton } from "@/components/PillButton";
import { useProducts } from "@/lib/products-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

type SearchParams = { q?: string; collection?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : undefined,
    collection: typeof s.collection === "string" ? s.collection : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — LUMINA" },
      {
        name: "description",
        content: "Shop the full LUMINA collection — sneakers, apparel, streetwear and activewear.",
      },
      { property: "og:title", content: "Shop All — LUMINA" },
      {
        property: "og:description",
        content: "Shop the full LUMINA collection — sneakers, apparel, streetwear and activewear.",
      },
    ],
  }),
  component: Shop,
});

const collections = ["Sneakers", "Apparel", "Activewear", "Accessories"] as const;
const colorFilters = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#0a0a0a" },
  { name: "Emerald", hex: "#0F5132" },
  { name: "Cream", hex: "#f3ead6" },
  { name: "Vivid Green", hex: "#00C853" },
  { name: "Navy", hex: "#0e1a2b" },
  { name: "Charcoal", hex: "#1a1a1a" },
  { name: "Pink", hex: "#e8a3b3" },
  { name: "Yellow", hex: "#f1c40f" },
  { name: "Orange", hex: "#ed7a30" },
  { name: "Red", hex: "#c0392b" },
  { name: "Purple", hex: "#5d3a9b" },
];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "7", "8", "9", "10", "11", "12", "13"];
const priceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 — $200", min: 100, max: 200 },
  { label: "$200 — $300", min: 200, max: 300 },
  { label: "$300+", min: 300, max: Infinity },
];

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-ink font-semibold"
      >
        {title} <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pt-5">{children}</div>}
    </div>
  );
}

function priceOf(p: Product) {
  return p.salePrice ?? p.price;
}

function Shop() {
  const { products, loading } = useProducts();
  const search = useSearch({ from: "/shop" });
  const [selectedCol, setSelectedCol] = useState<string[]>(
    search.collection ? [search.collection] : [],
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(search.q ?? "");
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [visible, setVisible] = useState(12);

  // Sync route query changes with local state for seamless dynamic navigation
  useEffect(() => {
    setSelectedCol(search.collection ? [search.collection] : []);
  }, [search.collection]);

  const toggle = <T,>(arr: T[], setArr: (v: T[]) => void, v: T) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    let out = products;
    if (selectedCol.length) out = out.filter((p) => selectedCol.includes(p.collection));
    if (selectedColors.length)
      out = out.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    if (selectedSizes.length)
      out = out.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedPrice.length) {
      out = out.filter((p) => {
        const price = priceOf(p);
        return selectedPrice.some((label) => {
          const r = priceRanges.find((x) => x.label === label)!;
          return price >= r.min && price < r.max;
        });
      });
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q),
      );
    }
    if (sort === "price-asc") out = [...out].sort((a, b) => priceOf(a) - priceOf(b));
    else if (sort === "price-desc") out = [...out].sort((a, b) => priceOf(b) - priceOf(a));
    else if (sort === "newest") out = [...out].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    return out;
  }, [products, selectedCol, selectedColors, selectedSizes, selectedPrice, searchTerm, sort]);

  const clearAll = () => {
    setSelectedCol([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPrice([]);
    setSearchTerm("");
  };

  return (
    <SiteLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="container-edge pt-12 pb-6"
      >
        <p className="eyebrow text-emerald-vivid mb-3">All Collections</p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="display-xl text-ink">
            {searchTerm ? `Results for "${searchTerm}"` : "New & Featured"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center bg-cloud rounded-full h-11 px-5 gap-2 w-64">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products"
                className="bg-transparent text-sm flex-1 outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => setMobileFilters(true)}
              className="lg:hidden inline-flex items-center gap-2 h-11 px-5 rounded-full bg-cloud text-sm font-medium"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 px-5 pr-10 rounded-full bg-cloud text-sm font-medium outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230F5132%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_1rem_center]"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        <div className="mt-3 md:hidden flex items-center bg-cloud rounded-full h-11 px-5 gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products"
            className="bg-transparent text-sm flex-1 outline-none"
          />
        </div>
      </motion.div>

      <div className="container-edge grid lg:grid-cols-[260px_1fr] gap-12 pb-24">
        <aside
          className={cn(
            "lg:sticky lg:top-32 lg:h-fit lg:w-full",
            "fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-background w-[85vw] lg:w-auto max-w-sm lg:max-w-none p-6 lg:p-0 overflow-y-auto transition-transform",
            mobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h3 className="display-lg text-ink">Filters</h3>
            <button
              onClick={() => setMobileFilters(false)}
              className="h-10 w-10 rounded-full bg-cloud inline-flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <FilterGroup title="Collection">
            <ul className="flex flex-col gap-3">
              {collections.map((c) => (
                <li key={c}>
                  <label className="flex items-center gap-3 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCol.includes(c)}
                      onChange={() => toggle(selectedCol, setSelectedCol, c)}
                      className="accent-ink h-4 w-4"
                    />
                    {c}
                  </label>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <FilterGroup title="Size" defaultOpen={false}>
            <div className="grid grid-cols-3 gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(selectedSizes, setSelectedSizes, s)}
                  className={cn(
                    "h-10 rounded-full border text-sm",
                    selectedSizes.includes(s)
                      ? "border-ink bg-ink text-white"
                      : "border-border hover:border-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Price" defaultOpen={false}>
            <ul className="flex flex-col gap-3 text-sm">
              {priceRanges.map((p) => (
                <li key={p.label}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPrice.includes(p.label)}
                      onChange={() => toggle(selectedPrice, setSelectedPrice, p.label)}
                      className="accent-ink h-4 w-4"
                    />
                    {p.label}
                  </label>
                </li>
              ))}
            </ul>
          </FilterGroup>

          <button
            onClick={clearAll}
            className="mt-6 text-sm font-semibold text-ink underline underline-offset-4"
          >
            Clear all filters
          </button>
        </aside>

        {mobileFilters && (
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileFilters(false)}
          />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-14">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="aspect-square bg-cloud animate-pulse rounded-sm"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <p className="display-lg text-ink mb-4">No products match</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search.</p>
              <PillButton onClick={clearAll}>Clear filters</PillButton>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">{filtered.length} products</p>
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-14">
                {filtered.slice(0, visible).map((p, i) => (
                  <ProductCard key={p.slug} product={p} index={i} />
                ))}
              </div>
              {filtered.length > visible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 flex justify-center"
                >
                  <PillButton variant="outline" size="lg" onClick={() => setVisible((v) => v + 12)}>
                    Load More
                  </PillButton>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </SiteLayout>
  );
}

// suppress unused
void Link;
