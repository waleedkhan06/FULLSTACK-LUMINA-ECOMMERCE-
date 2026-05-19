import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useCart, useWishlist, useAuth } from "@/lib/store";

const navItems = [
  { label: "New & Featured", to: "/shop" },
  { label: "Sneakers", to: "/shop?collection=Sneakers" },
  { label: "Apparel", to: "/shop?collection=Apparel" },
  { label: "Activewear", to: "/shop?collection=Activewear" },
  { label: "Membership", to: "/membership" },
  { label: "Story", to: "/about" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const wishlist = useWishlist();
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="hidden md:flex h-9 items-center justify-end gap-6 container-edge text-xs text-muted-foreground">
        <Link to="/membership" className="hover:text-ink transition-colors">
          Find a Store
        </Link>
        <span className="text-border">|</span>
        <Link to="/membership" className="hover:text-ink transition-colors">
          Help
        </Link>
        <span className="text-border">|</span>
        <Link to={auth.user ? "/account" : "/signin"} className="hover:text-ink transition-colors">
          {auth.user ? `Hi, ${auth.user.name.split(" ")[0]}` : "Join LUMINA"}
        </Link>
        <span className="text-border">|</span>
        <Link to={auth.user ? "/account" : "/signin"} className="hover:text-ink transition-colors">
          {auth.user ? "Account" : "Sign In"}
        </Link>
      </div>

      <div className="container-edge h-16 flex items-center justify-between gap-4 md:gap-6 border-t border-border/60">
        <Link to="/" className="font-display text-2xl md:text-3xl tracking-wider text-ink">
          LUMINA
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="text-sm font-medium text-ink lumina-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:flex items-center bg-cloud rounded-full h-11 px-5 gap-2 w-48 lg:w-56 hover:w-64 transition-all">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search"
              className="bg-transparent text-sm flex-1 outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={() => wishlist.setOpen(true)}
            className="h-11 w-11 inline-flex items-center justify-center rounded-full hover:bg-cloud transition-colors relative"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5 text-ink" />
            {wishlist.count > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-ink text-[10px] font-semibold text-white flex items-center justify-center">
                {wishlist.count}
              </span>
            )}
          </button>
          <Link
            to={auth.user ? "/account" : "/signin"}
            className="hidden md:inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cloud transition-colors"
            aria-label="Account"
          >
            <User className="h-5 w-5 text-ink" />
          </Link>
          <button
            data-cart-icon
            onClick={() => cart.setOpen(true)}
            className="h-11 w-11 inline-flex items-center justify-center rounded-full hover:bg-cloud transition-colors relative"
            aria-label="Bag"
          >
            <ShoppingBag className="h-5 w-5 text-ink" />
            {cart.count > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-emerald-vivid text-[10px] font-semibold text-white flex items-center justify-center">
                {cart.count}
              </span>
            )}
          </button>
          <button
            className="lg:hidden h-11 w-11 inline-flex items-center justify-center rounded-full hover:bg-cloud"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden container-edge pb-6 flex flex-col gap-1 border-t border-border animate-in slide-in-from-top-2">
          <div className="flex items-center bg-cloud rounded-full h-11 px-5 gap-2 my-3 md:hidden">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search"
              className="bg-transparent text-sm flex-1 outline-none placeholder:text-muted-foreground"
            />
          </div>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-3 text-lg font-semibold text-ink"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={auth.user ? "/account" : "/signin"}
            onClick={() => setOpen(false)}
            className="py-3 text-lg font-semibold text-ink"
          >
            {auth.user ? "Account" : "Sign In"}
          </Link>
        </div>
      )}
    </header>
  );
}
