import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/support/$topic")({
  component: SupportPage,
});

const contentMap: Record<string, { title: string; subtitle: string; content: string }> = {
  shipping: {
    title: "Shipping & Delivery",
    subtitle: "Everything you need to know about getting your LUMINA gear.",
    content:
      "LUMINA offers complimentary standard shipping on all orders over $150. Orders are processed within 1-2 business days. Expedited shipping options are available at checkout. International shipping times vary by destination.",
  },
  returns: {
    title: "Returns & Exchanges",
    subtitle: "Our commitment to your satisfaction.",
    content:
      "We accept returns within 30 days of delivery for all unworn, unwashed items in their original condition with tags attached. Please initiate your return through your LUMINA Account. Refunds will be processed to the original payment method.",
  },
  "size-guide": {
    title: "Size Guide",
    subtitle: "Find your perfect fit.",
    content:
      "LUMINA footwear generally runs true to size. For apparel, our fit is designed to be slightly relaxed and editorial. Please refer to specific product pages for detailed measurements or contact our styling team for personalized advice.",
  },
  contact: {
    title: "Contact Us",
    subtitle: "We're here to help.",
    content:
      "Our client services team is available Monday through Friday, 9am to 6pm EST. You can reach us at support@lumina-dreams.com or via the live chat icon in the bottom right of your screen.",
  },
};

function SupportPage() {
  const { topic } = Route.useParams();
  const data = contentMap[topic] || {
    title: "Support Center",
    subtitle: "How can we help you?",
    content:
      "Please select a topic from the help menu or contact our support team directly for assistance.",
  };

  return (
    <SiteLayout>
      <div className="container-edge py-24 md:py-32 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="display-xl text-ink mb-4">{data.title}</h1>
          <p className="text-xl text-muted-foreground mb-12">{data.subtitle}</p>
          <div className="prose prose-lg text-ink/80 prose-p:leading-relaxed">
            <p>{data.content}</p>
          </div>

          <div className="mt-16 pt-16 border-t border-border">
            <h3 className="text-lg font-semibold text-ink mb-4">Need more help?</h3>
            <p className="text-muted-foreground mb-6">
              Our dedicated support team is available around the clock.
            </p>
            <button className="h-12 px-8 rounded-full bg-ink text-white font-semibold hover:bg-ink/90 transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
