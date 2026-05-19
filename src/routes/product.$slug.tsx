import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Truck, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductBySlug } from "@/lib/products";
import { useAuth, useCart, useWishlist } from "@/lib/store";
import { useProducts } from "@/lib/products-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ")} — LUMINA`;
    return { meta: [{ title }, { property: "og:title", content: title }] };
  },
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  component: PDP,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-edge py-32 text-center">
        <h1 className="display-xl text-ink mb-6">Product not found</h1>
        <Link to="/shop">
          <PillButton variant="ink" size="lg">
            Back to Shop
          </PillButton>
        </Link>
      </div>
    </SiteLayout>
  ),
});

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-semibold text-ink">{title}</span>
        <ChevronDown className={cn("h-5 w-5 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="pb-6 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

const fakeReviews = [
  { name: "Maya, NYC", rating: 5, text: "Hands-down the cleanest piece I own. Quality is unreal." },
  {
    name: "Jordan, Tokyo",
    rating: 5,
    text: "Fits perfectly true to size. The materials feel premium.",
  },
  {
    name: "Sam, London",
    rating: 4,
    text: "Beautiful design. Wish there were more colorways soon.",
  },
];

function PDP() {
  const { product } = Route.useLoaderData() as { product: import("@/lib/products").Product };
  const [color, setColor] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const cart = useCart();
  const wishlist = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLImageElement>(null);
  const { products, pushRecent, recentlyViewed } = useProducts();

  useEffect(() => {
    pushRecent(product.slug);
  }, [product.slug, pushRecent]);

  const currentImage = product.colors[color]?.image ?? product.image;
  const gallery = [currentImage, ...(product.images ?? []).filter((u) => u !== currentImage)].slice(
    0,
    6,
  );
  const youMayLike = products
    .filter((p) => p.slug !== product.slug && p.collection === product.collection)
    .slice(0, 4);
  const recents = recentlyViewed.filter((p) => p.slug !== product.slug).slice(0, 4);

  const handleAdd = () => {
    if (!user) {
      toast.error("Please sign in to add items to your bag");
      navigate({ to: "/signin" });
      return;
    }
    if (!size) {
      toast.error("Please select a size");
      document
        .getElementById("size-selector")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    cart.add(product, size, color);
    if (heroRef.current) cart.flyFrom(heroRef.current.getBoundingClientRect(), currentImage);
    toast.success("Added to bag", { description: `${product.name} · Size ${size}` });
  };

  const handleFav = () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      navigate({ to: "/signin" });
      return;
    }
    wishlist.toggle(product.slug);
  };

  const fav = wishlist.has(product.slug);

  return (
    <SiteLayout>
      <div className="container-edge pt-8">
        <nav className="text-xs text-muted-foreground mb-6 flex gap-2">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <div className="container-edge grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-20 pb-20">
        {/* Gallery — left thumbs + main */}
        <div className="grid lg:grid-cols-[80px_1fr] gap-4">
          <div className="hidden lg:flex flex-col gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name + i}
                onClick={() => setColor(i)}
                className={cn(
                  "aspect-square rounded-sm overflow-hidden border-2 transition",
                  color === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <img src={c.image} alt={c.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {gallery.map((src, i) => (
              <div
                key={i + src}
                className={cn(
                  "aspect-square bg-cloud overflow-hidden rounded-sm",
                  i === 0 && "md:col-span-2",
                )}
              >
                <img
                  ref={i === 0 ? heroRef : undefined}
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-500"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-32 lg:h-fit">
          {product.isNew && <p className="eyebrow text-emerald-vivid mb-3">Just In</p>}
          <h1 className="display-lg text-ink mb-2">{product.name}</h1>
          <p className="text-muted-foreground mb-5">{product.category}</p>

          <div className="flex items-center gap-3 mb-8">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-semibold text-sale">${product.salePrice}</span>
                <span className="text-lg text-muted-foreground line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-semibold text-ink">${product.price}</span>
            )}
          </div>

          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating)
                      ? "fill-emerald-vivid text-emerald-vivid"
                      : "text-border",
                  )}
                />
              ))}
            </div>
            <span>
              {product.rating} · {product.reviewsCount} reviews
            </span>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-ink mb-3">
              Color:{" "}
              <span className="text-muted-foreground font-normal">
                {product.colors[color]?.name}
              </span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 gap-3 max-w-xs">
              {product.colors.map((c, i) => (
                <button
                  key={c.name + i}
                  onClick={() => setColor(i)}
                  className={cn(
                    "h-11 w-11 rounded-full border border-border transition shrink-0",
                    color === i && "ring-2 ring-emerald-vivid ring-offset-2 ring-offset-background",
                  )}
                  style={{ backgroundColor: c.swatch }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div id="size-selector" className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-ink">Select Size</p>
              <button className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "h-12 rounded-full border text-sm font-medium transition",
                    size === s ? "border-ink bg-ink text-white" : "border-border hover:border-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-10">
            <PillButton variant="ink" size="lg" className="w-full" onClick={handleAdd}>
              Add to Bag
            </PillButton>
            <PillButton
              variant="outline"
              size="lg"
              className="w-full inline-flex items-center justify-center gap-2"
              onClick={handleFav}
            >
              <Heart className={cn("h-4 w-4", fav && "fill-sale text-sale")} />{" "}
              {fav ? "Favorited" : "Favorite"}
            </PillButton>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex gap-6 text-xs text-muted-foreground mb-2">
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free shipping over $75
            </span>
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> 60-day returns
            </span>
          </div>

          <div className="mt-8">
            <Accordion title="Details" defaultOpen>
              {product.description}
            </Accordion>
            <Accordion title="Materials & Care">{product.materials}</Accordion>
            <Accordion title="Shipping & Returns">
              Free express shipping for LUMINA members. Standard 3–5 business days. Free returns
              within 60 days.
            </Accordion>
            <Accordion title={`Reviews (${product.reviewsCount})`}>
              <div className="space-y-4">
                {fakeReviews.map((r, i) => (
                  <div key={i} className="border-b border-border pb-3 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className={cn(
                              "h-3 w-3",
                              j < r.rating
                                ? "fill-emerald-vivid text-emerald-vivid"
                                : "text-border",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-ink">{r.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>
        </div>
      </div>

      {youMayLike.length > 0 && (
        <section className="container-edge pb-16">
          <h2 className="display-lg text-ink mb-10">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            {youMayLike.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {recents.length > 0 && (
        <section className="container-edge pb-24">
          <h2 className="display-lg text-ink mb-10">Recently viewed</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            {recents.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
