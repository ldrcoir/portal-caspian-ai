"use client";

import { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Globe2,
  CreditCard,
  ArrowLeft,
  Check,
  Zap,
  TrendingUp,
  Bot,
  Quote,
  Github,
  Twitter,
  Send,
  Mail,
} from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useT } from "@/i18n";
import { Logo } from "@/components/caspian/Logo";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { LanguageSwitcher } from "@/components/caspian/LanguageSwitcher";

export function LandingPage() {
  const { setView, pricingTiers, models, agents } = useAppStore();
  const t = useT();
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size={36} />
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">امکانات</a>
            <a href="#models" className="text-muted-foreground hover:text-foreground transition-colors">مدل‌ها</a>
            <a href="#agents" className="text-muted-foreground hover:text-foreground transition-colors">عامل‌ها</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">قیمت‌گذاری</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <GlowButton
              variant="ghost"
              size="sm"
              onClick={() => setView("auth")}
            >
              {t("auth.login")}
            </GlowButton>
            <GlowButton
              variant="primary"
              size="sm"
              glow
              onClick={() => setView("auth")}
            >
              {t("auth.register")}
            </GlowButton>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-24 pb-16">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl float-anim pointer-events-none" />
        <div
          className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Right column (RTL: text first) */}
          <div className="text-center lg:text-right space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-sky-300 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              پلتفرم هوش مصنوعی نسل جدید برای ایران
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              <span className="text-foreground">کاسپین </span>
              <span className="text-gradient-primary">AI</span>
              <br />
              <span className="text-foreground">هوش مصنوعی،</span>
              <br />
              <span className="text-gradient-sky">عمیق و شفاف</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              به قدرتمندترین مدل‌های هوش مصنوعی جهان — GPT-5.6، Claude Sonnet 5،
              Gemini 2.5 Pro و ده‌ها مدل دیگر — با شفافیت کامل قیمت و کیف پول
              تومانی دسترسی داشته باشید. بدون تاریخ انقضا، با درگاه پرداخت امن
              ایرانی.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <GlowButton
                variant="primary"
                size="lg"
                glow
                onClick={() => setView("auth")}
              >
                <Zap className="h-4 w-4" strokeWidth={2} />
                شروع رایگان با ۲۰٬۰۰۰ تومان اعتبار
              </GlowButton>
              <GlowButton
                variant="outline"
                size="lg"
                onClick={() => setView("install")}
              >
                نصب روی سرور خودتان
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
                اتکامل با OpenAI API
              </div>
            </div>
          </div>

          {/* Left column (visual) */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Floating orbs */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/30 via-indigo-500/20 to-purple-500/10 blur-2xl" />
              <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-sky-400/20 to-transparent float-anim" />

              {/* Central AI orb */}
              <div className="absolute inset-12 rounded-full glass-strong flex items-center justify-center pulse-glow">
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-600/10 flex items-center justify-center">
                  <div className="absolute inset-8 rounded-full border border-sky-400/30 animate-spin" style={{ animationDuration: "20s" }} />
                  <div className="absolute inset-14 rounded-full border border-indigo-400/20 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
                  <Bot className="h-20 w-20 text-sky-400" strokeWidth={1.5} />
                </div>
              </div>

              {/* Floating cards */}
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

              <div
                className="absolute top-1/2 -left-4 sm:left-4 glass-strong rounded-2xl p-3 float-anim shadow-xl"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-400/15 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground">پاسخ در</div>
                    <div className="text-sm font-bold text-foreground">۱.۲ ثانیه</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust bar ===== */}
      <section className="border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground mb-6">
            به اعتماد کسب‌وکارهای ایرانی
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60">
            {["دیجی‌کالا", "اسنپ", "تپسی", "باسلام", "کافه‌بازار", "آپارات"].map(
              (brand) => (
                <div
                  key={brand}
                  className="text-base sm:text-lg font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {brand}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
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
              تمام چیزی که برای استفاده حرفه‌ای از هوش مصنوعی نیاز دارید، در یک
              پلتفرم یکپارچه — با تمرکز بر شفافیت، امنیت و تجربه کاربری.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Clock,
                title: "بدون تاریخ انقضا",
                desc: "اعتبار شارژ شده شما هرگز منقضی نمی‌شود. امروز شارژ کنید، ماه‌ها بعد استفاده کنید.",
                color: "sky",
              },
              {
                icon: Globe2,
                title: "مدل‌های متنوع جهانی",
                desc: "دسترسی به GPT، Claude، Gemini، Llama، DeepSeek و ده‌ها مدل دیگر از یک API واحد.",
                color: "indigo",
              },
              {
                icon: ShieldCheck,
                title: "درگاه پرداخت امن",
                desc: "پرداخت از طریق درگاه‌های معتبر ایرانی مانند نکست‌پی و زرین‌پال با رمزنگاری کامل.",
                color: "emerald",
              },
              {
                icon: CreditCard,
                title: "شفافیت کامل قیمت",
                desc: "قیمت دقیق هر توکن ورودی و خروجی پیش از ارسال درخواست نمایش داده می‌شود.",
                color: "amber",
              },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <GlassCard key={feat.title} hover className="space-y-4 group">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center bg-${feat.color}-400/15`}
                    style={{
                      backgroundColor:
                        feat.color === "sky"
                          ? "rgba(56,189,248,0.15)"
                          : feat.color === "indigo"
                          ? "rgba(129,140,248,0.15)"
                          : feat.color === "emerald"
                          ? "rgba(52,211,153,0.15)"
                          : "rgba(251,191,36,0.15)",
                    }}
                  >
                    <Icon
                      className={`h-6 w-6`}
                      style={{
                        color:
                          feat.color === "sky"
                            ? "#38BDF8"
                            : feat.color === "indigo"
                            ? "#818CF8"
                            : feat.color === "emerald"
                            ? "#34D399"
                            : "#FBBF24",
                      }}
                      strokeWidth={1.75}
                    />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.desc}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Models showcase ===== */}
      <section id="models" className="py-20 lg:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/10 text-indigo-300 text-xs font-medium">
              <Bot className="h-3.5 w-3.5" />
              مدل‌ها
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              یک API، <span className="text-gradient-sky">ده‌ها مدل</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              بهترین مدل‌های هوش مصنوعی جهان را با قیمت‌گذاری شفاف به‌صورت تومانی
              در دسترس داشته باشید.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {models.slice(0, 6).map((model) => (
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

      {/* ===== Agents ===== */}
      <section id="agents" className="py-20 lg:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              عامل‌های تخصصی
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              دستیارهای آماده برای <span className="text-gradient-sky">هر کار</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              عامل‌های از پیش تنظیم شده با پرامپت سیستم تخصصی، برای پاسخ به نیازهای
              خاص شما — بدون نیاز به دانش پرامپت‌نویسی.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.map((agent) => (
              <GlassCard key={agent.id} hover className="text-center space-y-4">
                <div
                  className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${agent.color}22`,
                    boxShadow: `0 8px 24px -8px ${agent.color}55`,
                  }}
                >
                  <Sparkles
                    className="h-7 w-7"
                    style={{ color: agent.color }}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-bold text-lg" style={{ color: agent.color }}>
                  {agent.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {agent.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="py-20 lg:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-medium">
              قیمت‌گذاری
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
              پلن مناسب <span className="text-gradient-sky">خودتان</span> را انتخاب کنید
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              فقط برای آنچه استفاده می‌کنید پرداخت می‌کنید. بدون هزینه پنهان، بدون
              قرارداد طولانی‌مدت.
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
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
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

      {/* ===== Testimonial ===== */}
      <section className="py-20 lg:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Quote className="mx-auto h-12 w-12 text-sky-400/30" strokeWidth={1.5} />
          <blockquote className="text-2xl sm:text-3xl font-bold leading-relaxed text-foreground">
            «کاسپین AI به تیم ما اجازه داد بدون دردسرهای کارت بانکی خارجی و
            نوسانات ارزی، از قدرتمندترین مدل‌های هوش مصنوعی استفاده کنیم.
            شفافیت قیمت‌گذاری فوق‌العاده است.»
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sky-950 font-bold">
              م
            </div>
            <div className="text-right">
              <div className="font-bold text-foreground">مهسا کریمی</div>
              <div className="text-sm text-muted-foreground">مدیر محصول، استارتاپ فین‌تک</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard variant="gradient" glow className="relative overflow-hidden text-center py-14 px-6">
            <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
            <div className="relative space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                همین امروز <span className="text-gradient-sky">شروع کنید</span>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                با ثبت‌نام، ۲۰٬۰۰۰ تومان اعتبار رایگان دریافت کنید. بدون نیاز به
                کارت بانکی خارجی، بدون تاریخ انقضا.
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

      {/* ===== Footer ===== */}
      <footer className="mt-auto border-t border-white/5 py-12 bg-[#0A0F1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3">
              <Logo size={32} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                پلتفرم هوش مصنوعی کاسپین — ساخته شده برای کاربران ایرانی، با
                تمرکز بر شفافیت، امنیت و کیفیت.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">محصول</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-sky-300 transition-colors">امکانات</a></li>
                <li><a href="#models" className="hover:text-sky-300 transition-colors">مدل‌ها</a></li>
                <li><a href="#pricing" className="hover:text-sky-300 transition-colors">قیمت‌گذاری</a></li>
                <li><button onClick={() => setView("install")} className="hover:text-sky-300 transition-colors">نصب روی سرور</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">قوانین</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-sky-300 transition-colors">قوانین و مقررات</a></li>
                <li><a href="#" className="hover:text-sky-300 transition-colors">حریم خصوصی</a></li>
                <li><a href="#" className="hover:text-sky-300 transition-colors">سیاست بازگشت وجه</a></li>
                <li><a href="#" className="hover:text-sky-300 transition-colors">SLA</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-3">ارتباط با ما</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@caspian.ai</li>
                <li className="flex items-center gap-2"><Send className="h-4 w-4" /> کانال تلگرام</li>
              </ul>
              <div className="flex items-center gap-3 mt-4">
                <a href="#" className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-sky-300 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="h-9 w-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-sky-300 transition-colors">
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© ۱۴۰۵ کاسپین AI. تمامی حقوق محفوظ است.</p>
            <p>ساخته شده با ❤️ در ایران</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
