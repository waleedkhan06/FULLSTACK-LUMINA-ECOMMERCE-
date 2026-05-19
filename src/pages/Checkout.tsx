import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { useCart, useAuth } from "@/lib/store";
import { toast } from "sonner";
import { Lock, CheckCircle2 } from "lucide-react";

type Step = "shipping" | "payment" | "review";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("shipping");
  const [submitting, setSubmitting] = useState(false);

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

  const shippingCost = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const orderNumber = `LMN-${Date.now().toString(36).toUpperCase()}`;

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

      const existing = JSON.parse(localStorage.getItem("lumina:orders") ?? "[]");
      existing.push(order);
      localStorage.setItem("lumina:orders", JSON.stringify(existing));
      clear();
      navigate(`/order-confirmation?o=${orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SiteLayout>
      <div className="container-edge py-12 lg:py-16 grid lg:grid-cols-[1fr_400px] gap-12">
        <div>
          <h1 className="display-xl text-ink mb-2">Checkout</h1>
          <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mb-8">
            <Lock className="h-3.5 w-3.5" /> Secure SSL checkout
          </p>

          <ol className="flex items-center gap-2 mb-10 text-xs font-semibold uppercase tracking-wider">
            {(["shipping", "payment", "review"] as Step[]).map((s, i) => (
              <li key={s} className="flex items-center gap-2">
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
              className="space-y-4 max-w-xl"
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
              <div className="grid sm:grid-cols-3 gap-4">
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
              <PillButton variant="ink" size="lg" className="w-full sm:w-auto">
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
              className="space-y-4 max-w-xl"
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
                <PillButton variant="ink" size="lg">
                  Review order
                </PillButton>
              </div>
            </form>
          )}

          {step === "review" && (
            <div className="max-w-xl space-y-6">
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
                    onClick={() => setStep("shipping")}
                    className="text-sm font-semibold text-ink underline underline-offset-4"
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
                    onClick={() => setStep("payment")}
                    className="text-sm font-semibold text-ink underline underline-offset-4"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <PillButton type="button" variant="outline" onClick={() => setStep("payment")}>
                  Back
                </PillButton>
                <PillButton
                  variant="ink"
                  size="lg"
                  onClick={placeOrder}
                  disabled={submitting}
                  className="flex-1 sm:flex-none"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {submitting ? "Placing order..." : `Place order · $${total.toFixed(2)}`}
                </PillButton>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-32 lg:h-fit border border-border rounded-2xl p-7 bg-cloud/40 h-fit">
          <h2 className="font-display text-xl text-ink uppercase tracking-wider mb-5">
            Order ({items.length})
          </h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
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
          <dl className="mt-6 space-y-2 text-sm border-t border-border pt-5">
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
        </aside>
      </div>
    </SiteLayout>
  );
}
