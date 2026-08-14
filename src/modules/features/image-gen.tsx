"use client";

import { useState } from "react";
import { ImageIcon, Wand2, Download, Clock, Coins, Sparkles } from "lucide-react";
import { useAppStore, formatToman, formatRelativeTime } from "@/store/app-store";
import { useT } from "@/i18n";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ModuleManifest } from "../registry";

const IMAGE_MODELS = [
  { id: "dall-e-3", name: "DALL-E 3", cost: 50000, sizes: ["1024x1024", "1024x1792", "1792x1024"] },
  { id: "stable-diffusion-xl", name: "Stable Diffusion XL", cost: 15000, sizes: ["1024x1024", "512x512"] },
];

const SIZES = [
  { id: "1024x1024", label: "مربعی (۱۰۲۴×۱۰۲۴)" },
  { id: "1024x1792", label: "عمودی (۱۰۲۴×۱۷۹۲)" },
  { id: "1792x1024", label: "افقی (۱۷۹۲×۱۰۲۴)" },
];

const QUALITIES = [
  { id: "standard", label: "استاندارد" },
  { id: "hd", label: "HD" },
];

export function ImageGenView() {
  const { user, models, imageGenerations, addImageGeneration } = useAppStore();
  const t = useT();
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState("dall-e-3");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [generating, setGenerating] = useState(false);

  if (!user) return null;
  const userImages = imageGenerations.filter((g) => g.userId === user.id);
  const selectedModel = IMAGE_MODELS.find((m) => m.id === modelId);
  const cost = selectedModel?.cost || 0;

  const handleGenerate = () => {
    if (!prompt.trim()) { toast.error("توصیف تصویر الزامی است"); return; }
    if (user.creditBalance < cost) { toast.error("موجودی کیف پول کافی نیست"); return; }

    setGenerating(true);
    setTimeout(() => {
      // Mock: generate a placeholder image
      const imageUrl = `https://picsum.photos/seed/${Date.now()}/${size.split("x")[0]}/${size.split("x")[1]}`;
      addImageGeneration({ userId: user.id, prompt: prompt.trim(), modelId, size, quality, imageUrl, cost });
      setGenerating(false);
      toast.success("تصویر تولید شد");
    }, 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
          <Wand2 className="h-7 w-7 text-purple-400" />
          {t("imageGen.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t("imageGen.subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generation form */}
        <GlassCard className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("imageGen.prompt")}</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4} placeholder={t("imageGen.promptPlaceholder")} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-purple-400/50 focus:outline-none text-sm resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("imageGen.model")}</label>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_MODELS.map((m) => (
                <button key={m.id} onClick={() => setModelId(m.id)} className={cn("p-3 rounded-xl border text-sm font-semibold transition-all", modelId === m.id ? "bg-purple-400/15 border-purple-400/40 text-purple-300" : "bg-white/5 border-white/10 text-foreground hover:border-purple-400/30")}>
                  {m.name}
                  <div className="text-[10px] text-muted-foreground font-normal mt-0.5">{formatToman(m.cost)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">{t("imageGen.size")}</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-purple-400/40 focus:outline-none">
                {SIZES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">{t("imageGen.quality")}</label>
              <select value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-purple-400/40 focus:outline-none">
                {QUALITIES.map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-muted-foreground">{t("imageGen.cost")}:</span>
              <span className="font-bold text-foreground">{formatToman(cost)}</span>
            </div>
            <div className="text-xs text-muted-foreground">موجودی: {formatToman(user.creditBalance)}</div>
          </div>

          <GlowButton variant="primary" glow className="w-full !bg-gradient-to-br !from-purple-400 !to-pink-500" onClick={handleGenerate} disabled={generating}>
            {generating ? <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t("imageGen.generating")}</> : <><Sparkles className="h-4 w-4" /> {t("imageGen.generate")}</>}
          </GlowButton>
        </GlassCard>

        {/* History */}
        <GlassCard className="space-y-4">
          <h3 className="font-bold text-foreground">{t("imageGen.history")}</h3>
          {userImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">{t("imageGen.noHistory")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto scrollbar-thin">
              {userImages.map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden glass group relative">
                  { }
                  <img src={img.imageUrl} alt={img.prompt} className="w-full aspect-square object-cover" />
                  <div className="p-2">
                    <p className="text-xs text-foreground truncate">{img.prompt}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                      <span>{formatRelativeTime(img.createdAt)}</span>
                      <span>{formatToman(img.cost)}</span>
                    </div>
                  </div>
                  <a href={img.imageUrl} download className="absolute top-2 left-2 p-1.5 rounded-lg glass-strong opacity-0 group-hover:opacity-100 transition-opacity" title={t("imageGen.download")}>
                    <Download className="h-3.5 w-3.5 text-foreground" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export const imageGenModule: ModuleManifest = {
  id: "feature-image-gen", name: "ماژول تصویرساز", description: "تولید تصویر با هوش مصنوعی از متن — DALL-E 3 و Stable Diffusion.", version: "1.0.0", author: "Caspian AI Team", icon: "Wand2", type: "feature", isEnabled: true, isCore: false,
  config: { defaultModel: "dall-e-3", defaultSize: "1024x1024" },
  configSchema: [
    { key: "defaultModel", label: "مدل پیش‌فرض", type: "select", defaultValue: "dall-e-3", options: [{ label: "DALL-E 3", value: "dall-e-3" }, { label: "Stable Diffusion XL", value: "stable-diffusion-xl" }] },
  ],
  navItems: [{ id: "image-gen", labelKey: "nav.imageGen", label: "تصویرساز", icon: "Wand2", view: "image-gen", order: 70 }],
  onEnable: () => console.log("[ImageGen] enabled"),
  onDisable: () => console.log("[ImageGen] disabled"),
  handlers: { onMessageSent: () => {} },
};
