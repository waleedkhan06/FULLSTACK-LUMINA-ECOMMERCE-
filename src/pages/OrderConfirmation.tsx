import { Link, useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { CheckCircle2, Truck, Mail } from "lucide-react";

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const o = searchParams.get("o") ?? undefined;

  return (
    <SiteLayout>
      <div className="container-edge py-20 lg:py-28 max-w-2xl mx-auto text-center">
        <div className="h-20 w-20 mx-auto rounded-full bg-emerald-vivid/15 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-vivid" />
        </div>
        <p className="eyebrow text-emerald-vivid mb-3">Order placed</p>
        <h1 className="display-xl text-ink mb-4">Thank you. Your order is confirmed.</h1>
        <p className="text-muted-foreground mb-2">A confirmation email is on its way.</p>
        {o && <p className="font-semibold text-ink mt-4 mb-10">Order #{o}</p>}

        <div className="grid sm:grid-cols-2 gap-4 text-left mb-10">
          <div className="border border-border rounded-2xl p-5">
            <Truck className="h-5 w-5 text-ink mb-2" />
            <p className="font-semibold text-ink mb-1">Estimated delivery</p>
            <p className="text-sm text-muted-foreground">
              3–5 business days. Tracking will be emailed when your order ships.
            </p>
          </div>
          <div className="border border-border rounded-2xl p-5">
            <Mail className="h-5 w-5 text-ink mb-2" />
            <p className="font-semibold text-ink mb-1">Need help?</p>
            <p className="text-sm text-muted-foreground">
              Our concierge team is available 24/7 at care@lumina.com.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/account">
            <PillButton variant="ink" size="lg">
              View order in account
            </PillButton>
          </Link>
          <Link to="/shop">
            <PillButton variant="outline" size="lg">
              Continue shopping
            </PillButton>
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
