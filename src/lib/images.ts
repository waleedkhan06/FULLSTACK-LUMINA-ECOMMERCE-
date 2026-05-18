import sneaker1 from "@/assets/sneaker-1.jpg";
import sneaker2 from "@/assets/sneaker-2.jpg";
import sneaker3 from "@/assets/sneaker-3.jpg";
import sneaker4 from "@/assets/sneaker-4.jpg";
import apparel1 from "@/assets/apparel-1.jpg";
import apparel2 from "@/assets/apparel-2.jpg";
import apparel3 from "@/assets/apparel-3.jpg";
import apparel4 from "@/assets/apparel-4.jpg";

import sneaker5 from "@/assets/sneaker5.jpg";
import sneaker6 from "@/assets/sneaker6.jpg";
import sneaker7 from "@/assets/sneaker7.jpg";
import sneaker8 from "@/assets/sneaker8.jpg";

import apparel5 from "@/assets/apparel5.png";
import apparel6 from "@/assets/apparel6.webp";
import apparel7 from "@/assets/apparel7.webp";
import apparel8 from "@/assets/apparel8.jpg";
import apparel9 from "@/assets/apparel9.png";

import active1 from "@/assets/active1.png";
import active2 from "@/assets/active2.png";
import active3 from "@/assets/active3.jpg";
import active4 from "@/assets/active4.webp";
import active5 from "@/assets/active5.jpg";

import acc1 from "@/assets/acc1.png";
import acc2 from "@/assets/acc2.webp";
import acc3 from "@/assets/acc3.webp";
import acc4 from "@/assets/acc4.webp";
import acc5 from "@/assets/acc5.jpg";
import acc6 from "@/assets/acc6.png";
import acc7 from "@/assets/acc7.png";

export const imageMap: Record<string, string> = {
  "sneaker-1": sneaker1,
  "sneaker-2": sneaker2,
  "sneaker-3": sneaker3,
  "sneaker-4": sneaker4,
  "apparel-1": apparel1,
  "apparel-2": apparel2,
  "apparel-3": apparel3,
  "apparel-4": apparel4,
  "sneaker-5": sneaker5,
  "sneaker-6": sneaker6,
  "sneaker-7": sneaker7,
  "sneaker-8": sneaker8,
  "apparel-5": apparel5,
  "apparel-6": apparel6,
  "apparel-7": apparel7,
  "apparel-8": apparel8,
  "apparel-9": apparel9,
  "active-1": active1,
  "active-2": active2,
  "active-3": active3,
  "active-4": active4,
  "active-5": active5,
  "acc-1": acc1,
  "acc-2": acc2,
  "acc-3": acc3,
  "acc-4": acc4,
  "acc-5": acc5,
  "acc-6": acc6,
  "acc-7": acc7,
};

/**
 * Resolve an image reference to a usable URL.
 * - Full http(s) URLs are returned as-is (e.g. CDN, external).
 * - Bare keys (e.g. "sneaker-1") fall back to bundled assets.
 */
export function resolveImage(key: string): string {
  if (!key) return imageMap["sneaker-1"];
  if (/^https?:\/\//i.test(key)) return key;
  return imageMap[key] ?? imageMap["sneaker-1"];
}
