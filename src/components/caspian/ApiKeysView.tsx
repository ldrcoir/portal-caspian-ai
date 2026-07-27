"use client";

import { useState } from "react";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
  Power,
  Zap,
} from "lucide-react";
import {
  useAppStore,
  formatRelativeTime,
  formatDate,
  ApiKey,
} from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function ApiKeysView() {
  const { apiKeys, createApiKey, toggleApiKey, deleteApiKey, user } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreated, setNewlyCreated] = useState<ApiKey | null>(null);
  const [showFullKey, setShowFullKey] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    if (!newKeyName.trim()) {
      toast.error("لطفاً نام کلید را وارد کنید");
      return;
    }
    const key = createApiKey(newKeyName.trim());
    setNewlyCreated(key);
    setNewKeyName("");
    setShowFullKey(true);
    toast.success("کلید API ساخته شد");
  };

  const handleCopyKey = () => {
    if (newlyCreated?.fullKey) {
      navigator.clipboard.writeText(newlyCreated.fullKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("کلید کپی شد");
    }
  };

  const handleCloseNew = () => {
    setShowCreate(false);
    setNewlyCreated(null);
    setNewKeyName("");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            کلیدهای <span className="text-gradient-sky">API</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            کلیدهای API برای دسترسی برنامه‌نویسی به پلتفرم کاسپین
          </p>
        </div>
        <GlowButton
          variant="primary"
          glow
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          ساخت کلید جدید
        </GlowButton>
      </div>

      {/* Info banner */}
      <GlassCard className="flex items-start gap-3 !p-4">
        <div className="h-9 w-9 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0">
          <AlertCircle className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">نکته مهم:</span> کلیدهای
          API فقط یک بار هنگام ساخت نمایش داده می‌شوند. حتماً آن را در جای امنی
          ذخیره کنید. در صورت گم شدن، باید کلید را حذف و کلید جدید بسازید.
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="text-center !p-4">
          <div className="text-2xl font-black text-gradient-sky">
            {apiKeys.length.toLocaleString("fa-IR")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">کل کلیدها</div>
        </GlassCard>
        <GlassCard className="text-center !p-4">
          <div className="text-2xl font-black text-emerald-400">
            {apiKeys.filter((k) => k.isEnabled).length.toLocaleString("fa-IR")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">فعال</div>
        </GlassCard>
        <GlassCard className="text-center !p-4">
          <div className="text-2xl font-black text-amber-400">
            {apiKeys.filter((k) => !k.isEnabled).length.toLocaleString("fa-IR")}
          </div>
          <div className="text-xs text-muted-foreground mt-1">غیرفعال</div>
        </GlassCard>
      </div>

      {/* Keys table */}
      <GlassCard className="!p-0 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">نام</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">کلید</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">وضعیت</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">آخرین استفاده</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">تاریخ ساخت</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr
                  key={key.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-sky-400/15 flex items-center justify-center">
                        <KeyRound className="h-3.5 w-3.5 text-sky-400" />
                      </div>
                      <span className="font-medium text-sm text-foreground">{key.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs text-muted-foreground font-mono" dir="ltr">
                      {key.prefix}••••••••••••••••••
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${
                        key.isEnabled
                          ? "bg-emerald-400/15 text-emerald-400"
                          : "bg-zinc-400/15 text-zinc-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          key.isEnabled ? "bg-emerald-400" : "bg-zinc-400"
                        }`}
                      />
                      {key.isEnabled ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {key.lastUsedAt ? formatRelativeTime(key.lastUsedAt) : "هرگز"}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {formatDate(key.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          toggleApiKey(key.id);
                          toast.success(key.isEnabled ? "کلید غیرفعال شد" : "کلید فعال شد");
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-300 hover:bg-sky-400/10 transition-colors"
                        title={key.isEnabled ? "غیرفعال کردن" : "فعال کردن"}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(key)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-sky-400/15 flex items-center justify-center">
                    <KeyRound className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{key.name}</div>
                    <code className="text-[10px] text-muted-foreground font-mono" dir="ltr">
                      {key.prefix}••••
                    </code>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium ${
                    key.isEnabled
                      ? "bg-emerald-400/15 text-emerald-400"
                      : "bg-zinc-400/15 text-zinc-400"
                  }`}
                >
                  {key.isEnabled ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>آخرین استفاده: {key.lastUsedAt ? formatRelativeTime(key.lastUsedAt) : "هرگز"}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleApiKey(key.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-300 hover:bg-sky-400/10"
                  >
                    <Power className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(key)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Quickstart */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="font-bold text-foreground">شروع سریع</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          کاسپین AI کاملاً با OpenAI API سازگار است. فقط کافی است URL پایه را
          تغییر دهید و کلید خود را در هدر قرار دهید:
        </p>
        <div className="rounded-xl bg-[#0A0F1E] border border-white/5 p-4 font-mono text-xs leading-relaxed overflow-x-auto" dir="ltr">
          <div className="text-muted-foreground"># نصب</div>
          <div className="text-sky-300">pip install openai</div>
          <div className="mt-3 text-muted-foreground"># استفاده</div>
          <div className="text-emerald-400">from<span className="text-foreground"> openai </span>import<span className="text-foreground"> OpenAI</span></div>
          <div className="mt-1">
            <span className="text-foreground">client = </span>
            <span className="text-emerald-400">OpenAI</span>
            <span className="text-foreground">(</span>
          </div>
          <div className="text-foreground">    base_url=<span className="text-amber-300">"https://api.caspian.ai/v1"</span>,</div>
          <div className="text-foreground">    api_key=<span className="text-amber-300">"csk-your-key-here"</span></div>
          <div className="text-foreground">)</div>
        </div>
      </GlassCard>

      {/* Create modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="glass-strong border-sky-400/20 max-w-md">
          {!newlyCreated ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">ساخت کلید API جدید</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  یک نام توصیفی برای کلید انتخاب کنید تا بعداً راحت پیدایش کنید.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <label className="text-xs font-medium text-muted-foreground">نام کلید</label>
                <input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="مثلاً: اپ پروداکشن، ربات تلگرام..."
                  autoFocus
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <DialogFooter>
                <GlowButton variant="ghost" onClick={handleCloseNew}>
                  انصراف
                </GlowButton>
                <GlowButton variant="primary" glow onClick={handleCreate}>
                  ساخت کلید
                </GlowButton>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center gap-2">
                  <Check className="h-5 w-5 text-emerald-400" />
                  کلید ساخته شد!
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  این کلید فقط یک بار نمایش داده می‌شود. همین حالا کپی و در جای
                  امن ذخیره کنید.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="relative">
                  <div className="rounded-xl bg-[#0A0F1E] border border-sky-400/20 p-4 font-mono text-sm text-sky-300 break-all" dir="ltr">
                    {showFullKey
                      ? newlyCreated.fullKey
                      : `${newlyCreated.prefix}${"•".repeat(32)}`}
                  </div>
                  <button
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
                  >
                    {showFullKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <GlowButton
                  variant="primary"
                  glow
                  className="w-full"
                  onClick={handleCopyKey}
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "کپی شد!" : "کپی کلید"}
                </GlowButton>
              </div>
              <DialogFooter>
                <GlowButton variant="ghost" onClick={handleCloseNew}>
                  بستن
                </GlowButton>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="glass-strong border-red-400/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">حذف کلید API؟</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              آیا از حذف کلید «{deleteTarget?.name}» مطمئن هستید؟ این عملیات
              غیرقابل بازگشت است و تمام اپلیکیشن‌هایی که از این کلید استفاده
              می‌کنند، قطع خواهند شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-foreground hover:bg-white/10">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-400/30"
              onClick={() => {
                if (deleteTarget) {
                  deleteApiKey(deleteTarget.id);
                  toast.success("کلید حذف شد");
                  setDeleteTarget(null);
                }
              }}
            >
              بله، حذف کن
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
