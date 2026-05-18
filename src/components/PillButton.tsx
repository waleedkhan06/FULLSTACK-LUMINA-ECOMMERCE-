import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "ink" | "white" | "outline" | "vivid";
type Size = "md" | "lg" | "sm";

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const variants: Record<Variant, string> = {
  ink: "bg-ink text-ink-foreground hover:bg-ink/90",
  white: "bg-white text-ink hover:bg-white/90",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-ink-foreground",
  vivid: "bg-emerald-vivid text-ink-foreground hover:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-sm",
  lg: "h-14 px-9 text-base",
};

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ className, variant = "ink", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium tracking-wide transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
PillButton.displayName = "PillButton";
