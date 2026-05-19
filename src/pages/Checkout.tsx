import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { useCart, useAuth } from "@/lib/store";
import { toast } from "sonner";
import { Lock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Step = "shipping" | "payment" | "review";

function OrderSummary({
  items,
  subtotal,
  shippingCost,
  tax,
  total,
  collapsed,
  onToggle,
  mobile,
}: {
  items: import("@/lib/store").CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}) {
  return (
    <div className={`border border-border rounded-2xl bg-cloud/40 ${mobile ? "" : "lg:sticky lg:top-32 lg:h-fit"}`}>
      {mobile && (
        <button
          type="button"
          onClick={onToggle}
          className="lg:hidden w-full flex items-center justify-between p-4 text-left"
        >
          <div>
            <h2 className="font-display text-base text-ink uppercase tracking-wider">
              Order Summary ({items.length})
            </h2>
            <p className="text-lg font-semibold text-ink mt-0.5">${total.toFixed(2)}</p>
          </div>
          {collapsed ? (
            <ChevronDown className="h-5 w-5 text-ink shrink-0 ml-3" />
          ) : (
            <ChevronUp className="h-5 w-5 text-ink shrink-0 ml-3" />
          )}
        </button>
      )}

      <div className={`${mobile && collapsed ? "hidden lg:block" : "block"}`}>
        <h2 className={`font-display text-xl text-ink uppercase tracking-wider px-6 pt-6 ${mobile ? "lg:block hidden" : "mb-5"}`}>
          Order ({items.length})
        </h2>
        <div className={`space-y-3 max-h-60 overflow-y-auto px-6 py-4 ${mobile ? "" : "lg:px-6 lg:py-4"}`}>
          {items.map((i) => (
            <div key={i.id} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 rounded-md bg-cloud overflow-hidden">
                <img src={i.image} alt={i.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-ink text-white text-[10px] font-semibold flex items-center justify-center">
                  {i.qty}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{i.name}</p>
                <p className="text-xs text-muted-foreground">
                  {i.color} · {i.size}
                </p>
              </div>
              <p className="text-sm font-semibold text-ink whitespace-nowrap">${(i.price * i.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <dl className="space-y-2 text-sm border-t border-border px-6 py-4">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="text-ink">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd className="text-ink">
              {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Tax</dt>
            <dd className="text-ink">${tax.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between text-base pt-3 border-t border-border">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-semibold text-ink">${total.toFixed(2)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("shipping");
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);

  const [shipping, setShipping] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    if (user) setShipping((s) => ({ ...s, email: s.email || user.email }));
  }, [user]);

  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const orderNumber = useMemo(() => `LMN-${Date.now().toString(36).toUpperCase()}`, []);

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-edge py-24 text-center">
          <h1 className="display-xl text-ink mb-4">Your bag is empty</h1>
          <Link to="/shop">
            <PillButton variant="ink" size="lg">
              Shop now
            </PillButton>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  async function placeOrder() {
    setSubmitting(true);
    try {
      const order = {
        id: crypto.randomUUID(),
        user_id: user ? user.id : null,
        order_number: orderNumber,
        email: shipping.email,
        shipping,
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          image: i.image,
          price: i.price,
          qty: i.qty,
          size: i.size,
          color: i.color,
        })),
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        status: "confirmed",
        created_at: new Date().toISOString(),
      };

      if (supabase) {
        const { error } = await supabase.from("orders").insert({
          id: order.id,
          user_id: order.user_id,
          order_number: order.order_number,
          email: order.email,
          shipping: order.shipping,
          items: order.items,
          subtotal: order.subtotal,
          shipping_cost: order.shipping_cost,
          tax: order.tax,
          total: order.total,
          status: order.status,
        });

        if (error) throw error;
      }

      const existing = JSON.parse(localStorage.getItem("lumina:orders") ?? "[]");
      existing.push(order);
      localStorage.setItem("lumina:orders", JSON.stringify(existing));
      clear();
      navigate(`/order-confirmation?o=${orderNumber}`);
    } catch (err) {
      console.error("[Supabase] Failed to place order in database:", err);
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <div className="px-4 py-6 lg:py-16 lg:px-0">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-display font-semibold text-ink uppercase tracking-wider mb-1">Checkout</h1>
          <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mb-6">
            <Lock className="h-3.5 w-3.5" /> Secure SSL checkout
          </p>

          {/* Mobile: Summary at top, collapsible */}
          <div className="lg:hidden mb-4">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
              collapsed={summaryOpen}
              onToggle={() => setSummaryOpen((v) => !v)}
              mobile
            />
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10">
            <div>
              {/* Step Indicator */}
              <ol className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6 text-xs font-semibold uppercase tracking-wider">
                {(["shipping", "payment", "review"] as Step[]).map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span
                      className={`h-7 w-7 rounded-full inline-flex items-center justify-center text-xs shrink-0 ${step === s ? "bg-ink text-white" : "bg-cloud text-ink"}`}
                    >
                      {i + 1}
                    </span>
                    <span className={step === s ? "text-ink" : "text-muted-foreground"}>{s}</span>
                    {i < 2 && <span className="hidden sm:block w-8 h-px bg-border" />}
                  </li>
                ))}
              </ol>

              {step === "shipping" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("payment");
                  }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-ink mb-2">
                    Contact
                  </h2>
                  <input
                    required
                    type="email"
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    placeholder="Email"
                    className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                  />
                  <h2 className="text-lg font-semibold text-ink mt-6 mb-2">
                    Shipping address
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                      placeholder="First name"
                      className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                    />
                    <input
                      required
                      value={shipping.lastName}
                      onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                      placeholder="Last name"
                      className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                    />
                  </div>
                  <input
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="Address"
                    className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      placeholder="City"
                      className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                    />
                    <input
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      placeholder="State"
                      className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                    />
                  </div>
                  <input
                    required
                    value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    placeholder="ZIP code"
                    className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                  />
                  <PillButton variant="ink" size="lg" className="w-full mt-2">
                    Continue to payment
                  </PillButton>
                </form>
              )}

              {step === "payment" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("review");
                  }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold text-ink mb-2">
                    Payment details
                  </h2>
                  <p className="text-xs text-muted-foreground mb-2">
                    Demo checkout — no real card needed.
                  </p>
                  <input
                    required
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    placeholder="Name on card"
                    className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                  />
                  <input
                    required
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                    placeholder="Card number"
                    className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      required
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                      placeholder="MM / YY"
                      className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                    />
                    <input
                      required
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      placeholder="CVV"
                      className="w-full h-12 rounded-full border border-border px-5 text-sm bg-background outline-none focus:border-ink"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <PillButton type="button" variant="outline" onClick={() => setStep("shipping")} className="flex-1">
                      Back
                    </PillButton>
                    <PillButton type="submit" variant="ink" size="lg" className="flex-[2]">
                      Review order
                    </PillButton>
                  </div>
                </form>
              )}

              {step === "review" && (
                <div className="space-y-4">
                  <div className="border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Shipping to
                        </p>
                        <p className="font-semibold text-ink">
                          {shipping.firstName} {shipping.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {shipping.address}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {shipping.city}, {shipping.state} {shipping.zip}
                        </p>
                        <p className="text-sm text-muted-foreground">{shipping.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("shipping")}
                        className="text-sm font-semibold text-ink underline underline-offset-4 shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="border border-border rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Payment
                        </p>
                        <p className="font-semibold text-ink">
                          •••• •••• •••• {payment.cardNumber.slice(-4) || "4242"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("payment")}
                        className="text-sm font-semibold text-ink underline underline-offset-4 shrink-0"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <PillButton
                      variant="ink"
                      size="lg"
                      onClick={placeOrder}
                      disabled={submitting}
                      className="w-full"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {submitting ? "Placing order..." : `Place order · $${total.toFixed(2)}`}
                    </PillButton>
                    <PillButton type="button" variant="outline" onClick={() => setStep("payment")} className="w-full">
                      Back to payment
                    </PillButton>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop: Sidebar */}
            <div className="hidden lg:block">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                tax={tax}
                total={total}
                collapsed={false}
                onToggle={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
