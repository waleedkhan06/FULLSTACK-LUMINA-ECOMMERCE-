import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import editorial1 from "@/assets/editorial-1.jpg";
import categoryActive from "@/assets/category-activewear.jpg";
import categoryApparel from "@/assets/category-apparel.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — LUMINA" },
      {
        name: "description",
        content:
          "LUMINA is a premium fashion atelier crafting sneakers, apparel and activewear. Built without compromise — designed for the relentless few.",
      },
      { property: "og:title", content: "Our Story — LUMINA" },
      {
        property: "og:description",
        content: "Built without compromise — designed for the relentless few.",
      },
      { property: "og:image", content: editorial1 },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <img
          src={editorial1}
          alt="LUMINA Story"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container-edge h-full flex flex-col justify-end pb-20">
          <p className="eyebrow text-white/80 mb-4">Chapter 01 · The Atelier</p>
          <h1 className="display-mega text-white max-w-4xl">
            Born from
            <br />
            movement.
          </h1>
        </div>
      </section>

      {/* Manifesto */}
      <section className="container-edge py-24 md:py-32 max-w-4xl">
        <p className="eyebrow text-emerald-vivid mb-6">Manifesto</p>
        <h2 className="display-xl text-ink mb-10">
          We don't make products.
          <br />
          We make instruments.
        </h2>
        <div className="grid md:grid-cols-2 gap-10 text-lg text-charcoal leading-relaxed">
          <p>
            LUMINA was founded in 2021 in a small Porto workshop by three designers who wanted
            nothing more than to make the things they themselves wanted to wear. No focus groups. No
            compromise.
          </p>
          <p>
            Five years later, we still operate the same way. Every silhouette is prototyped by hand.
            Every fabric is chosen by feel. Every season is built around a single, uncompromising
            question — does it move you?
          </p>
        </div>
      </section>

      {/* Editorial split */}
      <section className="grid md:grid-cols-2">
        <div className="aspect-[4/5] md:aspect-auto">
          <img
            src={categoryApparel}
            alt="Studio"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="bg-cloud p-12 md:p-20 flex flex-col justify-center">
          <p className="eyebrow text-emerald-vivid mb-4">Chapter 02</p>
          <h3 className="display-xl text-ink mb-6">Material honesty.</h3>
          <p className="text-charcoal leading-relaxed mb-6">
            We work exclusively with mills and tanneries we've visited in person. Italian wool.
            Portuguese leather. Japanese cotton. Recycled wherever possible — premium always.
          </p>
          <p className="text-charcoal leading-relaxed">
            By 2027, every LUMINA garment will be 100% traceable from fiber to finish.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="bg-ink text-ink-foreground p-12 md:p-20 flex flex-col justify-center order-2 md:order-1">
          <p className="eyebrow text-emerald-vivid mb-4">Chapter 03</p>
          <h3 className="display-xl text-white mb-6">
            For the
            <br />
            relentless few.
          </h3>
          <p className="text-white/75 leading-relaxed mb-8">
            Our community is global, opinionated, and impossible to define. Athletes. Designers.
            Builders. The kind of people who notice the stitching.
          </p>
          <div>
            <Link to="/membership">
              <PillButton variant="vivid" size="lg">
                Join the Movement
              </PillButton>
            </Link>
          </div>
        </div>
        <div className="aspect-[4/5] md:aspect-auto order-1 md:order-2">
          <img
            src={categoryActive}
            alt="Athlete"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </section>

      {/* Numbers */}
      <section className="container-edge py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-border pt-16">
          {[
            { n: "2021", l: "Founded in Porto" },
            { n: "47", l: "Countries shipped" },
            { n: "100%", l: "Traceable by 2027" },
            { n: "01", l: "Promise — no compromise" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-5xl md:text-6xl text-ink mb-3">{s.n}</p>
              <p className="text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
