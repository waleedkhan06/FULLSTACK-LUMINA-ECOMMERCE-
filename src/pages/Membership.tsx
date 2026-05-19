import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import membershipImg from "@/assets/membership.jpg";
import membershipMobile from "@/assets/membershipmobile.png";

const tiers = [
  {
    name: "Member",
    price: "Free",
    desc: "Everyone is welcome. Always.",
    features: [
      "Free standard shipping",
      "Early access 24h before drops",
      "Members-only newsletter",
      "Birthday gift",
    ],
    cta: "Join Free",
    variant: "ink" as const,
  },
  {
    name: "Inner Circle",
    price: "$120 / yr",
    desc: "For the relentless few.",
    features: [
      "Everything in Member",
      "Free express shipping forever",
      "Members-only product drops",
      "Invitations to global events",
      "Personal styling sessions",
      "Concierge support",
    ],
    cta: "Become Inner Circle",
    variant: "vivid" as const,
    featured: true,
  },
];

export default function MembershipPage() {
  return (
    <SiteLayout>
      {/* Hero Section with animations */}
      <section className="relative h-[75vh] min-h-[560px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={membershipMobile}
            alt="LUMINA Membership"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover md:hidden"
          />
          <img
            src={membershipImg}
            alt="LUMINA Membership"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover hidden md:block"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-transparent" />
        <div className="relative z-10 container-edge h-full flex flex-col justify-end pb-20">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow text-emerald-vivid mb-5"
          >
            LUMINA Membership
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="display-mega text-white text-reveal"
          >
            Become a member.
            <br />
            Become more.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-white/90 max-w-xl text-lg leading-relaxed"
          >
            Join free for early access to every drop, free shipping, and members-only product.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <PillButton variant="white" size="lg">
              Join Free Today
            </PillButton>
          </motion.div>
        </div>
      </section>

      {/* Tiers with staggered animation */}
      <section className="container-edge py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="eyebrow text-emerald-vivid mb-4">Choose Your Tier</p>
          <h2 className="display-xl text-ink">Two ways to belong.</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`rounded-3xl p-10 md:p-12 ${t.featured ? "bg-ink text-white" : "bg-cloud"} hover-lift`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3
                  className={`font-display text-4xl uppercase ${t.featured ? "text-white" : "text-ink"}`}
                >
                  {t.name}
                </h3>
                {t.featured && <span className="eyebrow text-emerald-vivid">Most Loved</span>}
              </div>
              <p className={`mb-6 ${t.featured ? "text-white/70" : "text-muted-foreground"}`}>
                {t.desc}
              </p>
              <p
                className={`font-display text-6xl mb-10 ${t.featured ? "text-emerald-vivid" : "text-ink"}`}
              >
                {t.price}
              </p>
              <ul className="flex flex-col gap-4 mb-10">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-3 text-sm ${t.featured ? "text-white/85" : "text-charcoal"}`}
                  >
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${t.featured ? "text-emerald-vivid" : "text-ink"}`}
                    />{" "}
                    {f}
                  </li>
                ))}
              </ul>
              <PillButton variant={t.variant} size="lg" className="w-full">
                {t.cta}
              </PillButton>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks grid with staggered animation */}
      <section className="container-edge pb-24 md:pb-32">
        <div className="bg-cloud rounded-3xl p-12 md:p-20 grid md:grid-cols-3 gap-10">
          {[
            {
              n: "01",
              t: "First Access",
              d: "Shop every drop 24 hours before public release. Never miss the silhouette you wanted.",
            },
            { n: "02", t: "Express Shipping", d: "Free, on every order. No minimum. No nonsense." },
            {
              n: "03",
              t: "Member Events",
              d: "In-store activations, runway previews, and founder dinners across 12 cities.",
            },
            {
              n: "04",
              t: "Studio Sessions",
              d: "1:1 styling appointments — virtual or in-store, whenever you want.",
            },
            {
              n: "05",
              t: "Members-Only Product",
              d: "Quiet drops only visible to members. Made in extremely limited runs.",
            },
            {
              n: "06",
              t: "Lifetime Repairs",
              d: "Free repairs on every LUMINA garment, for as long as you wear it.",
            },
          ].map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-border pt-6"
            >
              <p className="font-display text-3xl text-emerald-vivid mb-3">{p.n}</p>
              <h4 className="text-ink font-semibold text-lg mb-2">{p.t}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="container-edge pb-32 text-center"
      >
        <h2 className="display-xl text-ink mb-6">Ready when you are.</h2>
        <Link to="/shop">
          <PillButton variant="ink" size="lg">
            Start Shopping
          </PillButton>
        </Link>
      </motion.section>
    </SiteLayout>
  );
}
