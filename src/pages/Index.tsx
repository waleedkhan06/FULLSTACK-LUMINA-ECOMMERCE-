import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/products-store";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import heroMain from "@/assets/hero-main.jpg";
import categorySneakers from "@/assets/category-sneakers.jpg";
import categoryApparel from "@/assets/category-apparel.jpg";
import categoryActive from "@/assets/category-activewear.jpg";
import editorial1 from "@/assets/editorial-1.jpg";

export default function Index() {
  const { products } = useProducts();

  const featuredSneakers = products.filter((p) => p.collection === "Sneakers").slice(0, 4);
  const featuredApparel = products.filter((p) => p.collection === "Apparel").slice(0, 4);
  const featuredAccessories = products.filter((p) => p.collection === "Accessories").slice(0, 4);

  const categories = [
    { name: "Sneakers", tag: "Engineered for the streets", img: categorySneakers },
    { name: "Apparel", tag: "Editorial silhouettes", img: categoryApparel },
    { name: "Activewear", tag: "Performance, refined", img: categoryActive },
  ];

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] md:h-[calc(100vh-140px)] min-h-[480px] max-h-[900px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={heroMain}
            alt="LUMINA Spring Campaign"
            loading="eager"
            fetchPriority="high"
            className="w-full h-full object-cover object-[center_25%]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute inset-0 w-full h-full bg-linear-to-t from-black/70 via-black/30 to-transparent"
        />

        <div className="relative z-10 w-full h-full container-edge flex flex-col justify-end pb-12 md:pb-20 overflow-visible max-w-5xl pt-24 md:pt-36">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow text-white/90 mb-3"
          >
            Spring Campaign · 2026
          </motion.p>

          <div className="max-w-5xl overflow-visible py-2">
            <motion.h1
              initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="display-mega text-white text-reveal"
            >
              Move
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.0, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="display-mega text-white text-reveal"
            >
              like nothing
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="display-mega text-white text-reveal"
            >
              holds you.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-white/90 max-w-md text-base md:text-lg leading-relaxed"
          >
            The new Aeris collection. Built from the ground up for the relentless few.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link to="/shop">
              <PillButton variant="white" size="lg">
                Shop the Collection
              </PillButton>
            </Link>
            <Link to="/about">
              <PillButton
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-ink"
              >
                Watch the Film
              </PillButton>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-white/40"
          />
        </motion.div>
      </section>

      {/* Featured Sneakers */}
      <ScrollRevealSection>
        <div className="container-edge py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="eyebrow text-emerald-vivid mb-3">The Collection</p>
              <h2 className="display-xl text-ink">Featured Sneakers</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-ink lumina-link inline-flex items-center gap-2"
            >
              Shop Sneakers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            {featuredSneakers.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* Categories */}
      <ScrollRevealSection>
        <div className="container-edge pb-16 md:pb-20">
          <div className="mb-12">
            <p className="eyebrow text-emerald-vivid mb-3">The Edit</p>
            <h2 className="display-xl text-ink">Shop by Category</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {categories.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/shop"
                  className="group relative aspect-[3/4] md:aspect-3/4 overflow-hidden rounded-lg bg-cloud block hover-lift"
                >
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-[center_30%] transition-transform duration-1400 ease-out group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7 flex flex-col items-start gap-3 md:gap-4">
                    <div>
                      <p className="text-white/80 text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">
                        {c.tag}
                      </p>
                      <h3 className="font-display text-2xl md:text-4xl text-white uppercase">{c.name}</h3>
                    </div>
                    <PillButton variant="white" size="sm">
                      Shop {c.name}
                    </PillButton>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* Our Apparel */}
      <ScrollRevealSection>
        <div className="container-edge py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="eyebrow text-emerald-vivid mb-3">Editorial Silhouettes</p>
              <h2 className="display-xl text-ink">Our Apparel</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-ink lumina-link inline-flex items-center gap-2"
            >
              Shop Apparel <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
            {featuredApparel.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </ScrollRevealSection>

      {/* Editorial */}
      <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img
            src={editorial1}
            alt="LUMINA Tokyo Editorial"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />
        <div className="relative z-10 container-edge h-full flex flex-col justify-center max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow text-white/90 mb-5"
          >
            Field Notes · Tokyo
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="display-xl text-white mb-6"
          >
            Streets that
            <br />
            never sleep.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/85 text-lg leading-relaxed mb-8"
          >
            A photo essay following five creatives reshaping Tokyo's after-hours streetwear scene.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/about">
              <PillButton variant="white" size="lg">
                Read the Story
              </PillButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Accessories */}
      <ScrollRevealSection>
        <div className="container-edge py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6 flex-wrap">
            <div>
              <p className="eyebrow text-emerald-vivid mb-3">The Details</p>
              <h2 className="display-xl text-ink">Our Accessories</h2>
            </div>
            <Link
              to="/shop"
              className="text-sm font-semibold text-ink lumina-link inline-flex items-center gap-2"
            >
              Shop Accessories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {featuredAccessories.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
              {featuredAccessories.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="display-lg text-ink mb-4">Coming Soon</p>
              <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                Our curated accessories collection is dropping soon. Stay tuned.
              </p>
              <Link to="/shop">
                <PillButton variant="ink" size="lg">
                  Explore All Products
                </PillButton>
              </Link>
            </div>
          )}
        </div>
      </ScrollRevealSection>

      {/* Membership */}
      <ScrollRevealSection>
        <div className="container-edge pb-24">
          <div className="bg-ink text-ink-foreground rounded-3xl p-12 md:p-20 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="eyebrow text-emerald-vivid mb-4"
              >
                LUMINA Membership
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="display-xl text-white mb-6"
              >
                Become a member.
                <br />
                Become more.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white/75 text-lg leading-relaxed mb-8 max-w-md"
              >
                Free express shipping, first access to drops, members-only product, and invitations
                to in-person events.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link to="/membership">
                  <PillButton variant="vivid" size="lg">
                    Join Free
                  </PillButton>
                </Link>
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-white">
              {[
                { n: "01", t: "Early Access", d: "Shop drops 24h before public release." },
                { n: "02", t: "Free Shipping", d: "On every order, no minimum." },
                { n: "03", t: "Member Events", d: "In-store + global activations." },
              ].map((b, i) => (
                <motion.div
                  key={b.n}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className="border-t border-white/20 pt-5"
                >
                  <p className="font-display text-3xl text-emerald-vivid mb-3">{b.n}</p>
                  <h4 className="text-white text-base font-semibold mb-2">{b.t}</h4>
                  <p className="text-white/65 text-sm leading-relaxed">{b.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollRevealSection>
    </SiteLayout>
  );
}

function ScrollRevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div ref={ref} className={className}>
      <div
        className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {children}
      </div>
    </div>
  );
}
