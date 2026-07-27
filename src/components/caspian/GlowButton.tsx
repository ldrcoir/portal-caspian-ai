"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "admin" | "subtle";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, type = "button", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
          size === "sm" && "h-9 px-3.5 text-sm",
          size === "md" && "h-11 px-5 text-sm",
          size === "lg" && "h-13 px-7 text-base py-3.5",
          variant === "primary" &&
            "bg-gradient-to-br from-sky-400 to-sky-600 text-sky-950 hover:from-sky-300 hover:to-sky-500 shadow-lg shadow-sky-500/20",
          variant === "primary" && glow && "glow-primary",
          variant === "admin" &&
            "bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/20",
          variant === "admin" && glow && "glow-admin",
          variant === "ghost" &&
            "bg-transparent text-sky-300 hover:bg-sky-400/10 hover:text-sky-200",
          variant === "subtle" &&
            "bg-sky-400/10 text-sky-300 border border-sky-400/20 hover:bg-sky-400/20 hover:border-sky-400/40",
          variant === "outline" &&
            "bg-transparent text-foreground border border-white/10 hover:border-sky-400/40 hover:bg-white/5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
GlowButton.displayName = "GlowButton";
