import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import type { Product } from "./products";

// ============== CART ==============
export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (p: Product, size: string, colorIdx: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  flyFrom: (rect: DOMRect, image: string) => void;
};

const CartContext = createContext<CartCtx | null>(null);

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("lumina:cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem("lumina:cart", JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [open, setOpen] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const add = useCallback((p: Product, size: string, colorIdx: number) => {
    const colorObj = p.colors[colorIdx] ?? p.colors[0];
    const id = `${p.slug}__${size}__${colorObj.name}`;
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      const next = found
        ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id, slug: p.slug, name: p.name, image: colorObj.image, price: p.salePrice ?? p.price, size, color: colorObj.name, qty: 1 }];
      saveCart(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveCart(next);
      return next;
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
      saveCart(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  const flyFrom = useCallback((rect: DOMRect, image: string) => {
    if (typeof document === "undefined") return;
    const target = document.querySelector("[data-cart-icon]") as HTMLElement | null;
    if (!target) return;
    const targetRect = target.getBoundingClientRect();
    const ghost = document.createElement("img");
    ghost.src = image;
    ghost.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;object-fit:cover;border-radius:12px;z-index:9999;pointer-events:none;transition:transform 700ms cubic-bezier(.5,.05,.2,1),opacity 700ms,width 700ms,height 700ms,border-radius 700ms;box-shadow:0 20px 50px rgba(0,0,0,.25)`;
    document.body.appendChild(ghost);
    requestAnimationFrame(() => {
      const dx = targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2);
      const dy = targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2);
      ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.1)`;
      ghost.style.opacity = "0.2";
      ghost.style.borderRadius = "999px";
    });
    setTimeout(() => {
      ghost.remove();
      target.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 400, easing: "cubic-bezier(.5,.05,.2,1)" });
    }, 720);
  }, []);

  const value = useMemo(() => ({ items, count, subtotal, add, remove, setQty, clear, open, setOpen, flyFrom }), [items, count, subtotal, add, remove, setQty, clear, open, flyFrom]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

// ============== AUTH ==============
type AppUser = { id: string; email: string; name: string };

type AuthCtx = {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

const AUTH_KEY = "lumina:auth";
const USERS_KEY = "lumina:users";

function loadUser(): AppUser | null {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

function getUsers(): Record<string, { name: string; email: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(loadUser);
  const [open, setOpen] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const found = Object.entries(users).find(([, u]) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const [id, u] = found;
    const appUser: AppUser = { id, email: u.email, name: u.name };
    localStorage.setItem(AUTH_KEY, JSON.stringify(appUser));
    setUser(appUser);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const users = getUsers();
    if (Object.values(users).some((u) => u.email === email)) {
      throw new Error("An account with this email already exists");
    }
    const id = crypto.randomUUID();
    users[id] = { name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const appUser: AppUser = { id, email, name };
    localStorage.setItem(AUTH_KEY, JSON.stringify(appUser));
    setUser(appUser);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    throw new Error("Google sign-in is not available in demo mode.");
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading: false, signIn, signUp, signInWithGoogle, signOut, open, setOpen }), [user, signIn, signUp, signInWithGoogle, signOut, open]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

// ============== WISHLIST ==============
type WishlistCtx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const WishlistContext = createContext<WishlistCtx | null>(null);

function loadWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem("lumina:wishlist") || "[]");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>(loadWishlist);
  const [open, setOpen] = useState(false);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem("lumina:wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.filter((s) => s !== slug);
      localStorage.setItem("lumina:wishlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const count = slugs.length;

  const value = useMemo(() => ({ slugs, has, toggle, remove, count, open, setOpen }), [slugs, has, toggle, remove, count, open]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const c = useContext(WishlistContext);
  if (!c) throw new Error("useWishlist must be used inside WishlistProvider");
  return c;
}
