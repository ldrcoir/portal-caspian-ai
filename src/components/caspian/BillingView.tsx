"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Zap,
  ArrowUpLeft,
  CreditCard,
  Shield,
  Check,
  Lock,
  ExternalLink,
  Gift,
} from "lucide-react";
import {
  useAppStore,
  formatToman,
  formatDateTime,
  Transaction,
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
import { toast } from "sonner";

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000, 2000000];

export function BillingView() {
  const { user, transactions, depositViaNextPay, verifyNextPayCallback } = useAppStore();
  const [showDeposit, setShowDeposit] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number>(100000);
  const [redirecting, setRedirecting] = useState(false);

  if (!user) return null;

  const totalDeposit = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalUsage = transactions
    .filter((t) => t.type === "usage")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDeposit = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (!amount || amount < 10000) {
      toast.error("حداقل مبلغ شارژ ۱۰٬۰۰۰ تومان است");
      return;
    }
    setRedirecting(true);
    const { transId, redirectUrl } = depositViaNextPay(amount);
    setTimeout(() => {
      setRedirecting(false);
      setShowDeposit(false);
      // Mock: simulate successful callback after 1.2s
      toast.success("در حال انتقال به درگاه نکست‌پی...", {
        description: `شناسه تراکنش: ${transId}`,
      });
      setTimeout(() => {
        verifyNextPayCallback(transId, amount);
        toast.success(`${formatToman(amount)} به کیف پول شما اضافه شد`);
      }, 1800);
    }, 900);
  };

  const txIcon = (type: Transaction["type"]) => {
    if (type === "deposit") return { icon: TrendingUp, color: "emerald" };
    if (type === "refund") return { icon: Gift, color: "sky" };
    return { icon: Zap, color: "amber" };
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          کیف پول و <span className="text-gradient-sky">تراکنش‌ها</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          مدیریت موجودی حساب و مشاهده تاریخچه کامل تراکنش‌ها
        </p>
      </div>

      {/* Wallet hero card */}
      <GlassCard variant="gradient" glow className="relative overflow-hidden">
        <div className="absolute -top-12 -left-12 h-64 w-64 bg-sky-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 h-64 w-64 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="relative grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Wallet className="h-4 w-4" />
              موجودی فعلی
            </div>
            <div className="text-4xl sm:text-5xl font-black text-gradient-sky mb-3">
              {formatToman(user.creditBalance)}
            </div>
            <GlowButton
              variant="primary"
              glow
              onClick={() => setShowDeposit(true)}
            >
              <ArrowUpLeft className="h-4 w-4" />
              شارژ کیف پول
            </GlowButton>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 p-4 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                کل شارژها
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {formatToman(totalDeposit)}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <TrendingDown className="h-3.5 w-3.5 text-amber-400" />
                کل مصرف
              </div>
              <div className="text-lg font-bold text-amber-400">
                {formatToman(totalUsage)}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Gateway info card */}
      <GlassCard className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-500/10 flex items-center justify-center shrink-0">
          <CreditCard className="h-6 w-6 text-sky-400" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            درگاه پرداخت نکست‌پی
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-400/15 text-emerald-400 font-medium">
              فعال
            </span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            پرداخت‌ها از طریق درگاه امن نکست‌پی با رمزنگاری SSL انجام می‌شود.
            کاسپین AI از معماری ماژولار استفاده می‌کند و درگاه‌های دیگر (زرین‌پال،
            آیدی‌پی و...) به‌راحتی قابل افزودن هستند.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-emerald-400" />
          <span>SSL رمزنگاری شده</span>
        </div>
      </GlassCard>

      {/* Transactions table */}
      <GlassCard className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-foreground">تاریخچه تراکنش‌ها</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {transactions.length.toLocaleString("fa-IR")} تراکنش ثبت شده
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">نوع</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">توضیحات</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">شناسه</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">موجودی بعد</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">تاریخ</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const { icon: Icon, color } = txIcon(tx.type);
                const isPositive = tx.type === "deposit" || tx.type === "refund";
                return (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center bg-${color}-400/15`}
                          style={{
                            backgroundColor:
                              color === "emerald"
                                ? "rgba(52,211,153,0.15)"
                                : color === "sky"
                                ? "rgba(56,189,248,0.15)"
                                : "rgba(251,191,36,0.15)",
                          }}
                        >
                          <Icon
                            className="h-4 w-4"
                            style={{
                              color:
                                color === "emerald"
                                  ? "#34D399"
                                  : color === "sky"
                                  ? "#38BDF8"
                                  : "#FBBF24",
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {tx.type === "deposit" ? "شارژ" : tx.type === "refund" ? "بازگشت" : "مصرف"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{tx.description}</td>
                    <td className="px-5 py-4">
                      <code className="text-[11px] text-muted-foreground font-mono" dir="ltr">
                        {tx.refId}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {tx.balanceAfter.toLocaleString("fa-IR")} ت
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {formatDateTime(tx.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-left">
                      <span
                        className={`text-sm font-bold ${
                          isPositive ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {isPositive ? "+" : "−"}
                        {formatToman(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {transactions.map((tx) => {
            const { icon: Icon, color } = txIcon(tx.type);
            const isPositive = tx.type === "deposit" || tx.type === "refund";
            return (
              <div key={tx.id} className="p-4 flex items-start gap-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor:
                      color === "emerald"
                        ? "rgba(52,211,153,0.15)"
                        : color === "sky"
                        ? "rgba(56,189,248,0.15)"
                        : "rgba(251,191,36,0.15)",
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{
                      color:
                        color === "emerald" ? "#34D399" : color === "sky" ? "#38BDF8" : "#FBBF24",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {tx.type === "deposit" ? "شارژ" : tx.type === "refund" ? "بازگشت" : "مصرف"}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        isPositive ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {isPositive ? "+" : "−"}
                      {tx.amount.toLocaleString("fa-IR")} ت
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{tx.description}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{formatDateTime(tx.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Deposit modal */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent className="glass-strong border-sky-400/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Wallet className="h-5 w-5 text-sky-400" />
              شارژ کیف پول
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              مبلغ مورد نظر را انتخاب یا وارد کنید. پرداخت از طریق درگاه امن
              نکست‌پی انجام می‌شود.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Quick amounts */}
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedAmount === amt && !customAmount
                      ? "bg-sky-400/15 border-sky-400/40 text-sky-300"
                      : "bg-white/5 border-white/10 text-foreground hover:border-sky-400/30"
                  }`}
                >
                  {amt.toLocaleString("fa-IR")}
                  <span className="text-[10px] block text-muted-foreground font-normal mt-0.5">تومان</span>
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                placeholder="مبلغ دلخواه (تومان)"
                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm"
              />
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">مبلغ شارژ</span>
                <span className="font-bold text-foreground">
                  {(customAmount ? parseInt(customAmount) || 0 : selectedAmount).toLocaleString("fa-IR")} تومان
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">کارمزد درگاه</span>
                <span className="font-bold text-emerald-400">رایگان</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                <span className="text-muted-foreground">مبلغ قابل پرداخت</span>
                <span className="font-bold text-sky-300">
                  {(customAmount ? parseInt(customAmount) || 0 : selectedAmount).toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-400" />
                SSL رمزنگاری
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-400" />
                درگاه امن
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-400" />
                بدون کارمزد
              </div>
            </div>
          </div>

          <DialogFooter>
            <GlowButton
              variant="primary"
              glow
              className="w-full"
              onClick={handleDeposit}
              disabled={redirecting}
            >
              {redirecting ? (
                <>
                  <span className="h-4 w-4 border-2 border-sky-950/30 border-t-sky-950 rounded-full animate-spin" />
                  در حال انتقال به درگاه...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4" />
                  ادامه به درگاه نکست‌پی
                </>
              )}
            </GlowButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
