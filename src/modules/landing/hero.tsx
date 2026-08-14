"use client";

import {
  Sparkles,
  Zap,
  ArrowLeft,
  TrendingUp,
  CreditCard,
  Bot,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { GlowButton } from "@/components/caspian/GlowButton";
import type { ModuleManifest } from "../registry";

// ============ Hero Section Module ============

function HeroSection() {
  const { setView, siteContent } = useAppStore();
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-24 pb-16">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl float-anim pointer-events-none" />
      <div
        className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="text-center lg:text-right space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-sky-300 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            {siteContent.heroBadge}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            <span className="text-foreground">{siteContent.siteName}</span>
            <br />
            <span className="text-gradient-sky">{siteContent.heroTitleHighlight}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
            {siteContent.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <GlowButton variant="primary" size="lg" glow onClick={() => setView("auth")}>
              <Zap className="h-4 w-4" strokeWidth={2} />
              {siteContent.heroCtaText}
            </GlowButton>
            <GlowButton variant="outline" size="lg" onClick={() => setView("install")}>
              {siteContent.heroCtaSecondary}
              <ArrowLeft className="h-4 w-4" />
            </GlowButton>
          </div>
          <div className="flex items-center gap-6 justify-center lg:justify-start text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              بدون نیاز به کارت بانکی خارجی
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              سازگار با OpenAI API
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="relative aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-purple-500/10 blur-2xl" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-sky-400/20 to-transparent float-anim" />
            <div className="absolute inset-12 rounded-full glass-strong flex items-center justify-center pulse-glow">
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-600/10 flex items-center justify-center">
                <div
                  className="absolute inset-8 rounded-full border border-sky-400/30 animate-spin"
                  style={{ animationDuration: "20s" }}
                />
                <div
                  className="absolute inset-14 rounded-full border border-indigo-400/20 animate-spin"
                  style={{ animationDuration: "30s", animationDirection: "reverse" }}
                />
                <Bot className="h-20 w-20 text-sky-400" strokeWidth={1.5} />
              </div>
            </div>
            <div
              className="absolute top-6 -right-2 sm:right-0 glass-strong rounded-2xl p-3 float-anim shadow-xl"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-400/15 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">مصرف امروز</div>
                  <div className="text-sm font-bold text-foreground">۴٬۸۲۰ ت</div>
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-10 -left-2 sm:left-0 glass-strong rounded-2xl p-3 float-anim shadow-xl"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sky-400/15 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">موجودی</div>
                  <div className="text-sm font-bold text-foreground">۲۴۵٬۰۰۰ ت</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const heroSectionModule: ModuleManifest = {
  id: "landing-hero",
  name: "بخش Hero لندینگ",
  description: "بخش اصلی صفحه فرود با عنوان، توضیحات و دکمه‌های CTA",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "Zap",
  type: "landing",
  isEnabled: true,
  isCore: true,
  config: {},
  configSchema: [],
  landingSections: [
    {
      id: "hero",
      component: HeroSection,
      order: 10,
    },
  ],
};
