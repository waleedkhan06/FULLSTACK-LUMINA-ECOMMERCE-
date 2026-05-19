import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useWishlist, useCart } from "@/lib/store";
import { useProducts } from "@/lib/products-store";
import { Heart, X } from "lucide-react";
import { PillButton } from "./PillButton";

export function WishlistDrawer() {
  const { open, setOpen, slugs, remove } = useWishlist();
  const { add, setOpen: setCartOpen } = useCart();
  const { products } = useProducts();
  const items = slugs
    .map((s) => products.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-display text-2xl tracking-wide text-ink uppercase">
            Wishlist ({items.length})
          </SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="h-16 w-16 rounded-full bg-cloud flex items-center justify-center">
              <Heart className="h-7 w-7 text-ink" />
            </div>
            <p className="text-ink font-semibold">No favorites yet</p>
            <p className="text-sm text-muted-foreground">
              Tap the heart on any product to save it here.
            </p>
            <PillButton onClick={() => setOpen(false)}>Browse products</PillButton>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
            {items.map((p) => (
              <div key={p.slug} className="flex gap-4">
                <Link
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setOpen(false)}
                  className="h-24 w-24 shrink-0 rounded-md bg-cloud overflow-hidden"
                >
                  <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                      <p className="text-sm font-semibold text-ink mt-1">
                        ${p.salePrice ?? p.price}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(p.slug)}
                      className="text-muted-foreground hover:text-ink"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      add(p, p.sizes[0], 0);
                      setOpen(false);
                      setTimeout(() => setCartOpen(true), 150);
                    }}
                    className="mt-2 text-xs font-semibold text-ink underline underline-offset-4"
                  >
                    Move to bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
