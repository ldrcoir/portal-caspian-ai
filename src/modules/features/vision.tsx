"use client";

import { useState, useRef } from "react";
import { Eye, Upload, ImageIcon, Send, Coins, Trash2 } from "lucide-react";
import { useAppStore, formatToman, formatRelativeTime } from "@/store/app-store";
import { useT } from "@/i18n";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";
import type { ModuleManifest } from "../registry";

const VISION_COST = 2000;

export function VisionView() {
  const { user, visionAnalyses, addVisionAnalysis } = useAppStore();
  const t = useT();
  const [imageData, setImageData] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const userAnalyses = visionAnalyses.filter((a) => a.userId === user.id);

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { toast.error(t("vision.maxSize")); return; }
    if (!file.type.startsWith("image/")) { toast.error("فایل تصویر باشد"); return; }
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!imageData) { toast.error(t("vision.noImage")); return; }
    if (!question.trim()) { toast.error("سوال الزامی است"); return; }
    if (user.creditBalance < VISION_COST) { toast.error("موجودی کافی نیست"); return; }

    setAnalyzing(true);
    setTimeout(() => {
      const answer = `بر اساس تحلیل تصویر: این تصویر شامل عناصر بصری قابل تشخیص است. پاسخ به سوال «${question}»: تصویر یک صحنه عمومی را نشان می‌دهد که توسط مدل بینایی تحلیل شده است. در محیط واقعی، این پاسخ از طریق مدل بینایی (مثل GPT-4 Vision یا Claude Vision) تولید می‌شود.`;
      addVisionAnalysis({ userId: user.id, imageData, question: question.trim(), modelId: "gpt-5.6", answer, cost: VISION_COST });
      setAnalyzing(false);
      toast.success("تحلیل کامل شد");
    }, 2000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
          <Eye className="h-7 w-7 text-emerald-400" />
          {t("vision.title")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t("vision.subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          {/* Upload area */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("vision.upload")}</label>
            {imageData ? (
              <div className="relative rounded-xl overflow-hidden glass">
                { }
                <img src={imageData} alt="uploaded" className="w-full max-h-64 object-contain" />
                <button onClick={() => setImageData("")} className="absolute top-2 left-2 p-2 rounded-lg glass-strong text-red-400 hover:bg-red-400/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} className="w-full p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-emerald-400/40 transition-colors flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="h-8 w-8" />
                <span className="text-sm">{t("vision.uploadHint")}</span>
                <span className="text-xs">{t("vision.supportedFormats")} • {t("vision.maxSize")}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("vision.askQuestion")}</label>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t("vision.askPlaceholder")} className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-400/50 focus:outline-none text-sm" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-muted-foreground">{t("common.cost")}:</span>
              <span className="font-bold text-foreground">{formatToman(VISION_COST)}</span>
            </div>
            <div className="text-xs text-muted-foreground">موجودی: {formatToman(user.creditBalance)}</div>
          </div>

          <GlowButton variant="primary" glow className="w-full !bg-gradient-to-br !from-emerald-400 !to-teal-500" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t("vision.analyzing")}</> : <><Eye className="h-4 w-4" /> {t("vision.analyze")}</>}
          </GlowButton>
        </GlassCard>

        {/* History */}
        <GlassCard className="space-y-4">
          <h3 className="font-bold text-foreground">{t("vision.result")}</h3>
          {userAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">هنوز تحلیلی انجام نشده</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {userAnalyses.map((a) => (
                <div key={a.id} className="rounded-xl glass p-3 space-y-2">
                  <div className="flex gap-3">
                    { }
                    <img src={a.imageData} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">{a.question}</div>
                      <div className="text-[10px] text-muted-foreground">{formatRelativeTime(a.createdAt)} • {formatToman(a.cost)}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{a.answer}</p>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export const visionModule: ModuleManifest = {
  id: "feature-vision", name: "ماژول تحلیل تصویر", description: "آپلود تصویر و پرسش سوال درباره آن با مدل‌های بینایی.", version: "1.0.0", author: "Caspian AI Team", icon: "Eye", type: "feature", isEnabled: true, isCore: false,
  config: { costPerAnalysis: 2000, maxImageSize: 10 },
  configSchema: [
    { key: "costPerAnalysis", label: "هزینه هر تحلیل (تومان)", type: "number", defaultValue: 2000 },
    { key: "maxImageSize", label: "حداکثر حجم تصویر (MB)", type: "number", defaultValue: 10 },
  ],
  navItems: [{ id: "vision", labelKey: "nav.vision", label: "تحلیل تصویر", icon: "Eye", view: "vision", order: 80 }],
  onEnable: () => console.log("[Vision] enabled"),
  onDisable: () => console.log("[Vision] disabled"),
};
