import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", to: "/shop" },
      { label: "Sneakers", to: "/shop", search: { collection: "Sneakers" } },
      { label: "Apparel", to: "/shop", search: { collection: "Apparel" } },
      { label: "Activewear", to: "/shop", search: { collection: "Activewear" } },
      { label: "Sale", to: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Order Status", to: "/account" },
      { label: "Shipping & Delivery", to: "/support/$topic", params: { topic: "shipping" } },
      { label: "Returns", to: "/support/$topic", params: { topic: "returns" } },
      { label: "Size Guide", to: "/support/$topic", params: { topic: "size-guide" } },
      { label: "Contact", to: "/support/$topic", params: { topic: "contact" } },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About LUMINA", to: "/about" },
      { label: "Sustainability", to: "/company/$topic", params: { topic: "sustainability" } },
      { label: "Careers", to: "/company/$topic", params: { topic: "careers" } },
      { label: "Press", to: "/company/$topic", params: { topic: "press" } },
      { label: "Investors", to: "/company/$topic", params: { topic: "investors" } },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground mt-32">
      <div className="container-edge py-20 grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr]">
        <div>
          <Link to="/" className="font-display text-4xl tracking-wider">
            LUMINA
          </Link>
          <p className="mt-6 text-sm text-white/60 max-w-xs leading-relaxed">
            Premium sneakers, apparel and lifestyle — built without compromise. Made for the
            relentless few.
          </p>
          <div className="flex gap-3 mt-8">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="h-11 w-11 rounded-full border border-white/20 inline-flex items-center justify-center hover:bg-white hover:text-ink transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="eyebrow text-white/60 mb-5">{col.title}</h4>
            <ul className="flex flex-col gap-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {col.links.map((l: any) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    search={l.search}
                    params={l.params}
                    className="text-sm text-white hover:text-emerald-vivid transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="eyebrow text-white/60 mb-5">Newsletter</h4>
          <p className="text-sm text-white/70 mb-5 leading-relaxed">
            First access to drops, stories and member-only releases.
          </p>
          <form className="flex bg-white/10 rounded-full p-1.5 backdrop-blur">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/50"
            />
            <button className="bg-white text-ink rounded-full px-5 text-xs font-semibold uppercase tracking-wider">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-edge py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 LUMINA Atelier. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
