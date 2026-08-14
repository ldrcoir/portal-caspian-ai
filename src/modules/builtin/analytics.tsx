"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, Zap, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "@/components/caspian/GlassCard";
import { useAppStore, formatToman, formatNumber } from "@/store/app-store";
import type { ModuleManifest } from "../registry";

// ============ Analytics Page (shown in sidebar) ============

const ANALYTICS_DATA = [
  { time: "۰۰:۰۰", requests: 142, cost: 12400 },
  { time: "۰۴:۰۰", requests: 89, cost: 8200 },
  { time: "۰۸:۰۰", requests: 312, cost: 28600 },
  { time: "۱۲:۰۰", requests: 528, cost: 47200 },
  { time: "۱۶:۰۰", requests: 684, cost: 61800 },
  { time: "۲۰:۰۰", requests: 421, cost: 38400 },
  { time: "اکنون", requests: 248, cost: 21600 },
];

export function AnalyticsPage() {
  const { user, transactions, conversations, apiKeys } = useAppStore();

  const totalRequests = ANALYTICS_DATA.reduce((a, b) => a + b.requests, 0);
  const totalCost = ANALYTICS_DATA.reduce((a, b) => a + b.cost, 0);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          تحلیل و <span className="text-gradient-sky">آنالیتیکس</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نمونه ماژول تحلیلی — این صفحه توسط ماژول Analytics ارائه می‌شود
        </p>
      </div>

      <GlassCard className="flex items-start gap-3 !p-4 !bg-purple-400/5 !border-purple-400/20">
        <div className="h-9 w-9 rounded-xl bg-purple-400/15 flex items-center justify-center shrink-0">
          <Activity className="h-4 w-4 text-purple-400" />
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="text-foreground font-semibold">ماژول Analytics فعال است.</span> این
          ماژول نشان می‌دهد که چطور یک ماژول مستقل می‌تواند: (۱) آیتم سایدبار ثبت کند، (۲) تب
          ادمین ثبت کند، (۳) به رویدادهای سیستم گوش دهد. برای غیرفعال‌سازی، به پنل مدیریت →
          ماژول‌ها بروید.
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard hover className="space-y-3">
          <div className="h-10 w-10 rounded-xl bg-purple-400/15 flex items-center justify-center">
            <Zap className="h-5 w-5 text-purple-400" strokeWidth={1.75} />
          </div>
          <div className="text-xs text-muted-foreground mt-3">درخواست‌های امروز</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">
            {formatNumber(totalRequests)}
          </div>
        </GlassCard>
        <GlassCard hover className="space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-400/15 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-emerald-400" strokeWidth={1.75} />
          </div>
          <div className="text-xs text-muted-foreground mt-3">هزینه امروز</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">{formatToman(totalCost)}</div>
        </GlassCard>
        <GlassCard hover className="space-y-3">
          <div className="h-10 w-10 rounded-xl bg-sky-400/15 flex items-center justify-center">
            <Users className="h-5 w-5 text-sky-400" strokeWidth={1.75} />
          </div>
          <div className="text-xs text-muted-foreground mt-3">کاربران فعال</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">{formatNumber(12847)}</div>
        </GlassCard>
        <GlassCard hover className="space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-400/15 flex items-center justify-center">
            <Activity className="h-5 w-5 text-amber-400" strokeWidth={1.75} />
          </div>
          <div className="text-xs text-muted-foreground mt-3">نرخ موفقیت</div>
          <div className="text-xl sm:text-2xl font-black text-foreground">۹۹.۸٪</div>
        </GlassCard>
      </div>

      <GlassCard className="space-y-5">
        <h3 className="font-bold text-foreground">ترافیک ۲۴ ساعت گذشته</h3>
        <div className="h-64 -mr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ANALYTICS_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "12px",
                  color: "#F8FAFC",
                  fontSize: "12px",
                  backdropFilter: "blur(12px)",
                }}
              />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#A855F7"
                strokeWidth={2.5}
                fill="url(#analyticsGrad)"
                dot={{ fill: "#A855F7", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}

// ============ Analytics Admin Tab ============

export function AnalyticsAdminTab() {
  const { transactions, conversations, apiKeys } = useAppStore();
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-foreground">تنظیمات ماژول Analytics</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          پیکربندی ماژول تحلیل و آنالیتیکس
        </p>
      </div>
      <GlassCard className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <div className="text-2xl font-black text-purple-400">
              {transactions.length.toLocaleString("fa-IR")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">تراکنش‌های ردیابی شده</div>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <div className="text-2xl font-black text-purple-400">
              {conversations.length.toLocaleString("fa-IR")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">مکالمات ردیابی شده</div>
          </div>
          <div className="rounded-xl bg-white/5 p-4 text-center">
            <div className="text-2xl font-black text-purple-400">
              {apiKeys.length.toLocaleString("fa-IR")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">کلیدهای API ردیابی شده</div>
          </div>
        </div>
        <div className="rounded-xl bg-purple-400/5 border border-purple-400/15 p-3 text-xs text-muted-foreground">
          این ماژول به رویدادهای <code className="text-purple-300">chat:messageSent</code>،{" "}
          <code className="text-purple-300">billing:paymentComplete</code> و{" "}
          <code className="text-purple-300">apikey:created</code> گوش می‌دهد و آمار تولید می‌کند.
        </div>
      </GlassCard>
    </div>
  );
}

// ============ Module Manifest ============

export const analyticsModule: ModuleManifest = {
  id: "feature-analytics",
  name: "ماژول تحلیل و آنالیتیکس",
  description:
    "ماژول نمونه برای اثبات معماری ماژولار — این ماژول یک آیتم سایدبار، یک تب ادمین و یک سیستم رویداد گوش‌دهنده ارائه می‌دهد. می‌توانید آن را از پنل ادمین غیرفعال کنید تا ببینید چه اتفاقی می‌افتد.",
  version: "1.0.0",
  author: "Caspian AI Team",
  icon: "BarChart3",
  type: "feature",
  isEnabled: true,
  isCore: false,
  config: {
    trackEvents: true,
    retentionDays: 30,
  },
  configSchema: [
    {
      key: "trackEvents",
      label: "فعال‌سازی ردیابی رویدادها",
      type: "boolean",
      defaultValue: true,
      description: "رویدادهای سیستم (پیام، پرداخت، کلید API) ردیابی شوند",
    },
    {
      key: "retentionDays",
      label: "مدت نگهداری داده (روز)",
      type: "number",
      defaultValue: 30,
      description: "داده‌های آنالیتیکس بعد از این مدت حذف می‌شوند",
    },
  ],
  navItems: [
    {
      id: "analytics",
      label: "تحلیل و آنالیتیکس",
      icon: "BarChart3",
      view: "analytics",
      order: 50,
      badge: "نمونه",
    },
  ],
  adminTabs: [
    {
      id: "analytics",
      label: "آنالیتیکس",
      icon: "BarChart3",
      component: AnalyticsAdminTab,
      order: 60,
    },
  ],
  onEnable: () => {
    console.log("[Analytics] Module enabled — events will be tracked");
  },
  onDisable: () => {
    console.log("[Analytics] Module disabled — events no longer tracked");
  },
  handlers: {
    onMessageSent: (msg) => {
      console.log("[Analytics] Message sent:", msg.id);
    },
    onPaymentComplete: (tx) => {
      console.log("[Analytics] Payment tracked:", tx.amount);
    },
    onApiKeyCreated: (key) => {
      console.log("[Analytics] API key created:", key.name);
    },
  },
};
