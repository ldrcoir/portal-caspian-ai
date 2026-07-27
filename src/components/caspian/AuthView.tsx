"use client";

import { useState } from "react";
import { ArrowRight, Mail, Lock, User, Phone, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { Logo } from "@/components/caspian/Logo";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";

export function AuthView() {
  const { login, register, setView } = useAppStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    mobile: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("لطفاً ایمیل و رمز عبور را وارد کنید");
      return;
    }
    if (mode === "register" && (!form.fullName || !form.mobile)) {
      toast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (mode === "login") {
      login(form.email, form.password);
      toast.success("خوش آمدید!");
    } else {
      register(form);
      toast.success("ثبت‌نام موفق! ۲۰٬۰۰۰ تومان اعتبار هدیه دریافت کردید.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <button
          onClick={() => setView("landing")}
          className="mb-6 mx-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به خانه
        </button>

        <GlassCard variant="strong" glow className="space-y-6 p-7">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size={48} showText={false} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">
                {mode === "login" ? "ورود به حساب" : "ساخت حساب جدید"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "login"
                  ? "برای ادامه وارد حساب خود شوید"
                  : "۲۰٬۰۰۰ تومان اعتبار رایگان بگیرید"}
              </p>
            </div>
          </div>

          {/* Mode switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5">
            <button
              onClick={() => setMode("login")}
              className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                mode === "login"
                  ? "bg-sky-400/20 text-sky-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ورود
            </button>
            <button
              onClick={() => setMode("register")}
              className={`h-10 rounded-lg text-sm font-semibold transition-all ${
                mode === "register"
                  ? "bg-sky-400/20 text-sky-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ثبت‌نام
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">نام و نام خانوادگی</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="مثال: علی رضایی"
                    className="w-full h-11 pr-10 pl-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">ایمیل</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  dir="ltr"
                  className="w-full h-11 pr-10 pl-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">شماره موبایل</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    placeholder="09120000000"
                    dir="ltr"
                    className="w-full h-11 pr-10 pl-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">رمز عبور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full h-11 pr-10 pl-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right"
                />
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded accent-sky-500" />
                  مرا به خاطر بسپار
                </label>
                <a href="#" className="text-sky-300 hover:text-sky-200 transition-colors">
                  رمز عبور را فراموش کرده‌اید؟
                </a>
              </div>
            )}

            <GlowButton
              type="submit"
              variant="primary"
              glow
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-sky-950/30 border-t-sky-950 rounded-full animate-spin" />
                  در حال پردازش...
                </>
              ) : mode === "login" ? (
                "ورود به حساب"
              ) : (
                "ایجاد حساب رایگان"
              )}
            </GlowButton>
          </form>

          {mode === "login" && (
            <div className="rounded-xl bg-sky-400/5 border border-sky-400/15 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-sky-300 font-semibold">حساب نمونه:</span>{" "}
                برای آزمایش می‌توانید با ایمیل{" "}
                <code className="text-sky-300" dir="ltr">demo@caspian.ai</code> و
                هر رمز عبوری وارد شوید.
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
