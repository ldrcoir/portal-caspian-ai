"use client";

import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export function Logo({ size = 36, showText = true, className, textClassName }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="relative flex items-center justify-center rounded-xl glow-primary-sm"
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(135deg, #38BDF8 0%, #0EA5E9 50%, #0369A1 100%)",
        }}
      >
        <Droplet
          className="text-white"
          style={{ width: size * 0.55, height: size * 0.55 }}
          strokeWidth={2.2}
          fill="white"
          fillOpacity={0.3}
        />
        <span
          className="absolute inset-0 rounded-xl"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.45) 0%, transparent 50%)",
          }}
        />
      </div>
      {showText && (
        <div className={cn("flex flex-col leading-none", textClassName)}>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            کاسپین{" "}
            <span className="text-gradient-sky font-black">AI</span>
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
            هوش مصنوعی، عمیق و شفاف
          </span>
        </div>
      )}
    </div>
  );
}
