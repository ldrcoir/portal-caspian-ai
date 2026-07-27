"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "gradient";
  glow?: boolean;
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-5 transition-all duration-300",
          variant === "default" && "glass",
          variant === "strong" && "glass-strong",
          variant === "gradient" && "gradient-border",
          hover && "hover:border-sky-400/40 hover:shadow-[0_8px_32px_-8px_rgba(56,189,248,0.25)] hover:-translate-y-0.5",
          glow && "glow-primary-sm",
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";
