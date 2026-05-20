import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { PillButton } from "@/components/PillButton";
import { Truck, Mail } from "lucide-react";

function Confetti() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * -200 - 50,
    rotation: Math.random() * 360,
    color: ["#0F5132", "#00C853", "#0a0a0a", "#f3ead6", "#FFD700"][Math.floor(Math.random() * 5)],
    scale: Math.random() * 0.6 + 0.4,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-start justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: p.scale,
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function AnimatedCheckmark() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="#0F5132"
        strokeWidth="2.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        fill="#0F5132"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      <motion.path
        d="M26 42 L36 52 L54 32"
        fill="none"
        stroke="#0F5132"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisible(i);
        if (i >= text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {text.slice(0, visible)}
      <span className="animate-pulse text-emerald-vivid">|</span>
    </span>
  );
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const o = searchParams.get("o") ?? undefined;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <SiteLayout>
      <div className="container-edge py-20 lg:py-28 max-w-2xl mx-auto text-center relative">
        <AnimatePresence>
          {showConfetti && <Confetti />}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="h-20 w-20 mx-auto mb-6"
        >
          <AnimatedCheckmark />
        </motion.div>

        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          className="eyebrow text-emerald-vivid mb-3"
        >
          Order placed
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          className="display-xl text-ink mb-4"
        >
          Thank you. Your order is confirmed.
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          className="text-muted-foreground mb-2"
        >
          A confirmation email is on its way.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          className="mt-4 mb-10"
        >
          {o && (
            <p className="font-semibold text-ink text-lg">
              Order #<TypingText text={o} delay={1.2} />
            </p>
          )}
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          className="grid sm:grid-cols-2 gap-4 text-left mb-10"
        >
          <div className="border border-border rounded-2xl p-5 bg-cloud/30">
            <Truck className="h-5 w-5 text-ink mb-2" />
            <p className="font-semibold text-ink mb-1">Estimated delivery</p>
            <p className="text-sm text-muted-foreground">
              3–5 business days. Tracking will be emailed when your order ships.
            </p>
          </div>
          <div className="border border-border rounded-2xl p-5 bg-cloud/30">
            <Mail className="h-5 w-5 text-ink mb-2" />
            <p className="font-semibold text-ink mb-1">Need help?</p>
            <p className="text-sm text-muted-foreground">
              Our concierge team is available 24/7 at care@lumina.com.
            </p>
          </div>
        </motion.div>

        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={staggerItem}
          className="flex flex-wrap justify-center gap-3"
        >
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
        </motion.div>
      </div>
    </SiteLayout>
  );
}
