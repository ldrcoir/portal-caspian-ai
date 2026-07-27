"use client";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  KeyRound,
  Zap,
  ArrowUpLeft,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useAppStore, formatToman, formatNumber, formatRelativeTime } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";

const USAGE_7_DAYS = [
  { day: "شنبه", usage: 4200, requests: 12 },
  { day: "یکشنبه", usage: 6800, requests: 19 },
  { day: "دوشنبه", usage: 5400, requests: 15 },
  { day: "سه‌شنبه", usage: 9200, requests: 24 },
  { day: "چهارشنبه", usage: 7100, requests: 21 },
  { day: "پنجشنبه", usage: 12400, requests: 32 },
  { day: "جمعه", usage: 4820, requests: 14 },
];

const MODEL_BREAKDOWN = [
  { model: "GPT-5.6", count: 142, color: "#38BDF8" },
  { model: "Claude", count: 98, color: "#818CF8" },
  { model: "Gemini", count: 67, color: "#34D399" },
  { model: "DeepSeek", count: 210, color: "#FBBF24" },
  { model: "Llama", count: 43, color: "#F472B6" },
];

export function DashboardView() {
  const { user, transactions, apiKeys, conversations, setView } = useAppStore();

  if (!user) return null;

  const todayUsage = 4820;
  const activeKeys = apiKeys.filter((k) => k.isEnabled).length;
  const totalConversations = conversations.length;
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            سلام، <span className="text-gradient-sky">{user.fullName}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            خلاصه فعالیت حساب شما در ۷ روز گذشته
          </p>
        </div>
        <GlowButton
          variant="primary"
          glow
          size="md"
          onClick={() => setView("chat")}
        >
          <Sparkles className="h-4 w-4" />
          شروع مکالمه جدید
        </GlowButton>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Wallet */}
        <GlassCard hover className="space-y-3 relative overflow-hidden">
          <div className="absolute -top-4 -left-4 h-24 w-24 bg-sky-500/15 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-sky-400/15 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-sky-400" strokeWidth={1.75} />
              </div>
              <GlowButton
                variant="subtle"
                size="sm"
                onClick={() => setView("billing")}
              >
                <ArrowUpLeft className="h-3.5 w-3.5" />
                شارژ
              </GlowButton>
            </div>
            <div className="text-xs text-muted-foreground mt-3">موجودی کیف پول</div>
            <div className="text-xl sm:text-2xl font-black text-gradient-sky">
              {formatToman(user.creditBalance)}
            </div>
          </div>
        </GlassCard>

        {/* Today usage */}
        <GlassCard hover className="space-y-3 relative overflow-hidden">
          <div className="absolute -top-4 -left-4 h-24 w-24 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-amber-400/15 flex items-center justify-center">
              <Zap className="h-5 w-5 text-amber-400" strokeWidth={1.75} />
            </div>
            <div className="text-xs text-muted-foreground mt-3">مصرف امروز</div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {formatToman(todayUsage)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <TrendingDown className="h-3 w-3" />
              ۱۲٪ کمتر از دیروز
            </div>
          </div>
        </GlassCard>

        {/* Active API keys */}
        <GlassCard hover className="space-y-3 relative overflow-hidden">
          <div className="absolute -top-4 -left-4 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-emerald-400/15 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-emerald-400" strokeWidth={1.75} />
            </div>
            <div className="text-xs text-muted-foreground mt-3">کلیدهای API فعال</div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {formatNumber(activeKeys)}
            </div>
            <div className="text-[11px] text-muted-foreground">
              از {formatNumber(apiKeys.length)} کلید کل
            </div>
          </div>
        </GlassCard>

        {/* Conversations */}
        <GlassCard hover className="space-y-3 relative overflow-hidden">
          <div className="absolute -top-4 -left-4 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-indigo-400/15 flex items-center justify-center">
              <Activity className="h-5 w-5 text-indigo-400" strokeWidth={1.75} />
            </div>
            <div className="text-xs text-muted-foreground mt-3">مکالمات هفته</div>
            <div className="text-xl sm:text-2xl font-black text-foreground">
              {formatNumber(totalConversations)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              ۳ مکالمه جدید
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Usage area chart */}
        <GlassCard className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">مصرف ۷ روز گذشته</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                مجموع هزینه به تومان
              </p>
            </div>
            <div className="text-left">
              <div className="text-lg font-black text-foreground">
                {formatToman(USAGE_7_DAYS.reduce((a, b) => a + b.usage, 0))}
              </div>
              <div className="text-[11px] text-muted-foreground">هفته جاری</div>
            </div>
          </div>
          <div className="h-64 -mr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USAGE_7_DAYS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toLocaleString("fa-IR")}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                    backdropFilter: "blur(12px)",
                  }}
                  labelStyle={{ color: "#94A3B8" }}
                  formatter={(v: number) => [formatToman(v), "مصرف"]}
                />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fill="url(#usageGradient)"
                  dot={{ fill: "#38BDF8", r: 4 }}
                  activeDot={{ r: 6, fill: "#38BDF8", stroke: "#0B1121", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Model usage bar chart */}
        <GlassCard className="space-y-5">
          <div>
            <h3 className="font-bold text-foreground">مصرف بر اساس مدل</h3>
            <p className="text-xs text-muted-foreground mt-0.5">تعداد درخواست این هفته</p>
          </div>
          <div className="h-64 -mr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODEL_BREAKDOWN} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="model"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                    backdropFilter: "blur(12px)",
                  }}
                  cursor={{ fill: "rgba(56, 189, 248, 0.05)" }}
                  formatter={(v: number) => [`${formatNumber(v)} درخواست`, ""]}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
                  {MODEL_BREAKDOWN.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recent transactions */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">تراکنش‌های اخیر</h3>
          <GlowButton variant="ghost" size="sm" onClick={() => setView("billing")}>
            مشاهده همه
            <ArrowUpLeft className="h-3.5 w-3.5" />
          </GlowButton>
        </div>
        <div className="space-y-1">
          {recentTransactions.map((tx) => {
            const isDeposit = tx.type === "deposit" || tx.type === "refund";
            return (
              <div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDeposit
                      ? "bg-emerald-400/15 text-emerald-400"
                      : "bg-amber-400/15 text-amber-400"
                  }`}
                >
                  {isDeposit ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {tx.description}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeTime(tx.createdAt)}
                    {tx.refId && (
                      <span className="mr-2 font-mono" dir="ltr">{tx.refId}</span>
                    )}
                  </div>
                </div>
                <div className={`text-sm font-bold ${isDeposit ? "text-emerald-400" : "text-amber-400"}`}>
                  {isDeposit ? "+" : "−"}
                  {formatToman(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
