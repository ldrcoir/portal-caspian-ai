"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  Zap,
  Star,
  TrendingUp,
  TrendingDown,
  Settings2,
  Bot,
  Save,
  Plus,
  Shield,
  Activity,
  Server,
  Cpu,
  HardDrive,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useAppStore, formatToman, formatNumber } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { DynamicIcon } from "@/components/caspian/DynamicIcon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const REVENUE_DATA = [
  { date: "۲۱ تیر", walletDeposits: 1850000, apiUsage: 920000 },
  { date: "۲۲ تیر", walletDeposits: 2400000, apiUsage: 1180000 },
  { date: "۲۳ تیر", walletDeposits: 1980000, apiUsage: 1340000 },
  { date: "۲۴ تیر", walletDeposits: 3200000, apiUsage: 1620000 },
  { date: "۲۵ تیر", walletDeposits: 2850000, apiUsage: 1490000 },
  { date: "۲۶ تیر", walletDeposits: 3950000, apiUsage: 2010000 },
  { date: "۲۷ تیر", walletDeposits: 4280000, apiUsage: 2480000 },
];

const MODEL_USAGE_DATA = [
  { model: "GPT-5.6", tokens: 1240000, color: "#38BDF8" },
  { model: "Claude 5", tokens: 890000, color: "#818CF8" },
  { model: "Gemini 2.5", tokens: 670000, color: "#34D399" },
  { model: "DeepSeek V3", tokens: 1450000, color: "#FBBF24" },
  { model: "Llama 3.3", tokens: 320000, color: "#F472B6" },
];

const MODEL_SHARE_DATA = MODEL_USAGE_DATA.map((m) => ({
  name: m.model,
  value: m.tokens,
  color: m.color,
}));

const ADMIN_ACCENT = "#F59E0B";

type AdminTab = "dashboard" | "models" | "agents" | "users" | "system";

