"use client";

import { useState } from "react";
import { Puzzle, Power, Settings2, CreditCard, Server, Lock, Shield, type LucideIcon } from "lucide-react";
import { useModuleRegistry, type SettingField } from "@/modules/registry";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, LucideIcon> = { core: Shield, payment: CreditCard, feature: Puzzle, landing: Puzzle, integration: Server, ai: Puzzle };
const TYPE_COLORS: Record<string, string> = { core: "#38BDF8", payment: "#34D399", feature: "#A855F7", landing: "#FBBF24", integration: "#818CF8", ai: "#EC4899" };
const TYPE_LABELS: Record<string, string> = { core: "هسته", payment: "پرداخت", feature: "امکانات", landing: "لندینگ", integration: "ادغام", ai: "هوش مصنوعی" };

export function ModulesAdminTab() {
  const { modules, moduleOrder, toggleModule, updateModuleConfig, resetModuleConfig, enableGateway, disableGateway, updateGatewayConfig } = useModuleRegistry();
  const [configTarget, setConfigTarget] = useState<string | null>(null);
  const [gatewayTarget, setGatewayTarget] = useState<string | null>(null);
  const allModules = moduleOrder.map((id) => modules[id]).filter(Boolean);
  const configMod = configTarget ? modules[configTarget] : null;

  return (
    <div className="space-y-6">
      <div><h3 className="font-bold text-foreground flex items-center gap-2"><Puzzle className="h-4 w-4 text-amber-400" /> مدیریت ماژول‌ها</h3><p className="text-xs text-muted-foreground mt-0.5">{allModules.length.toLocaleString("fa-IR")} ماژول نصب شده</p></div>
      <GlassCard className="flex items-start gap-3 !p-4 !bg-amber-400/5 !border-amber-400/15"><div className="h-9 w-9 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0"><Puzzle className="h-4 w-4 text-amber-400" /></div><div className="text-sm text-muted-foreground"><span className="text-foreground font-semibold">معماری ماژولار:</span> هر قابلیت یک ماژول مستقل است. فعال/غیرفعال کنید، تنظیمات را تغییر دهید — بدون تغییر کد.</div></GlassCard>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassCard className="!p-4 text-center"><div className="text-2xl font-black text-amber-300">{allModules.length.toLocaleString("fa-IR")}</div><div className="text-xs text-muted-foreground mt-1">کل ماژول‌ها</div></GlassCard>
        <GlassCard className="!p-4 text-center"><div className="text-2xl font-black text-emerald-400">{allModules.filter((m) => m.isEnabled).length.toLocaleString("fa-IR")}</div><div className="text-xs text-muted-foreground mt-1">فعال</div></GlassCard>
        <GlassCard className="!p-4 text-center"><div className="text-2xl font-black text-zinc-400">{allModules.filter((m) => !m.isEnabled).length.toLocaleString("fa-IR")}</div><div className="text-xs text-muted-foreground mt-1">غیرفعال</div></GlassCard>
        <GlassCard className="!p-4 text-center"><div className="text-2xl font-black text-sky-300">{allModules.reduce((a, m) => a + (m.paymentGateways?.length || 0), 0).toLocaleString("fa-IR")}</div><div className="text-xs text-muted-foreground mt-1">درگاه پرداخت</div></GlassCard>
      </div>
      <div className="space-y-4">
        {allModules.map((mod) => {
          const TypeIcon = TYPE_ICONS[mod.type] || Puzzle;
          const color = TYPE_COLORS[mod.type] || "#94A3B8";
          const hasConfig = mod.configSchema.length > 0;
          const hasGateways = (mod.paymentGateways?.length || 0) > 0;
          const enabledGateways = mod.paymentGateways?.filter((g) => g.isEnabled).length || 0;
          return (
            <GlassCard key={mod.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}22` }}><TypeIcon className="h-6 w-6" style={{ color }} strokeWidth={1.75} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-foreground">{mod.name}</h3><span className="text-[10px] px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: `${color}22`, color }}>{TYPE_LABELS[mod.type]}</span><span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground font-mono" dir="ltr">v{mod.version}</span>{mod.isCore && <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-400/15 text-sky-300 font-medium flex items-center gap-1"><Lock className="h-2.5 w-2.5" />هسته</span>}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">{mod.navItems && mod.navItems.length > 0 && <span>{mod.navItems.length.toLocaleString("fa-IR")} آیتم سایدبار</span>}{mod.adminTabs && mod.adminTabs.length > 0 && <span>{mod.adminTabs.length.toLocaleString("fa-IR")} تب ادمین</span>}{hasGateways && <span>{enabledGateways.toLocaleString("fa-IR")} از {mod.paymentGateways!.length.toLocaleString("fa-IR")} درگاه فعال</span>}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hasConfig && <button onClick={() => setConfigTarget(mod.id)} className="p-2 rounded-lg text-muted-foreground hover:text-amber-300 hover:bg-amber-400/10" title="تنظیمات"><Settings2 className="h-4 w-4" /></button>}
                  {hasGateways && <button onClick={() => setGatewayTarget(mod.id)} className="p-2 rounded-lg text-muted-foreground hover:text-emerald-300 hover:bg-emerald-400/10" title="درگاه‌ها"><CreditCard className="h-4 w-4" /></button>}
                  <button onClick={() => { if (mod.isCore) { toast.error("ماژول‌های هسته غیرقابل غیرفعال‌سازی هستند"); return; } toggleModule(mod.id); toast.success(mod.isEnabled ? "غیرفعال شد" : "فعال شد"); }} disabled={mod.isCore} className={cn("relative h-6 w-11 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed", mod.isEnabled ? "bg-emerald-400" : "bg-zinc-700")} title={mod.isEnabled ? "غیرفعال" : "فعال"}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", mod.isEnabled ? "right-0.5" : "right-5")} /></button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Config modal */}
      <Dialog open={!!configTarget} onOpenChange={(o) => !o && setConfigTarget(null)}>
        <DialogContent className="glass-strong border-amber-400/20 max-w-lg max-h-[90vh] overflow-y-auto">
          {configMod && (<><DialogHeader><DialogTitle className="text-foreground flex items-center gap-2"><Settings2 className="h-5 w-5 text-amber-400" /> تنظیمات {configMod.name}</DialogTitle><DialogDescription className="text-muted-foreground">تغییرات بلافاصله اعمال می‌شوند</DialogDescription></DialogHeader><div className="space-y-4 py-2">{configMod.configSchema.map((field) => <SettingFieldInput key={field.key} field={field} value={configMod.config[field.key]} onChange={(v) => updateModuleConfig(configMod.id, { [field.key]: v })} />)}</div><DialogFooter><GlowButton variant="ghost" onClick={() => { resetModuleConfig(configMod.id); toast.success("بازگردانی شد"); }}><RotateCcw className="h-4 w-4" /> بازگردانی</GlowButton><GlowButton variant="admin" glow onClick={() => setConfigTarget(null)}>بستن</GlowButton></DialogFooter></>)}
        </DialogContent>
      </Dialog>

      {/* Gateway modal */}
      <Dialog open={!!gatewayTarget} onOpenChange={(o) => !o && setGatewayTarget(null)}>
        <DialogContent className="glass-strong border-emerald-400/20 max-w-2xl max-h-[90vh] overflow-y-auto">
          {gatewayTarget && modules[gatewayTarget] && (<><DialogHeader><DialogTitle className="text-foreground flex items-center gap-2"><CreditCard className="h-5 w-5 text-emerald-400" /> درگاه‌های پرداخت</DialogTitle></DialogHeader><div className="space-y-4 py-2">{modules[gatewayTarget].paymentGateways!.map((gw) => (
            <GlassCard key={gw.id} className="space-y-4">
              <div className="flex items-start gap-3"><div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${gw.color}22` }}><CreditCard className="h-5 w-5" style={{ color: gw.color }} /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h4 className="font-bold text-foreground">{gw.name}</h4><span className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium", gw.isEnabled ? "bg-emerald-400/15 text-emerald-400" : "bg-zinc-400/15 text-zinc-400")}>{gw.isEnabled ? "فعال" : "غیرفعال"}</span></div><p className="text-xs text-muted-foreground mt-0.5">{gw.description}</p></div><button onClick={() => { if (gw.isEnabled) { disableGateway(gw.id); toast.success("غیرفعال شد"); } else { enableGateway(gw.id); toast.success("فعال شد"); } }} className={cn("relative h-6 w-11 rounded-full transition-colors", gw.isEnabled ? "bg-emerald-400" : "bg-zinc-700")}><span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", gw.isEnabled ? "right-0.5" : "right-5")} /></button></div>
              {gw.isEnabled && gw.configSchema.length > 0 && <div className="space-y-3 pt-3 border-t border-white/5">{gw.configSchema.map((field) => <SettingFieldInput key={field.key} field={field} value={gw.config[field.key]} onChange={(v) => updateGatewayConfig(gw.id, { [field.key]: v })} />)}</div>}
            </GlassCard>
          ))}</div><DialogFooter><GlowButton variant="ghost" onClick={() => setGatewayTarget(null)}>بستن</GlowButton></DialogFooter></>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingFieldInput({ field, value, onChange }: { field: SettingField; value: string | number | boolean; onChange: (v: string | number | boolean) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">{field.label}{field.required && <span className="text-red-400">*</span>}</label>
      {field.type === "boolean" ? <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="rounded accent-amber-500 h-4 w-4" />{field.description}</label>
      : field.type === "select" ? <select value={String(value)} onChange={(e) => onChange(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none">{field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      : field.type === "textarea" ? <textarea value={String(value)} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} rows={3} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none resize-none" />
      : <input type={field.type === "password" ? "password" : field.type === "number" ? "number" : "text"} value={String(value)} onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)} placeholder={field.placeholder} dir={field.type === "password" || field.type === "text" ? "ltr" : "rtl"} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none font-mono" />}
      {field.description && field.type !== "boolean" && <p className="text-[11px] text-muted-foreground">{field.description}</p>}
    </div>
  );
}

import { RotateCcw } from "lucide-react";
