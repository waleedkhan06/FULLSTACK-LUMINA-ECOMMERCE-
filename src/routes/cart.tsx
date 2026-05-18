import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { useCart } from "@/lib/store";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Bag — LUMINA" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQty, subtotal, count } = useCart();
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <SiteLayout>
      <div className="container-edge py-12 lg:py-16">
        <p className="eyebrow text-emerald-vivid mb-3">Your selection</p>
        <h1 className="display-xl text-ink mb-10">Bag ({count})</h1>

        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-center text-center gap-5">
            <div className="h-20 w-20 rounded-full bg-cloud flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-ink" />
            </div>
            <p className="display-lg text-ink">Your bag is empty</p>
            <p className="text-muted-foreground max-w-sm">
              Find something you love and add it to your bag.
            </p>
            <Link to="/shop">
              <PillButton variant="ink" size="lg">
                Shop now
              </PillButton>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            <div className="flex flex-col divide-y divide-border">
              {items.map((i) => (
                <div key={i.id} className="flex gap-5 py-6 first:pt-0">
                  <Link
                    to="/product/$slug"
                    params={{ slug: i.slug }}
                    className="block h-32 w-32 sm:h-40 sm:w-40 shrink-0 rounded-md bg-cloud overflow-hidden"
                  >
                    <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink text-lg truncate">{i.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {i.color} · Size {i.size}
                        </p>
                      </div>
                      <p className="font-semibold text-ink whitespace-nowrap">
                        ${(i.price * i.qty).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="h-9 w-9 inline-flex items-center justify-center"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="h-9 w-9 inline-flex items-center justify-center"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-muted-foreground hover:text-ink inline-flex items-center gap-1.5 text-sm"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-32 lg:h-fit border border-border rounded-2xl p-7 bg-cloud/40">
              <h2 className="font-display text-2xl text-ink uppercase tracking-wider mb-6">
                Summary
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold text-ink">${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated shipping</dt>
                  <dd className="font-semibold text-ink">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated tax</dt>
                  <dd className="font-semibold text-ink">${tax.toFixed(2)}</dd>
                </div>
                <div className="border-t border-border pt-4 flex justify-between text-base">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="font-semibold text-ink">${total.toFixed(2)}</dd>
                </div>
              </dl>
              <Link to="/checkout" className="block mt-6">
                <PillButton variant="ink" size="lg" className="w-full">
                  Checkout
                </PillButton>
              </Link>
              <Link
                to="/shop"
                className="block mt-3 text-center text-sm text-muted-foreground hover:text-ink"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
