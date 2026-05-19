import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";

const contentMap: Record<string, { title: string; subtitle: string; content: string }> = {
  sustainability: {
    title: "Sustainability",
    subtitle: "Our commitment to the future.",
    content:
      "At LUMINA, we believe luxury shouldn't come at the expense of our planet. We use 100% organic cotton, recycled nylon, and ethically sourced materials. By 2030, our entire supply chain will be carbon neutral.",
  },
  careers: {
    title: "Careers",
    subtitle: "Join the LUMINA team.",
    content:
      "We are always looking for visionary designers, engineers, and creatives who challenge the status quo. Explore our open positions at our design studios in New York, London, and Tokyo.",
  },
  press: {
    title: "Press",
    subtitle: "Media resources and latest news.",
    content:
      "For press inquiries, lookbooks, and high-resolution assets, please contact our PR team at press@lumina-dreams.com.",
  },
  investors: {
    title: "Investors",
    subtitle: "Financial information and corporate governance.",
    content:
      "LUMINA is a privately held company. For specific investor relations inquiries, please contact IR@lumina-dreams.com.",
  },
};

export default function CompanyTopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const data = contentMap[topic ?? ""] || {
    title: "Company",
    subtitle: "Lumina Atelier",
    content: "Information not found.",
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
          <p className="text-xl text-emerald-vivid mb-12">{data.subtitle}</p>
          <div className="prose prose-lg text-ink/80 prose-p:leading-relaxed">
            <p>{data.content}</p>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