export function AdminView() {
  const { models, agents, updateModel, updateAgent, transactions, user } = useAppStore();
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [editingAgent, setEditingAgent] = useState<string | null>(null);
  const [agentDraft, setAgentDraft] = useState({ name: "", description: "", systemPrompt: "" });

  const totalUsers = 12847;
  const todayRevenue = 6760000;
  const todayRequests = 18432;
  const topModelToday = "GPT-5.6";

  const handleSaveAgent = (id: string) => {
    updateAgent(id, agentDraft);
    setEditingAgent(null);
    toast.success("عامل ذخیره شد");
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center glow-admin">
          <Shield className="h-5 w-5 text-amber-950" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            پنل <span style={{ color: ADMIN_ACCENT }}>مدیریت</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            مدیریت کامل پلتفرم کاسپین AI
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 w-full overflow-x-auto scrollbar-thin">
        {[
          { key: "dashboard" as const, label: "داشبورد", icon: Activity },
          { key: "models" as const, label: "مدل‌ها", icon: Cpu },
          { key: "agents" as const, label: "عامل‌ها", icon: Bot },
          { key: "users" as const, label: "کاربران", icon: Users },
          { key: "system" as const, label: "سیستم", icon: Server },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "h-10 px-4 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap",
                tab === t.key
                  ? "bg-amber-400/15 text-amber-300"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "dashboard" && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard hover className="space-y-3 relative overflow-hidden">
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: "rgba(56,189,248,0.15)" }} />
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-sky-400/15 flex items-center justify-center">
                  <Users className="h-5 w-5 text-sky-400" strokeWidth={1.75} />
                </div>
                <div className="text-xs text-muted-foreground mt-3">کل کاربران</div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {formatNumber(totalUsers)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  ۱۸٪ رشد ماهانه
                </div>
              </div>
            </GlassCard>

            <GlassCard hover className="space-y-3 relative overflow-hidden">
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: "rgba(245,158,11,0.15)" }} />
              <div className="relative">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(245,158,11,0.15)" }}>
                  <DollarSign className="h-5 w-5" style={{ color: ADMIN_ACCENT }} strokeWidth={1.75} />
                </div>
                <div className="text-xs text-muted-foreground mt-3">درآمد امروز</div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {formatToman(todayRevenue)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  ۲۴٪ بیشتر از دیروز
                </div>
              </div>
            </GlassCard>

            <GlassCard hover className="space-y-3 relative overflow-hidden">
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: "rgba(168,85,247,0.15)" }} />
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-purple-400/15 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-400" strokeWidth={1.75} />
                </div>
                <div className="text-xs text-muted-foreground mt-3">درخواست‌های امروز</div>
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {formatNumber(todayRequests)}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  ۳۲٪ رشد
                </div>
              </div>
            </GlassCard>

            <GlassCard hover className="space-y-3 relative overflow-hidden">
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: "rgba(251,191,36,0.15)" }} />
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-amber-400/15 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-400" strokeWidth={1.75} fill="currentColor" />
                </div>
                <div className="text-xs text-muted-foreground mt-3">مدل محبوب امروز</div>
                <div className="text-lg sm:text-xl font-black text-foreground">
                  {topModelToday}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  ۴٬۲۸۰ درخواست
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Revenue chart */}
          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-foreground">درآمد ۷ روز گذشته</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  مقایسه شارژ کیف پول و مصرف API
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ADMIN_ACCENT }} />
                  <span className="text-muted-foreground">شارژ کیف پول</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span className="text-muted-foreground">مصرف API</span>
                </div>
              </div>
            </div>
            <div className="h-72 -mr-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ADMIN_ACCENT} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={ADMIN_ACCENT} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis
                    dataKey="date"
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
                    tickFormatter={(v) => `${(v / 1000000).toLocaleString("fa-IR")}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      borderRadius: "12px",
                      color: "#F8FAFC",
                      fontSize: "12px",
                      backdropFilter: "blur(12px)",
                    }}
                    labelStyle={{ color: "#94A3B8", marginBottom: "4px" }}
                    formatter={(v: number, name: string) => [
                      formatToman(v),
                      name === "walletDeposits" ? "شارژ کیف پول" : "مصرف API",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="walletDeposits"
                    stroke={ADMIN_ACCENT}
                    strokeWidth={2.5}
                    dot={{ fill: ADMIN_ACCENT, r: 4 }}
                    activeDot={{ r: 6, fill: ADMIN_ACCENT, stroke: "#0B1121", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="apiUsage"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    dot={{ fill: "#38BDF8", r: 4 }}
                    activeDot={{ r: 6, fill: "#38BDF8", stroke: "#0B1121", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Two charts side by side */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Models bar chart */}
            <GlassCard className="space-y-5">
              <div>
                <h3 className="font-bold text-foreground">مصرف مدل‌ها</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  تعداد توکن مصرف‌شده (هزار توکن)
                </p>
              </div>
              <div className="h-64 -mr-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MODEL_USAGE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      {MODEL_USAGE_DATA.map((entry, i) => (
                        <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.3} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis
                      dataKey="model"
                      stroke="#94A3B8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${(v / 1000).toLocaleString("fa-IR")}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        borderRadius: "12px",
                        color: "#F8FAFC",
                        fontSize: "12px",
                        backdropFilter: "blur(12px)",
                      }}
                      cursor={{ fill: "rgba(245, 158, 11, 0.05)" }}
                      formatter={(v: number) => [`${formatNumber(v)} توکن`, "مصرف"]}
                    />
                    <Bar dataKey="tokens" radius={[8, 8, 0, 0]} barSize={48}>
                      {MODEL_USAGE_DATA.map((entry, i) => (
                        <Cell key={i} fill={`url(#barGrad${i})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Models pie chart */}
            <GlassCard className="space-y-5">
              <div>
                <h3 className="font-bold text-foreground">سهم مدل‌ها از هزینه</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  توزیع درآمد بر اساس مدل
                </p>
              </div>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MODEL_SHARE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {MODEL_SHARE_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="#0B1121" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        borderRadius: "12px",
                        color: "#F8FAFC",
                        fontSize: "12px",
                        backdropFilter: "blur(12px)",
                      }}
                      formatter={(v: number, _: any, props: any) => {
                        const total = MODEL_SHARE_DATA.reduce((a, b) => a + b.value, 0);
                        const pct = ((v / total) * 100).toFixed(1);
                        return [`${formatNumber(v)} (${pct.toLocaleString("fa-IR")}٪)`, props.payload.name];
                      }}
                    />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {tab === "models" && (
        <GlassCard className="!p-0 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-foreground">مدیریت مدل‌ها</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                قیمت‌گذاری و فعال‌سازی مدل‌های هوش مصنوعی
              </p>
            </div>
            <GlowButton variant="admin" size="sm">
              <Plus className="h-3.5 w-3.5" />
              افزودن مدل
            </GlowButton>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">مدل</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">پروایدر</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">قیمت ورودی (ت/۱K)</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">قیمت خروجی (ت/۱K)</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500/30 to-indigo-500/20 flex items-center justify-center text-sky-300 font-bold text-xs">
                          {model.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{model.name}</div>
                          {model.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-400/15 text-sky-300 font-medium">
                              {model.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{model.provider}</td>
                    <td className="px-5 py-4">
                      <input
                        type="number"
                        value={model.inputTokenPriceToman}
                        onChange={(e) =>
                          updateModel(model.id, { inputTokenPriceToman: parseInt(e.target.value) || 0 })
                        }
                        className="w-20 h-8 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:border-amber-400/40 focus:outline-none text-center"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <input
                        type="number"
                        value={model.outputTokenPriceToman}
                        onChange={(e) =>
                          updateModel(model.id, { outputTokenPriceToman: parseInt(e.target.value) || 0 })
                        }
                        className="w-20 h-8 px-2 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground focus:border-amber-400/40 focus:outline-none text-center"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => {
                          updateModel(model.id, { isActive: !model.isActive });
                          toast.success(model.isActive ? "مدل غیرفعال شد" : "مدل فعال شد");
                        }}
                        className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          model.isActive ? "bg-amber-400" : "bg-zinc-700"
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all",
                            model.isActive ? "right-0.5" : "right-5"
                          )}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {tab === "agents" && (
        <div className="grid lg:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <GlassCard key={agent.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${agent.color}22` }}
                >
                  <DynamicIcon name={agent.icon} className="h-6 w-6" style={{ color: agent.color } as any} />
                </div>
                <div className="flex-1 min-w-0">
                  {editingAgent === agent.id ? (
                    <input
                      value={agentDraft.name}
                      onChange={(e) => setAgentDraft({ ...agentDraft, name: e.target.value })}
                      className="w-full h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none"
                    />
                  ) : (
                    <h3 className="font-bold text-foreground" style={{ color: agent.color }}>
                      {agent.name}
                    </h3>
                  )}
                  {editingAgent === agent.id ? (
                    <input
                      value={agentDraft.description}
                      onChange={(e) => setAgentDraft({ ...agentDraft, description: e.target.value })}
                      className="mt-1 w-full h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-muted-foreground text-xs focus:border-amber-400/40 focus:outline-none"
                    />
                  ) : (
                    <p className="text-xs text-muted-foreground mt-0.5">{agent.description}</p>
                  )}
                </div>
                {editingAgent === agent.id ? (
                  <GlowButton variant="admin" size="sm" onClick={() => handleSaveAgent(agent.id)}>
                    <Save className="h-3.5 w-3.5" />
                    ذخیره
                  </GlowButton>
                ) : (
                  <button
                    onClick={() => {
                      setEditingAgent(agent.id);
                      setAgentDraft({
                        name: agent.name,
                        description: agent.description,
                        systemPrompt: agent.systemPrompt,
                      });
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                  >
                    <Settings2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">
                  پرامپت سیستم (System Prompt)
                </label>
                {editingAgent === agent.id ? (
                  <textarea
                    value={agentDraft.systemPrompt}
                    onChange={(e) => setAgentDraft({ ...agentDraft, systemPrompt: e.target.value })}
                    rows={6}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-xs leading-relaxed focus:border-amber-400/40 focus:outline-none resize-none font-mono"
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-[#0A0F1E] border border-white/5 text-xs text-muted-foreground leading-relaxed font-mono max-h-32 overflow-y-auto scrollbar-thin">
                    {agent.systemPrompt}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[11px] text-muted-foreground">
                  شناسه: <code className="font-mono" dir="ltr">{agent.id}</code>
                </span>
                <span
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-md font-medium",
                    agent.isPublic
                      ? "bg-emerald-400/15 text-emerald-400"
                      : "bg-zinc-400/15 text-zinc-400"
                  )}
                >
                  {agent.isPublic ? "عمومی" : "خصوصی"}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {tab === "users" && (
        <GlassCard className="!p-0 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h3 className="font-bold text-foreground">مدیریت کاربران</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              لیست ۱۰ کاربر اخیر پلتفرم
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">کاربر</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">ایمیل</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">موجودی</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">مصرف کل</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">عضویت</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-5 py-3">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "علی رضایی", email: "ali@example.com", balance: 245000, usage: 1820000, status: "active" },
                  { name: "مهسا کریمی", email: "mahsa@example.com", balance: 89000, usage: 920000, status: "active" },
                  { name: "حسین موسوی", email: "hossein@example.com", balance: 0, usage: 540000, status: "suspended" },
                  { name: "زهرا احمدی", email: "zahra@example.com", balance: 510000, usage: 2340000, status: "active" },
                  { name: "محمد قاسمی", email: "mohammad@example.com", balance: 125000, usage: 670000, status: "active" },
                ].map((u, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sky-950 font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-xs text-muted-foreground" dir="ltr">{u.email}</code>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{u.balance.toLocaleString("fa-IR")} ت</td>
                    <td className="px-5 py-4 text-sm text-amber-400">{u.usage.toLocaleString("fa-IR")} ت</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">۱۴۰۴/۰۴/۰۱</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium",
                          u.status === "active"
                            ? "bg-emerald-400/15 text-emerald-400"
                            : "bg-red-400/15 text-red-400"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            u.status === "active" ? "bg-emerald-400" : "bg-red-400"
                          )}
                        />
                        {u.status === "active" ? "فعال" : "معلق"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {tab === "system" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-foreground">وضعیت سرور</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "CPU", value: 32, color: ADMIN_ACCENT, icon: Cpu },
                { label: "RAM", value: 58, color: "#38BDF8", icon: HardDrive },
                { label: "Disk", value: 41, color: "#34D399", icon: HardDrive },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {m.label}
                      </span>
                      <span className="font-bold text-foreground">{m.value.toLocaleString("fa-IR")}٪</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${m.value}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <h3 className="font-bold text-foreground">سرویس‌ها</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: "API Server (FastAPI)", status: "operational" },
                { name: "PostgreSQL", status: "operational" },
                { name: "Redis Cache", status: "operational" },
                { name: "OpenRouter Proxy", status: "operational" },
                { name: "NextPay Gateway", status: "operational" },
              ].map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <span className="text-sm text-foreground">{s.name}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    فعال
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
