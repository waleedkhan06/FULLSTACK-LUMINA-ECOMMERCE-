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
}: {
  items: import("@/lib/store").CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border rounded-2xl bg-cloud/40 lg:sticky lg:top-32 lg:h-fit">
      <button
        onClick={onToggle}
        className="lg:hidden w-full flex items-center justify-between p-5 text-left"
      >
        <h2 className="font-display text-lg text-ink uppercase tracking-wider">
          Order ({items.length}) · ${total.toFixed(2)}
        </h2>
        {collapsed ? (
          <ChevronDown className="h-5 w-5 text-ink" />
        ) : (
          <ChevronUp className="h-5 w-5 text-ink" />
        )}
      </button>

      <div className={`lg:p-7 ${collapsed ? "hidden lg:block" : "block"}`}>
        <h2 className="hidden lg:block font-display text-xl text-ink uppercase tracking-wider mb-5">
          Order ({items.length})
        </h2>
        <div className="space-y-4 max-h-72 overflow-y-auto pr-1 px-5 pb-5 lg:px-0 lg:pb-0">
          {items.map((i) => (
            <div key={i.id} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 rounded-md bg-cloud overflow-hidden">
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
              <p className="text-sm font-semibold text-ink">${(i.price * i.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <dl className="space-y-2 text-sm border-t border-border pt-5 px-5 pb-5 lg:px-0 lg:pb-0">
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
      <div className="container-edge py-8 lg:py-16">
        <h1 className="display-xl text-ink mb-2">Checkout</h1>
        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mb-8">
          <Lock className="h-3.5 w-3.5" /> Secure SSL checkout
        </p>

        {/* Mobile: Summary at top, collapsible */}
        <div className="lg:hidden mb-6">
          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            collapsed={summaryOpen}
            onToggle={() => setSummaryOpen((v) => !v)}
          />
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
          <div>
            {/* Step Indicator */}
            <ol className="flex items-center gap-2 mb-8 text-xs font-semibold uppercase tracking-wider overflow-x-auto pb-1">
              {(["shipping", "payment", "review"] as Step[]).map((s, i) => (
                <li key={s} className="flex items-center gap-2 shrink-0">
                  <span
                    className={`h-7 w-7 rounded-full inline-flex items-center justify-center ${step === s ? "bg-ink text-white" : "bg-cloud text-ink"}`}
                  >
                    {i + 1}
                  </span>
                  <span className={step === s ? "text-ink" : "text-muted-foreground"}>{s}</span>
                  {i < 2 && <span className="w-8 h-px bg-border ml-1" />}
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
                <h2 className="font-display text-xl text-ink uppercase tracking-wider mb-2">
                  Contact
                </h2>
                <input
                  required
                  type="email"
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  placeholder="Email"
                  className="input-pill"
                />
                <h2 className="font-display text-xl text-ink uppercase tracking-wider mt-6 mb-2">
                  Shipping address
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={shipping.firstName}
                    onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })}
                    placeholder="First name"
                    className="input-pill"
                  />
                  <input
                    required
                    value={shipping.lastName}
                    onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })}
                    placeholder="Last name"
                    className="input-pill"
                  />
                </div>
                <input
                  required
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  placeholder="Address"
                  className="input-pill"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <input
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="City"
                    className="input-pill"
                  />
                  <input
                    required
                    value={shipping.state}
                    onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                    placeholder="State"
                    className="input-pill"
                  />
                  <input
                    required
                    value={shipping.zip}
                    onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                    placeholder="ZIP"
                    className="input-pill"
                  />
                </div>
                <PillButton variant="ink" size="lg" className="w-full">
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
                <h2 className="font-display text-xl text-ink uppercase tracking-wider mb-2">
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
                  className="input-pill"
                />
                <input
                  required
                  value={payment.cardNumber}
                  onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                  placeholder="Card number"
                  className="input-pill"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    value={payment.expiry}
                    onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                    placeholder="MM / YY"
                    className="input-pill"
                  />
                  <input
                    required
                    value={payment.cvv}
                    onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                    placeholder="CVV"
                    className="input-pill"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <PillButton type="button" variant="outline" onClick={() => setStep("shipping")}>
                    Back
                  </PillButton>
                  <PillButton type="submit" variant="ink" size="lg">
                    Review order
                  </PillButton>
                </div>
              </form>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <div className="border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        Shipping to
                      </p>
                      <p className="font-semibold text-ink">
                        {shipping.firstName} {shipping.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}
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
                <div className="border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4">
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
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <PillButton type="button" variant="outline" onClick={() => setStep("payment")} className="w-full sm:w-auto">
                    Back
                  </PillButton>
                  <PillButton
                    variant="ink"
                    size="lg"
                    onClick={placeOrder}
                    disabled={submitting}
                    className="w-full sm:w-auto flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {submitting ? "Placing order..." : `Place order · $${total.toFixed(2)}`}
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
    </SiteLayout>
  );
}
