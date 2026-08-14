"use client";

import {
  Clock,
  Globe2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Bot,
  Server,
  Cpu,
  Cloud,
  Database,
  Network,
  HardDrive,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import type { ModuleManifest } from "../registry";

const ICON_MAP: Record<string, typeof Clock> = {
  Clock,
  Globe2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Bot,
  Server,
  Cpu,
  Cloud,
  Database,
  Network,
  HardDrive,
};

const COLOR_MAP: Record<string, string> = {
  sky: "#38BDF8",
  indigo: "#818CF8",
  emerald: "#34D399",
  amber: "#FBBF24",
};

function FeaturesSection() {
  const { siteContent } = useAppStore();
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/10 text-sky-300 text-xs font-medium">
            چرا کاسپین؟
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            ساخته شده برای <span className="text-gradient-sky">ایران</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            تمام چیزی که برای استفاده حرفه‌ای از هوش مصنوعی نیاز دارید، در یک پلتفرم
            یکپارچه — با تمرکز بر شفافیت، امنیت و تجربه کاربری.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteContent.features.map((feat) => {
            const Icon = ICON_MAP[feat.icon] || Sparkles;
            const color = COLOR_MAP[feat.color] || "#38BDF8";
            return (
              <GlassCard key={feat.id} hover className="space-y-4 group">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}22` }}
                >
                  <Icon className="h-6 w-6" style={{ color }} strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-lg text-foreground">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const featuresSectionModule: ModuleManifest = {
  id: "landing-features",
  name: "بخش ویژگی‌ها",
  description: "نمایش ۴ کارت ویژگی اصلی پلتفرم",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "Sparkles",
  type: "landing",
  isEnabled: true,
  isCore: false,
  config: {},
  configSchema: [],
  landingSections: [
    {
      id: "features",
      component: FeaturesSection,
      order: 20,
    },
  ],
};
