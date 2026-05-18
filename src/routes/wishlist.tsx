import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { ProductCard } from "@/components/ProductCard";
import { useWishlist } from "@/lib/store";
import { useProducts } from "@/lib/products-store";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — LUMINA" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { slugs } = useWishlist();
  const { products } = useProducts();
  const items = slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <SiteLayout>
      <div className="container-edge py-12 lg:py-16">
        <p className="eyebrow text-emerald-vivid mb-3">Saved for later</p>
        <h1 className="display-xl text-ink mb-10">Wishlist ({items.length})</h1>
        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center gap-5">
            <div className="h-20 w-20 rounded-full bg-cloud flex items-center justify-center">
              <Heart className="h-8 w-8 text-ink" />
            </div>
            <p className="display-lg text-ink">No favorites yet</p>
            <p className="text-muted-foreground max-w-sm">
              Tap the heart on any product to save it here.
            </p>
            <Link to="/shop">
              <PillButton variant="ink" size="lg">
                Browse products
              </PillButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-14">
            {items.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
