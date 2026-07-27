"use client";

import { useState } from "react";
import {
  Database,
  User,
  CreditCard,
  Bot,
  Check,
  ArrowLeft,
  ArrowRight,
  Server,
  ShieldCheck,
  Loader2,
  Lock,
  Terminal,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Logo } from "@/components/caspian/Logo";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = [
  { id: 0, label: "پیش‌نیازها", icon: Server },
  { id: 1, label: "پایگاه داده", icon: Database },
  { id: 2, label: "حساب ادمین", icon: User },
  { id: 3, label: "درگاه پرداخت", icon: CreditCard },
  { id: 4, label: "هوش مصنوعی", icon: Bot },
  { id: 5, label: "نصب نهایی", icon: ShieldCheck },
];

export function InstallView() {
  const { markInstalled, setView, isInstalled } = useAppStore();
  const [step, setStep] = useState(0);
  const [installing, setInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installLog, setInstallLog] = useState<string[]>([]);
  const [installed, setInstalled] = useState(isInstalled);

  const [form, setForm] = useState({
    dbHost: "localhost",
    dbPort: "5432",
    dbName: "caspian_ai",
    dbUser: "postgres",
    dbPassword: "",
    adminEmail: "admin@caspian.ai",
    adminPassword: "",
    adminFullName: "",
    siteName: "کاسپین AI",
    nextpayApiKey: "",
    openrouterApiKey: "",
  });

  const handleInstall = async () => {
    setInstalling(true);
    setInstallLog([]);
    setInstallProgress(0);

    const steps = [
      "بررسی پیش‌نیازها (Python 3.11+, PostgreSQL, Redis)...",
      "اتصال به پایگاه داده PostgreSQL...",
      "اجرای Alembic migrations برای ساخت جداول...",
      "ایجاد کاربر ادمین پیش‌فرض...",
      "درج مدل‌های پیش‌فرض (GPT-5.6, Claude Sonnet 5, Gemini 2.5 Pro, DeepSeek V3, Llama 3.3 70B)...",
      "ایجاد عامل‌های آماده (وکیل‌یار، کدیار، محتوایار، ترجمه‌یار)...",
      "فعال‌سازی درگاه پرداخت نکست‌پی...",
      "تنظیمات امنیتی (JWT Secret, CORS, Rate Limiting)...",
      "ایجاد فایل installed.lock و قفل کردن صفحه نصب...",
      "نصب با موفقیت کامل شد! 🎉",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600));
      setInstallLog((prev) => [...prev, steps[i]]);
      setInstallProgress(((i + 1) / steps.length) * 100);
    }

    setTimeout(() => {
      setInstalling(false);
      setInstalled(true);
      markInstalled();
      toast.success("نصب با موفقیت کامل شد!");
    }, 500);
  };

  if (installed && !installing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard variant="strong" glow className="max-w-lg w-full text-center space-y-6 p-8">
          <div className="mx-auto h-20 w-20 rounded-3xl bg-emerald-400/15 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground">نصب کامل شد!</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              پلتفرم کاسپین AI با موفقیت نصب شد. اکنون می‌توانید با حساب ادمین که
              ایجاد کردید وارد شوید.
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-right space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">نام سایت:</span>
              <span className="font-medium text-foreground">{form.siteName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">ایمیل ادمین:</span>
              <code className="font-mono text-sky-300" dir="ltr">{form.adminEmail}</code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">درگاه فعال:</span>
              <span className="font-medium text-foreground">نکست‌پی</span>
            </div>
          </div>
          <GlowButton
            variant="primary"
            glow
            size="lg"
            className="w-full"
            onClick={() => setView("auth")}
          >
            <ArrowLeft className="h-4 w-4" />
            ورود به پنل مدیریت
          </GlowButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setView("landing")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به خانه
          </button>
          <Logo size={36} />
        </div>

        {/* Hero */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-medium">
            <Terminal className="h-3.5 w-3.5" />
            نصب خودکار پلتفرم
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            راه‌اندازی <span className="text-gradient-sky">کاسپین AI</span> در ۶ گام
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            مانند وردپرس، فقط اطلاعات پایه را وارد کنید و دکمه نصب را بزنید.
            ما بقی کارها با ما — از ساخت جداول تا تنظیم درگاه پرداخت.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 min-w-max px-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <div key={s.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl transition-all",
                      active && "glass-strong glow-primary-sm",
                      done && "opacity-60"
                    )}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                        done
                          ? "bg-emerald-400/20 text-emerald-400"
                          : active
                          ? "bg-sky-400/20 text-sky-300"
                          : "bg-white/5 text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        active ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-px w-4 bg-white/10 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <GlassCard variant="strong" className="space-y-6">
          {/* Step 0: Prerequisites */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">بررسی پیش‌نیازها</h2>
                <p className="text-sm text-muted-foreground">
                  اطمینان از نصب نرم‌افزارهای مورد نیاز روی سرور
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Python 3.11+", status: "ok", version: "3.11.7" },
                  { name: "PostgreSQL 15+", status: "ok", version: "15.4" },
                  { name: "Redis 7+", status: "ok", version: "7.2" },
                  { name: "Node.js 20+ (اختیاری)", status: "ok", version: "20.10" },
                  { name: "Docker & Docker Compose", status: "ok", version: "24.0" },
                ].map((req) => (
                  <div
                    key={req.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-400" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{req.name}</div>
                        <div className="text-xs text-muted-foreground">نسخه: {req.version}</div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-emerald-400/15 text-emerald-400 font-medium">
                      نصب شده
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Database */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">اطلاعات پایگاه داده</h2>
                <p className="text-sm text-muted-foreground">
                  اطلاعات اتصال به PostgreSQL را وارد کنید
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="میزبان (Host)">
                  <input
                    value={form.dbHost}
                    onChange={(e) => setForm({ ...form, dbHost: e.target.value })}
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
                <Field label="پورت">
                  <input
                    value={form.dbPort}
                    onChange={(e) => setForm({ ...form, dbPort: e.target.value })}
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
                <Field label="نام دیتابیس">
                  <input
                    value={form.dbName}
                    onChange={(e) => setForm({ ...form, dbName: e.target.value })}
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
                <Field label="نام کاربری">
                  <input
                    value={form.dbUser}
                    onChange={(e) => setForm({ ...form, dbUser: e.target.value })}
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
                <Field label="رمز عبور" full>
                  <input
                    type="password"
                    value={form.dbPassword}
                    onChange={(e) => setForm({ ...form, dbPassword: e.target.value })}
                    placeholder="••••••••"
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
              </div>
              <div className="rounded-xl bg-sky-400/5 border border-sky-400/15 p-3 text-xs text-muted-foreground flex items-start gap-2">
                <Lock className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  این اطلاعات فقط برای ایجاد اتصال استفاده می‌شود و در فایل{" "}
                  <code className="text-sky-300" dir="ltr">.env</code> ذخیره می‌شود.
                  هیچ‌گاه در لاگ‌ها ثبت نمی‌شود.
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Admin */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">حساب ادمین</h2>
                <p className="text-sm text-muted-foreground">
                  حساب مدیریت اصلی پلتفرم را ایجاد کنید
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="نام سایت">
                  <input
                    value={form.siteName}
                    onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                    className="install-input"
                  />
                </Field>
                <Field label="نام و نام خانوادگی ادمین">
                  <input
                    value={form.adminFullName}
                    onChange={(e) => setForm({ ...form, adminFullName: e.target.value })}
                    placeholder="مثلاً: مدیر کل"
                    className="install-input"
                  />
                </Field>
                <Field label="ایمیل ادمین">
                  <input
                    type="email"
                    value={form.adminEmail}
                    onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
                <Field label="رمز عبور ادمین">
                  <input
                    type="password"
                    value={form.adminPassword}
                    onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                    placeholder="حداقل ۸ کاراکتر"
                    dir="ltr"
                    className="install-input"
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">درگاه پرداخت</h2>
                <p className="text-sm text-muted-foreground">
                  تنظیمات درگاه پرداخت پیش‌فرض: نکست‌پی
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-sky-500/10 to-indigo-500/5 border border-sky-400/20 p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-sky-400/15 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-sky-400" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-bold text-foreground flex items-center gap-2">
                    نکست‌پی (NextPay)
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-400/15 text-emerald-400 font-medium">
                      پیش‌فرض
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    درگاه پرداخت امن و رایج ایرانی
                  </div>
                </div>
              </div>
              <Field label="کلید API نکست‌پی" full>
                <input
                  value={form.nextpayApiKey}
                  onChange={(e) => setForm({ ...form, nextpayApiKey: e.target.value })}
                  placeholder="nextpay_api_key..."
                  dir="ltr"
                  className="install-input"
                />
              </Field>
              <div className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-3 text-xs text-muted-foreground flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  کاسپین AI از معماری ماژولار استفاده می‌کند. برای افزودن درگاه
                  جدید (زرین‌پال، آیدی‌پی و...) فقط کافی است یک فایل جدید در{" "}
                  <code className="text-amber-300" dir="ltr">modules/payment/</code>{" "}
                  بسازید — بدون دست زدن به کدهای دیگر.
                </span>
              </div>
            </div>
          )}

          {/* Step 4: AI */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">تنظیمات هوش مصنوعی</h2>
                <p className="text-sm text-muted-foreground">
                  کلید OpenRouter برای دسترسی به مدل‌های جهانی
                </p>
              </div>
              <Field label="کلید API OpenRouter" full>
                <input
                  value={form.openrouterApiKey}
                  onChange={(e) => setForm({ ...form, openrouterApiKey: e.target.value })}
                  placeholder="sk-or-v1-..."
                  dir="ltr"
                  className="install-input"
                />
              </Field>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                <div className="text-sm font-semibold text-foreground mb-2">مدل‌های پیش‌فرض فعال:</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {["GPT-5.6", "Claude Sonnet 5", "Gemini 2.5 Pro", "DeepSeek V3", "Llama 3.3 70B", "Qwen 2.5 72B"].map((m) => (
                    <div key={m} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      {m}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4">
                <div className="text-sm font-semibold text-foreground mb-2">عامل‌های آماده:</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    { name: "وکیل‌یار", desc: "دستیار حقوقی" },
                    { name: "کدیار", desc: "برنامه‌نویس" },
                    { name: "محتوایار", desc: "تولید محتوا" },
                    { name: "ترجمه‌یار", desc: "مترجم" },
                  ].map((a) => (
                    <div key={a.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bot className="h-3.5 w-3.5 text-sky-400" />
                      <span className="text-foreground font-medium">{a.name}</span>
                      <span>— {a.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Final */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">آماده نصب</h2>
                <p className="text-sm text-muted-foreground">
                  با زدن دکمه نصب، تمام جداول ساخته و داده‌های اولیه درج می‌شوند
                </p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-2 text-sm">
                <div className="font-semibold text-foreground mb-2">خلاصه تنظیمات:</div>
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <SummaryRow label="نام سایت" value={form.siteName} />
                  <SummaryRow label="پایگاه داده" value={`${form.dbHost}:${form.dbPort}/${form.dbName}`} ltr />
                  <SummaryRow label="ایمیل ادمین" value={form.adminEmail} ltr />
                  <SummaryRow label="درگاه پرداخت" value="نکست‌پی" />
                  <SummaryRow label="OpenRouter" value={form.openrouterApiKey ? "تنظیم شده" : "نامشخص"} />
                  <SummaryRow label="مدل‌ها" value="۶ مدل پیش‌فرض" />
                  <SummaryRow label="عامل‌ها" value="۴ عامل آماده" />
                </div>
              </div>

              {installing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">پیشرفت نصب</span>
                    <span className="font-bold text-sky-300">{installProgress.toLocaleString("fa-IR")}٪</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300"
                      style={{ width: `${installProgress}%` }}
                    />
                  </div>
                  <div className="rounded-xl bg-[#0A0F1E] border border-white/5 p-4 font-mono text-xs space-y-1 max-h-48 overflow-y-auto scrollbar-thin" dir="ltr">
                    {installLog.map((line, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{line}</span>
                      </div>
                    ))}
                    {installing && installLog.length < 10 && (
                      <div className="flex items-center gap-2 text-sky-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>در حال اجرا...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          {!installing && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <GlowButton
                variant="ghost"
                onClick={() => (step === 0 ? setView("landing") : setStep(step - 1))}
                disabled={installing}
              >
                <ArrowRight className="h-4 w-4" />
                {step === 0 ? "انصراف" : "قبلی"}
              </GlowButton>

              {step < STEPS.length - 1 ? (
                <GlowButton
                  variant="primary"
                  glow
                  onClick={() => setStep(step + 1)}
                >
                  بعدی
                  <ArrowLeft className="h-4 w-4" />
                </GlowButton>
              ) : (
                <GlowButton
                  variant="primary"
                  glow
                  size="lg"
                  onClick={handleInstall}
                >
                  <ShieldCheck className="h-4 w-4" />
                  شروع نصب
                </GlowButton>
              )}
            </div>
          )}
        </GlassCard>

        {/* Docker hint */}
        <div className="mt-6 rounded-xl bg-white/5 border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="h-4 w-4 text-sky-400" />
            <span className="text-sm font-semibold text-foreground">نصب با Docker (پیشنهادی)</span>
          </div>
          <div className="rounded-lg bg-[#0A0F1E] p-3 font-mono text-xs flex items-center justify-between" dir="ltr">
            <code className="text-emerald-400">$ docker-compose up --build</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText("docker-compose up --build");
                toast.success("کپی شد");
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            پس از اجرا، صفحه نصب خودکار روی{" "}
            <code className="text-sky-300" dir="ltr">http://localhost:8000/install</code>{" "}
            در دسترس خواهد بود.
          </p>
        </div>
      </div>

      <style jsx>{`
        :global(.install-input) {
          width: 100%;
          height: 2.75rem;
          padding: 0 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.install-input:focus) {
          border-color: rgba(56, 189, 248, 0.5);
        }
        :global(.install-input::placeholder) {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("space-y-2", full && "sm:col-span-2")}>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground" dir={ltr ? "ltr" : "rtl"}>
        {value}
      </span>
    </div>
  );
}
