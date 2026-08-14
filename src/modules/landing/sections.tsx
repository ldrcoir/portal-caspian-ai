"use client";

import { Bot, Sparkles, Check, Quote, ArrowLeft, Users } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import type { ModuleManifest } from "../registry";

// ============ Models Section ============
function ModelsSection() {
  const { setView, models, siteContent } = useAppStore();
  return (
    <section id="models" className="py-20 lg:py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/10 text-indigo-300 text-xs font-medium">
            <Bot className="h-3.5 w-3.5" />
            مدل‌ها
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            {siteContent.modelsSectionTitle}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {siteContent.modelsSectionSubtitle}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {models.filter((m) => m.isActive).slice(0, 6).map((model) => (
            <GlassCard key={model.id} hover className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky-500/30 to-indigo-500/20 flex items-center justify-center text-sky-300 font-bold text-sm">
                    {model.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{model.name}</div>
                    <div className="text-xs text-muted-foreground">{model.provider}</div>
                  </div>
                </div>
                {model.badge && (
                  <span className="text-[10px] px-2 py-1 rounded-md bg-sky-400/15 text-sky-300 font-bold">
                    {model.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {model.description}
              </p>
              <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-xs">
                <div>
                  <span className="text-muted-foreground">ورودی: </span>
                  <span className="font-bold text-foreground">
                    {model.inputTokenPriceToman.toLocaleString("fa-IR")} ت
                  </span>
                  <span className="text-muted-foreground"> /۱K</span>
                </div>
                <div>
                  <span className="text-muted-foreground">خروجی: </span>
                  <span className="font-bold text-foreground">
                    {model.outputTokenPriceToman.toLocaleString("fa-IR")} ت
                  </span>
                  <span className="text-muted-foreground"> /۱K</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export const modelsSectionModule: ModuleManifest = {
  id: "landing-models",
  name: "بخش نمایش مدل‌ها",
  description: "نمایش مدل‌های هوش مصنوعی فعال پلتفرم",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "Bot",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [{ id: "models", component: ModelsSection, order: 30 }],
};

// ============ Agents Section ============
function AgentsSection() {
  const { agents, siteContent } = useAppStore();
  return (
    <section id="agents" className="py-20 lg:py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            عامل‌های تخصصی
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            {siteContent.agentsSectionTitle}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {siteContent.agentsSectionSubtitle}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {agents.filter((a) => a.isPublic).map((agent) => (
            <GlassCard key={agent.id} hover className="text-center space-y-4">
              <div
                className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: `${agent.color}22`,
                  boxShadow: `0 8px 24px -8px ${agent.color}55`,
                }}
              >
                <Sparkles className="h-7 w-7" style={{ color: agent.color }} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: agent.color }}>
                {agent.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export const agentsSectionModule: ModuleManifest = {
  id: "landing-agents",
  name: "بخش نمایش عامل‌ها",
  description: "نمایش عامل‌های تخصصی پلتفرم",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "Sparkles",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [{ id: "agents", component: AgentsSection, order: 40 }],
};

// ============ Pricing Section ============
function PricingSection() {
  const { setView, pricingTiers, siteContent } = useAppStore();
  return (
    <section id="pricing" className="py-20 lg:py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-medium">
            قیمت‌گذاری
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            {siteContent.pricingSectionTitle}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {siteContent.pricingSectionSubtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <GlassCard
              key={tier.id}
              variant={tier.highlighted ? "gradient" : "default"}
              glow={tier.highlighted}
              className={`space-y-6 relative ${tier.highlighted ? "lg:scale-105" : ""}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 text-sky-950 text-xs font-bold">
                  پیشنهادی
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gradient-sky">
                    {tier.monthlyPriceToman.toLocaleString("fa-IR")}
                  </span>
                  <span className="text-sm text-muted-foreground">تومان / ماه</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  شامل {tier.includedCredit.toLocaleString("fa-IR")} تومان اعتبار
                </p>
              </div>
              <GlowButton
                variant={tier.highlighted ? "primary" : "outline"}
                size="md"
                glow={tier.highlighted}
                className="w-full"
                onClick={() => setView("auth")}
              >
                {tier.monthlyPriceToman === 0 ? "شروع رایگان" : "انتخاب پلن"}
              </GlowButton>
              <ul className="space-y-3 text-sm">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export const pricingSectionModule: ModuleManifest = {
  id: "landing-pricing",
  name: "بخش قیمت‌گذاری",
  description: "نمایش پلن‌های قیمت‌گذاری پلتفرم",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "CreditCard",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [{ id: "pricing", component: PricingSection, order: 50 }],
};

// ============ Testimonial Section ============
function TestimonialSection() {
  const { siteContent } = useAppStore();
  return (
    <section className="py-20 lg:py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <Quote className="mx-auto h-12 w-12 text-sky-400/30" strokeWidth={1.5} />
        <blockquote className="text-2xl sm:text-3xl font-bold leading-relaxed text-foreground">
          «{siteContent.testimonial.quote}»
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sky-950 font-bold">
            {siteContent.testimonial.authorName.charAt(0)}
          </div>
          <div className="text-right">
            <div className="font-bold text-foreground">{siteContent.testimonial.authorName}</div>
            <div className="text-sm text-muted-foreground">{siteContent.testimonial.authorRole}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const testimonialSectionModule: ModuleManifest = {
  id: "landing-testimonial",
  name: "بخش نقل‌قول مشتری",
  description: "نمایش نقل‌قول یکی از مشتریان پلتفرم",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "Quote",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [{ id: "testimonial", component: TestimonialSection, order: 60 }],
};

// ============ CTA Section ============
function CTASection() {
  const { setView, siteContent } = useAppStore();
  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard variant="gradient" glow className="relative overflow-hidden text-center py-14 px-6">
          <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
          <div className="relative space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">{siteContent.ctaTitle}</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {siteContent.ctaSubtitle}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setView("auth");
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm"
              />
              <GlowButton type="submit" variant="primary" glow size="lg">
                شروع رایگان
                <ArrowLeft className="h-4 w-4" />
              </GlowButton>
            </form>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export const ctaSectionModule: ModuleManifest = {
  id: "landing-cta",
  name: "بخش CTA",
  description: "بخش فراخوان به اقدام (ثبت‌نام) در انتهای صفحه فرود",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "ArrowLeft",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [{ id: "cta", component: CTASection, order: 70 }],
};

// ============ Trust Bar Section ============
function TrustBarSection() {
  const { siteContent } = useAppStore();
  return (
    <section className="border-y border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground mb-6">به اعتماد کسب‌وکارهای ایرانی</p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
          {siteContent.trustedBrands.map((brand) => (
            <div
              key={brand}
              className="text-base sm:text-lg font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const trustBarSectionModule: ModuleManifest = {
  id: "landing-trustbar",
  name: "نوار برندهای مورد اعتماد",
  description: "نمایش لوگوی برندهای ایرانی که به پلتفرم اعتماد کرده‌اند",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "Users",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [{ id: "trustbar", component: TrustBarSection, order: 15 }],
};
