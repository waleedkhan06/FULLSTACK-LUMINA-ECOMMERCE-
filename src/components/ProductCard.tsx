import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";
import { useAuth, useWishlist, useCart } from "@/lib/store";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const wishlist = useWishlist();
  const cart = useCart();
  const { user } = useAuth();
  const fav = wishlist.has(product.slug);
  const currentImage = product.colors[active]?.image ?? product.image;

  function handleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }
    wishlist.toggle(product.slug);
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to add items to your bag");
      return;
    }

    const cardEl = e.currentTarget.closest(".group") as HTMLElement | null;
    const imgEl = cardEl?.querySelector("img") as HTMLImageElement | null;
    if (imgEl) {
      const rect = imgEl.getBoundingClientRect();
      cart.flyFrom(rect, currentImage);
    }

    cart.add(product, product.sizes[0] || "M", 0);
    toast.success("Added to bag");
  }

  const staggerDelay = index * 0.05;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: staggerDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div
        className="group block cursor-pointer"
        onClick={() => navigate(`/product/${product.slug}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-cloud rounded-sm img-zoom hover-lift">
          <motion.img
            src={currentImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="eyebrow text-emerald-vivid bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs">
                New
              </span>
            )}
            {product.isJustIn && !product.isNew && (
              <span className="eyebrow text-ink bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs">
                Just In
              </span>
            )}
            {product.salePrice && (
              <span className="eyebrow text-sale bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs">
                Sale
              </span>
            )}
          </div>

          <motion.button
            type="button"
            onClick={handleFav}
            aria-label={fav ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/95 backdrop-blur inline-flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors duration-300",
                fav ? "fill-sale text-sale" : "text-ink",
              )}
            />
          </motion.button>

          <motion.div
            className="absolute bottom-4 left-4 right-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-full h-11 rounded-full bg-ink text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-lg hover:bg-ink/90 btn-micro"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick Add
            </button>
          </motion.div>

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-4 flex flex-col gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {product.colors.slice(0, 4).map((c, i) => (
              <button
                key={c.name + i}
                type="button"
                aria-label={c.name}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive(i);
                }}
                className={cn(
                  "h-6 w-6 rounded-full border-2 transition-all duration-300",
                  active === i ? "border-ink scale-110" : "border-white/80 hover:border-white",
                )}
                style={{ backgroundColor: c.swatch }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="pt-4 flex flex-col gap-2"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-base font-semibold text-ink leading-tight group-hover:text-emerald-vivid transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <div className="flex items-center gap-3 pt-1">
            {product.salePrice ? (
              <>
                <span className="text-sm font-semibold text-sale">${product.salePrice}</span>
                <span className="text-sm text-muted-foreground line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-ink">${product.price}</span>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
