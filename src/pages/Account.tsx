import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { useAuth } from "@/lib/store";
import { Package, Heart, LogOut, User as UserIcon } from "lucide-react";

type Order = {
  id: string;
  user_id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
  items: Array<{ name: string; qty: number; image: string }>;
};

export default function AccountPage() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/signin");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem("lumina:orders");
      const all: Order[] = raw ? JSON.parse(raw) : [];
      setOrders(
        all
          .filter((o) => o.user_id === user.id)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
      );
    } catch {
      setOrders([]);
    }
  }, [user]);

  if (!user) return null;

  return (
    <SiteLayout>
      <div className="container-edge py-12 lg:py-16">
        <p className="eyebrow text-emerald-vivid mb-3">Member</p>
        <h1 className="display-xl text-ink mb-10">Hi, {user.name.split(" ")[0]}.</h1>

        <div className="grid lg:grid-cols-[260px_1fr] gap-12">
          <aside className="lg:sticky lg:top-32 lg:h-fit space-y-1">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-cloud">
              <div className="h-12 w-12 rounded-full bg-ink text-white flex items-center justify-center font-semibold">
                {user.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Link
              to="/wishlist"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cloud text-sm font-semibold text-ink"
            >
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
            <a
              href="#orders"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cloud text-sm font-semibold text-ink"
            >
              <Package className="h-4 w-4" /> Orders
            </a>
            <a
              href="#profile"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cloud text-sm font-semibold text-ink"
            >
              <UserIcon className="h-4 w-4" /> Profile
            </a>
            <button
              onClick={() => {
                signOut();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cloud text-sm font-semibold text-ink"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </aside>

          <div className="space-y-12">
            <section id="orders">
              <h2 className="font-display text-2xl text-ink uppercase tracking-wider mb-5">
                Orders
              </h2>
              {orders.length === 0 ? (
                <div className="border border-border rounded-2xl p-10 text-center bg-cloud/30">
                  <Package className="h-8 w-8 text-ink mx-auto mb-3" />
                  <p className="font-semibold text-ink mb-1">No orders yet</p>
                  <p className="text-sm text-muted-foreground mb-5">
                    Your future orders will appear here.
                  </p>
                  <Link to="/shop">
                    <PillButton>Start shopping</PillButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="border border-border rounded-2xl p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="font-semibold text-ink">Order #{o.order_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(o.created_at).toLocaleDateString()} · {o.status}
                          </p>
                        </div>
                        <p className="font-semibold text-ink">${Number(o.total).toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 overflow-x-auto">
                        {(o.items ?? []).slice(0, 5).map((it, i) => (
                          <div
                            key={i}
                            className="h-16 w-16 shrink-0 rounded-md bg-cloud overflow-hidden"
                          >
                            <img
                              src={it.image}
                              alt={it.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section id="profile">
              <h2 className="font-display text-2xl text-ink uppercase tracking-wider mb-5">
                Profile
              </h2>
              <div className="border border-border rounded-2xl p-6 grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Name
                  </p>
                  <p className="text-ink">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Email
                  </p>
                  <p className="text-ink">{user.email}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
