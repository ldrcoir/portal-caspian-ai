"use client";

import { useState } from "react";
import { Plug, Plus, Trash2, Power, AlertCircle, Eye, EyeOff, ExternalLink, Server, KeyRound } from "lucide-react";
import { useAppStore, PROVIDERS, ProviderType, formatRelativeTime } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProviderKeysView() {
  const { providerKeys, createProviderKey, updateProviderKey, toggleProviderKey, deleteProviderKey, models } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: "", provider: "openrouter" as ProviderType, apiKey: "", baseUrl: "", isEnabled: true });

  const handleSave = () => {
    if (!form.name.trim() || !form.apiKey.trim()) { toast.error("نام و کلید الزامی است"); return; }
    const info = PROVIDERS.find((p) => p.type === form.provider)!;
    if (editTarget) { updateProviderKey(editTarget, { name: form.name, provider: form.provider, apiKey: form.apiKey, baseUrl: form.baseUrl || info.defaultBaseUrl, isEnabled: form.isEnabled }); toast.success("به‌روزرسانی شد"); }
    else { createProviderKey({ name: form.name, provider: form.provider, apiKey: form.apiKey, baseUrl: form.baseUrl || info.defaultBaseUrl, isEnabled: form.isEnabled }); toast.success("کلید اضافه شد"); }
    setShowCreate(false); setEditTarget(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-2xl sm:text-3xl font-black text-foreground">کلیدهای <span className="text-gradient-sky">پروایدر</span></h1><p className="text-sm text-muted-foreground mt-1">کلیدهای API پروایدرهای هوش مصنوعی</p></div>
        <GlowButton variant="primary" glow onClick={() => { setForm({ name: "", provider: "openrouter", apiKey: "", baseUrl: PROVIDERS[0].defaultBaseUrl, isEnabled: true }); setEditTarget(null); setShowCreate(true); }}><Plus className="h-4 w-4" strokeWidth={2.5} /> افزودن کلید</GlowButton>
      </div>
      <GlassCard className="flex items-start gap-3 !p-4"><div className="h-9 w-9 rounded-xl bg-sky-400/15 flex items-center justify-center shrink-0"><AlertCircle className="h-4 w-4 text-sky-400" /></div><div className="text-sm text-muted-foreground"><span className="text-foreground font-semibold">چرا کلید پروایدر؟</span> کلیدهای پروایدر به کاسپین اجازه می‌دهند به API مدل‌های هوش مصنوعی متصل شود. می‌توانید چندین کلید اضافه کنید و برای هر مدل/عامل مشخص کنید از کدام استفاده شود.</div></GlassCard>
      {providerKeys.length === 0 ? (
        <GlassCard className="text-center py-12"><Plug className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" /><h3 className="font-bold text-foreground mb-1">هیچ کلیدی اضافه نشده</h3><p className="text-sm text-muted-foreground mb-4">برای شروع، یک کلید پروایدر اضافه کنید</p><GlowButton variant="primary" glow onClick={() => setShowCreate(true)}><Plus className="h-4 w-4" /> افزودن اولین کلید</GlowButton></GlassCard>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {providerKeys.map((pk) => {
            const info = PROVIDERS.find((p) => p.type === pk.provider)!;
            const modelsUsing = models.filter((m) => m.provider === pk.provider).length;
            return (
              <GlassCard key={pk.id} hover className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${info.color}22` }}><Server className="h-6 w-6" style={{ color: info.color }} strokeWidth={1.75} /></div>
                  <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h3 className="font-bold text-foreground truncate">{pk.name}</h3><span className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium", pk.isEnabled ? "bg-emerald-400/15 text-emerald-400" : "bg-zinc-400/15 text-zinc-400")}>{pk.isEnabled ? "فعال" : "غیرفعال"}</span></div><div className="text-xs text-muted-foreground mt-0.5">{info.label} • {modelsUsing.toLocaleString("fa-IR")} مدل</div></div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">کلید API:</span><button onClick={() => setShowSecret({ ...showSecret, [pk.id]: !showSecret[pk.id] })} className="text-sky-300 hover:text-sky-200 flex items-center gap-1">{showSecret[pk.id] ? <><EyeOff className="h-3 w-3" /> مخفی</> : <><Eye className="h-3 w-3" /> نمایش</>}</button></div>
                  <div className="rounded-lg bg-[#0A0F1E] border border-white/5 p-2.5 font-mono text-xs text-muted-foreground break-all" dir="ltr">{showSecret[pk.id] ? pk.apiKey : `${pk.apiKey.slice(0, 8)}${"•".repeat(24)}`}</div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5"><div className="text-[11px] text-muted-foreground">{pk.lastUsedAt ? `آخرین استفاده: ${formatRelativeTime(pk.lastUsedAt)}` : "هرگز استفاده نشده"}</div>
                  <div className="flex items-center gap-1"><button onClick={() => { const k = providerKeys.find((x) => x.id === pk.id); if (k) { setForm({ name: k.name, provider: k.provider, apiKey: k.apiKey, baseUrl: k.baseUrl || "", isEnabled: k.isEnabled }); setEditTarget(pk.id); setShowCreate(true); } }} className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-300 hover:bg-sky-400/10 transition-colors text-xs">ویرایش</button><button onClick={() => toggleProviderKey(pk.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-300 hover:bg-amber-400/10 transition-colors"><Power className="h-4 w-4" /></button><button onClick={() => setDeleteTarget(pk.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 className="h-4 w-4" /></button></div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="glass-strong border-sky-400/20 max-w-lg">
          <DialogHeader><DialogTitle className="text-foreground flex items-center gap-2"><Plug className="h-5 w-5 text-sky-400" /> {editTarget ? "ویرایش کلید" : "افزودن کلید پروایدر"}</DialogTitle><DialogDescription className="text-muted-foreground">کلید API را از پنل پروایدر دریافت کنید.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><label className="text-xs font-medium text-muted-foreground">نام</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: OpenRouter اصلی" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm" /></div>
            <div className="space-y-2"><label className="text-xs font-medium text-muted-foreground">پروایدر</label><div className="grid grid-cols-3 gap-2">{PROVIDERS.map((p) => <button key={p.type} onClick={() => setForm({ ...form, provider: p.type, baseUrl: p.defaultBaseUrl })} className={cn("p-2.5 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5", form.provider === p.type ? "bg-sky-400/15 border-sky-400/40 text-sky-300" : "bg-white/5 border-white/10 text-foreground hover:border-sky-400/30")}><Server className="h-4 w-4" style={{ color: form.provider === p.type ? "#38BDF8" : p.color }} />{p.label}</button>)}</div></div>
            <div className="space-y-2"><label className="text-xs font-medium text-muted-foreground">کلید API</label><input type="password" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} placeholder="sk-..." dir="ltr" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right font-mono" /></div>
            <div className="space-y-2"><label className="text-xs font-medium text-muted-foreground">Base URL (اختیاری)</label><input value={form.baseUrl} onChange={(e) => setForm({ ...form, baseUrl: e.target.value })} placeholder="https://..." dir="ltr" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right font-mono" /></div>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer"><input type="checkbox" checked={form.isEnabled} onChange={(e) => setForm({ ...form, isEnabled: e.target.checked })} className="rounded accent-sky-500 h-4 w-4" /> فعال</label>
          </div>
          <DialogFooter><GlowButton variant="ghost" onClick={() => { setShowCreate(false); setEditTarget(null); }}>انصراف</GlowButton><GlowButton variant="primary" glow onClick={handleSave}>{editTarget ? "ذخیره" : "افزودن"}</GlowButton></DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="glass-strong border-red-400/20"><AlertDialogHeader><AlertDialogTitle className="text-foreground">حذف کلید؟</AlertDialogTitle><AlertDialogDescription className="text-muted-foreground">این عملیات غیرقابل بازگشت است.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="bg-white/5 border-white/10 text-foreground hover:bg-white/10">انصراف</AlertDialogCancel><AlertDialogAction className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-400/30" onClick={() => { if (deleteTarget) { deleteProviderKey(deleteTarget); toast.success("حذف شد"); setDeleteTarget(null); } }}>بله، حذف کن</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
