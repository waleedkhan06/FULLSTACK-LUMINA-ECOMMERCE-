import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { Product } from "./products";
import { supabase } from "./supabase";

// ============== Persisted state hook ==============
function usePersisted<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);
  return [state, setState];
}

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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = usePersisted<CartItem[]>("lumina:cart", []);
  const [open, setOpen] = useState(false);

  const add = useCallback(
    (p: Product, size: string, colorIdx: number) => {
      const colorObj = p.colors[colorIdx] ?? p.colors[0];
      const id = `${p.slug}__${size}__${colorObj.name}`;
      setItems((prev) => {
        const found = prev.find((i) => i.id === id);
        if (found) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
        return [
          ...prev,
          {
            id,
            slug: p.slug,
            name: p.name,
            image: colorObj.image,
            price: p.salePrice ?? p.price,
            size,
            color: colorObj.name,
            qty: 1,
          },
        ];
      });
    },
    [setItems],
  );

  const remove = useCallback(
    (id: string) => setItems((p) => p.filter((i) => i.id !== id)),
    [setItems],
  );
  const setQty = useCallback(
    (id: string, qty: number) => {
      setItems((p) => p.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
    },
    [setItems],
  );
  const clear = useCallback(() => setItems([]), [setItems]);

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
      target.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
        { duration: 400, easing: "cubic-bezier(.5,.05,.2,1)" },
      );
    }, 720);
  }, []);

  const value = useMemo(
    () => ({ items, count, subtotal, add, remove, setQty, clear, open, setOpen, flyFrom }),
    [items, count, subtotal, add, remove, setQty, clear, open, flyFrom],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

// ============== AUTH (localStorage mock) ==============
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
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

function saveUser(user: AppUser | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
}

function getUsers(): Record<string, { name: string; email: string; password: string }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setUsers(users: Record<string, { name: string; email: string; password: string }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setUser(loadUser());
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.display_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.display_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      const users = getUsers();
      const found = Object.entries(users).find(
        ([, u]) => u.email === email && u.password === password,
      );
      if (!found) throw new Error("Invalid email or password");
      const [id, u] = found;
      const appUser: AppUser = { id, email: u.email, name: u.name };
      saveUser(appUser);
      setUser(appUser);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!supabase) {
      const users = getUsers();
      if (Object.values(users).some((u) => u.email === email)) {
        throw new Error("An account with this email already exists");
      }
      const id = crypto.randomUUID();
      users[id] = { name, email, password };
      setUsers(users);
      const appUser: AppUser = { id, email, name };
      saveUser(appUser);
      setUser(appUser);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      throw new Error(
        "Google sign-in is not configured. Add your Supabase credentials to .env first.",
      );
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      saveUser(null);
      setUser(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signInWithGoogle, signOut, open, setOpen }),
    [user, loading, signIn, signUp, signInWithGoogle, signOut, open],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

// ============== WISHLIST (localStorage only) ==============
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

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = usePersisted<string[]>("lumina:wishlist", []);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!supabase || !user) return;

    supabase
      .from("wishlist")
      .select("product_slug")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (error) {
          console.warn("[Supabase] Failed to fetch wishlist, using local fallback:", error);
          return;
        }
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fetchedSlugs = data.map((row: any) => row.product_slug);
          setSlugs(fetchedSlugs);
        }
      });
  }, [user, setSlugs]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback(
    async (slug: string) => {
      const isAdding = !slugs.includes(slug);
      setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

      if (!supabase || !user) return;

      try {
        if (isAdding) {
          const { error } = await supabase
            .from("wishlist")
            .insert({ user_id: user.id, product_slug: slug });
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("wishlist")
            .delete()
            .eq("user_id", user.id)
            .eq("product_slug", slug);
          if (error) throw error;
        }
      } catch (err) {
        console.warn("[Supabase] Failed to sync wishlist update:", err);
      }
    },
    [slugs, user, setSlugs],
  );

  const remove = useCallback(
    async (slug: string) => {
      setSlugs((p) => p.filter((s) => s !== slug));

      if (!supabase || !user) return;

      try {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_slug", slug);
        if (error) throw error;
      } catch (err) {
        console.warn("[Supabase] Failed to remove wishlist item from database:", err);
      }
    },
    [user, setSlugs],
  );

  const value = useMemo(
    () => ({ slugs, has, toggle, remove, count: slugs.length, open, setOpen }),
    [slugs, has, toggle, remove, open],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const c = useContext(WishlistContext);
  if (!c) throw new Error("useWishlist must be used inside WishlistProvider");
  return c;
}
