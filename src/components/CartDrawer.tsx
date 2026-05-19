import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/store";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { PillButton } from "./PillButton";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, subtotal, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle className="font-display text-2xl tracking-wide text-ink uppercase">
            Bag ({count})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="h-16 w-16 rounded-full bg-cloud flex items-center justify-center">
              <ShoppingBag className="h-7 w-7 text-ink" />
            </div>
            <p className="text-ink font-semibold">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">Add something you'll love.</p>
            <PillButton variant="ink" onClick={() => setOpen(false)}>
              Continue shopping
            </PillButton>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4">
                  <Link
                    to="/product/$slug"
                    params={{ slug: i.slug }}
                    onClick={() => setOpen(false)}
                    className="block h-24 w-24 shrink-0 rounded-md bg-cloud overflow-hidden"
                  >
                    <img src={i.image} alt={i.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{i.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {i.color} · Size {i.size}
                        </p>
                      </div>
                      <p className="font-semibold text-ink whitespace-nowrap">${i.price * i.qty}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="inline-flex items-center border border-border rounded-full">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="h-8 w-8 inline-flex items-center justify-center"
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{i.qty}</span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="h-8 w-8 inline-flex items-center justify-center"
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(i.id)}
                        className="text-muted-foreground hover:text-ink"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-ink">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Link to="/checkout" onClick={() => setOpen(false)} className="block">
                <PillButton variant="ink" size="lg" className="w-full">
                  Checkout
                </PillButton>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="w-full text-sm text-muted-foreground hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
