"use client";

import { useState } from "react";
import {
  Users, DollarSign, Zap, Star, TrendingUp, Bot, Save, Plus, Trash2,
  Shield, Activity, Server, Cpu, HardDrive, Pencil, RotateCcw, Type, Plug, Puzzle,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useAppStore, formatToman, formatNumber, formatDate } from "@/store/app-store";
import { useModuleRegistry } from "@/modules/registry";
import { AdminMessagesTab } from "@/modules/features/messages";
import { AdminSupportTab } from "@/modules/features/support";
import { ModulesAdminTab } from "@/components/caspian/ModulesAdminTab";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const REVENUE_DATA = [
  { date: "۲۱ تیر", deposits: 1850000, usage: 920000 },
  { date: "۲۲ تیر", deposits: 2400000, usage: 1180000 },
  { date: "۲۳ تیر", deposits: 1980000, usage: 1340000 },
  { date: "۲۴ تیر", deposits: 3200000, usage: 1620000 },
  { date: "۲۵ تیر", deposits: 2850000, usage: 1490000 },
  { date: "۲۶ تیر", deposits: 3950000, usage: 2010000 },
  { date: "۲۷ تیر", deposits: 4280000, usage: 2480000 },
];
const MODEL_USAGE = [
  { model: "GPT-5.6", tokens: 1240000, color: "#38BDF8" },
  { model: "Claude 5", tokens: 890000, color: "#818CF8" },
  { model: "Gemini", tokens: 670000, color: "#34D399" },
  { model: "DeepSeek", tokens: 1450000, color: "#FBBF24" },
];
const ADMIN_ACCENT = "#F59E0B";
type Tab = "dashboard" | "models" | "agents" | "pricing" | "content" | "modules" | "users" | "messages" | "support" | "system";

export function AdminView() {
  const { models, agents, pricingTiers, siteContent, users, transactions, updateModel, createModel, deleteModel, updateAgent, createAgent, deleteAgent, updatePricingTier, createPricingTier, deletePricingTier, updateSiteContent, resetSiteContent, createUser, updateUser, deleteUser, adjustUserBalance } = useAppStore();
  const [tab, setTab] = useState<Tab>("dashboard");

  const tabs = [
    { key: "dashboard" as Tab, label: "داشبورد", icon: Activity },
    { key: "models" as Tab, label: "مدل‌ها", icon: Cpu },
    { key: "agents" as Tab, label: "عامل‌ها", icon: Bot },
    { key: "pricing" as Tab, label: "قیمت‌گذاری", icon: DollarSign },
    { key: "content" as Tab, label: "محتوا", icon: Type },
    { key: "modules" as Tab, label: "ماژول‌ها", icon: Puzzle },
    { key: "users" as Tab, label: "کاربران", icon: Users },
    { key: "messages" as Tab, label: "پیام‌ها", icon: Plug },
    { key: "support" as Tab, label: "پشتیبانی", icon: Shield },
    { key: "system" as Tab, label: "سیستم", icon: Server },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center glow-admin"><Shield className="h-5 w-5 text-amber-950" strokeWidth={2} /></div>
        <div><h1 className="text-2xl sm:text-3xl font-black text-foreground">پنل <span style={{ color: ADMIN_ACCENT }}>مدیریت</span></h1><p className="text-sm text-muted-foreground mt-0.5">مدیریت کامل پلتفرم</p></div>
      </div>
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 w-full overflow-x-auto scrollbar-thin">
        {tabs.map((t) => { const Icon = t.icon; return <button key={t.key} onClick={() => setTab(t.key)} className={cn("h-10 px-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap", tab === t.key ? "bg-amber-400/15 text-amber-300" : "text-muted-foreground hover:text-foreground")}><Icon className="h-4 w-4" />{t.label}</button>; })}
      </div>

      {tab === "dashboard" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[{ label: "کل کاربران", value: formatNumber(users.length), change: "۱۸٪ رشد", icon: Users, color: "#38BDF8" }, { label: "درآمد امروز", value: formatToman(6760000), change: "۲۴٪ بیشتر", icon: DollarSign, color: ADMIN_ACCENT }, { label: "درخواست‌های امروز", value: formatNumber(18432), change: "۳۲٪ رشد", icon: Zap, color: "#A855F7" }, { label: "مدل محبوب", value: "GPT-5.6", change: "۴٬۲۸۰ درخواست", icon: Star, color: "#FBBF24" }].map((s) => { const Icon = s.icon; return <GlassCard key={s.label} hover className="space-y-3 relative overflow-hidden"><div className="absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" style={{ backgroundColor: `${s.color}25` }} /><div className="relative"><div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}22` }}><Icon className="h-5 w-5" style={{ color: s.color }} strokeWidth={1.75} /></div><div className="text-xs text-muted-foreground mt-3">{s.label}</div><div className="text-xl sm:text-2xl font-black text-foreground">{s.value}</div><div className="flex items-center gap-1 text-[11px] text-emerald-400"><TrendingUp className="h-3 w-3" />{s.change}</div></div></GlassCard>; })}
          </div>
          <GlassCard className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2"><div><h3 className="font-bold text-foreground">درآمد ۷ روز گذشته</h3><p className="text-xs text-muted-foreground mt-0.5">شارژ و مصرف</p></div><div className="flex items-center gap-4 text-xs"><div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ADMIN_ACCENT }} /><span className="text-muted-foreground">شارژ</span></div><div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sky-400" /><span className="text-muted-foreground">مصرف</span></div></div></div>
            <div className="h-72 -mr-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} /><XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toLocaleString("fa-IR")}M`} /><Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", color: "#F8FAFC", fontSize: "12px" }} formatter={(v: number, n: string) => [formatToman(v), n === "deposits" ? "شارژ" : "مصرف"]} /><Line type="monotone" dataKey="deposits" stroke={ADMIN_ACCENT} strokeWidth={2.5} dot={{ fill: ADMIN_ACCENT, r: 4 }} /><Line type="monotone" dataKey="usage" stroke="#38BDF8" strokeWidth={2.5} dot={{ fill: "#38BDF8", r: 4 }} /></LineChart></ResponsiveContainer></div>
          </GlassCard>
          <div className="grid lg:grid-cols-2 gap-4">
            <GlassCard className="space-y-5"><h3 className="font-bold text-foreground">مصرف مدل‌ها</h3><div className="h-64 -mr-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={MODEL_USAGE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} /><XAxis dataKey="model" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} /><YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", color: "#F8FAFC", fontSize: "12px" }} cursor={{ fill: "rgba(245, 158, 11, 0.05)" }} formatter={(v: number) => [`${formatNumber(v)} توکن`, "مصرف"]} /><Bar dataKey="tokens" radius={[8, 8, 0, 0]} barSize={48}>{MODEL_USAGE.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar></BarChart></ResponsiveContainer></div></GlassCard>
            <GlassCard className="space-y-5"><h3 className="font-bold text-foreground">سهم مدل‌ها</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={MODEL_USAGE} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="tokens">{MODEL_USAGE.map((e, i) => <Cell key={i} fill={e.color} stroke="#0B1121" strokeWidth={2} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.95)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "12px", fontSize: "12px" }} /><Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} /></PieChart></ResponsiveContainer></div></GlassCard>
          </div>
        </>
      )}

      {tab === "models" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="font-bold text-foreground">مدیریت مدل‌ها</h3><p className="text-xs text-muted-foreground mt-0.5">{models.length.toLocaleString("fa-IR")} مدل</p></div><GlowButton variant="admin" size="sm" onClick={() => { const id = `m-${Date.now()}`; createModel({ id, name: "مدل جدید", provider: "openrouter", upstreamModelId: "", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "", capabilities: ["chat"] }); toast.success("مدل اضافه شد"); }}><Plus className="h-3.5 w-3.5" /> افزودن</GlowButton></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((m) => (
              <GlassCard key={m.id} hover className="space-y-3">
                <div className="flex items-start justify-between"><div className="font-bold text-sm text-foreground">{m.name}{m.badge && <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-400/15 text-sky-300 mr-2">{m.badge}</span>}</div><button onClick={() => { deleteModel(m.id); toast.success("حذف شد"); }} className="p-1 rounded text-muted-foreground hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></div>
                <p className="text-xs text-muted-foreground line-clamp-2">{m.description}</p>
                <div className="text-[10px] text-muted-foreground font-mono" dir="ltr">{m.upstreamModelId}</div>
                <div className="flex items-center gap-3 text-[11px]"><span>ورودی: <b className="text-foreground">{m.inputTokenPriceToman.toLocaleString("fa-IR")} ت</b></span><span>خروجی: <b className="text-foreground">{m.outputTokenPriceToman.toLocaleString("fa-IR")} ت</b></span></div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5"><button onClick={() => updateModel(m.id, { isActive: !m.isActive })} className={cn("relative h-5 w-9 rounded-full transition-colors", m.isActive ? "bg-amber-400" : "bg-zinc-700")}><span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all", m.isActive ? "right-0.5" : "right-4")} /></button><input defaultValue={m.inputTokenPriceToman} onChange={(e) => updateModel(m.id, { inputTokenPriceToman: parseInt(e.target.value) || 0 })} className="w-16 h-7 px-1 rounded bg-white/5 border border-white/10 text-xs text-foreground text-center" /></div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {tab === "agents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="font-bold text-foreground">مدیریت عامل‌ها</h3><p className="text-xs text-muted-foreground mt-0.5">{agents.length.toLocaleString("fa-IR")} عامل</p></div><GlowButton variant="admin" size="sm" onClick={() => { createAgent({ name: "عامل جدید", description: "", systemPrompt: "", icon: "Bot", isPublic: true, color: "#38BDF8", defaultModelId: models[0]?.id, temperature: 0.7, maxTokens: 4096 }); toast.success("عامل اضافه شد"); }}><Plus className="h-3.5 w-3.5" /> افزودن</GlowButton></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((a) => (
              <GlassCard key={a.id} hover className="space-y-3">
                <div className="flex items-start justify-between"><div className="flex items-center gap-2.5"><div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${a.color}22` }}><Bot className="h-5 w-5" style={{ color: a.color }} /></div><div><div className="font-bold text-sm" style={{ color: a.color }}>{a.name}</div><div className="text-[11px] text-muted-foreground">{models.find((m) => m.id === a.defaultModelId)?.name || "—"}</div></div></div><button onClick={() => { deleteAgent(a.id); toast.success("حذف شد"); }} className="p-1 rounded text-muted-foreground hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></div>
                <p className="text-xs text-muted-foreground line-clamp-2">{a.description}</p>
                <div className="rounded-lg bg-[#0A0F1E] p-2 text-[10px] text-muted-foreground max-h-20 overflow-y-auto font-mono">{a.systemPrompt}</div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5"><span className={cn("text-[10px] px-2 py-0.5 rounded font-medium", a.isPublic ? "bg-emerald-400/15 text-emerald-400" : "bg-zinc-400/15 text-zinc-400")}>{a.isPublic ? "عمومی" : "خصوصی"}</span><span className="text-[10px] text-muted-foreground">دما: {(a.temperature || 0.7).toLocaleString("fa-IR")}</span></div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {tab === "pricing" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="font-bold text-foreground">مدیریت پلن‌ها</h3><p className="text-xs text-muted-foreground mt-0.5">{pricingTiers.length.toLocaleString("fa-IR")} پلن</p></div><GlowButton variant="admin" size="sm" onClick={() => { createPricingTier({ name: "پلن جدید", description: "", monthlyPriceToman: 0, includedCredit: 0, features: [] }); toast.success("پلن اضافه شد"); }}><Plus className="h-3.5 w-3.5" /> افزودن</GlowButton></div>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingTiers.map((tier) => (
              <GlassCard key={tier.id} variant={tier.highlighted ? "gradient" : "default"} glow={tier.highlighted} className="space-y-4 relative">
                {tier.highlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 text-xs font-bold">پیشنهادی</div>}
                <div className="flex items-center justify-between"><h4 className="font-bold text-foreground">{tier.name}</h4><button onClick={() => { deletePricingTier(tier.id); toast.success("حذف شد"); }} className="p-1 rounded text-muted-foreground hover:text-red-400"><Trash2 className="h-3 w-3" /></button></div>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
                <div><div className="flex items-baseline gap-1"><span className="text-2xl font-black text-amber-300">{tier.monthlyPriceToman.toLocaleString("fa-IR")}</span><span className="text-xs text-muted-foreground">ت / ماه</span></div><p className="text-[11px] text-muted-foreground mt-1">شامل {tier.includedCredit.toLocaleString("fa-IR")} ت اعتبار</p></div>
                <ul className="space-y-1.5 text-xs">{tier.features.map((f, i) => <li key={i} className="text-muted-foreground">• {f}</li>)}</ul>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {tab === "content" && <SiteContentEditor content={siteContent} onChange={updateSiteContent} onReset={() => { resetSiteContent(); toast.success("بازگردانی شد"); }} />}

      {tab === "modules" && <ModulesAdminTab />}
      {tab === "messages" && <AdminMessagesTab />}
      {tab === "support" && <AdminSupportTab />}

      {tab === "users" && (
        <GlassCard className="!p-0 overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between"><div><h3 className="font-bold text-foreground">مدیریت کاربران</h3><p className="text-xs text-muted-foreground mt-0.5">{users.length.toLocaleString("fa-IR")} کاربر</p></div><GlowButton variant="admin" size="sm" onClick={() => { createUser({ email: `user${Date.now()}@example.com`, fullName: "کاربر جدید", mobile: "09120000000", password: "temp123" }); toast.success("کاربر اضافه شد"); }}><Plus className="h-3.5 w-3.5" /> افزودن</GlowButton></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[700px]"><thead><tr className="border-b border-white/5">{["کاربر", "ایمیل", "موجودی", "مصرف", "عضویت", "وضعیت", "عملیات"].map((h) => <th key={h} className="text-right text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>)}</tr></thead>
            <tbody>{users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/5"><td className="px-5 py-4"><div className="flex items-center gap-2.5"><div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sky-950 font-bold text-xs">{u.fullName.charAt(0)}</div><span className="font-medium text-sm text-foreground">{u.fullName}</span></div></td><td className="px-5 py-4"><code className="text-xs text-muted-foreground" dir="ltr">{u.email}</code></td><td className="px-5 py-4 text-sm text-foreground">{u.creditBalance.toLocaleString("fa-IR")} ت</td><td className="px-5 py-4 text-sm text-amber-400">{u.totalUsage.toLocaleString("fa-IR")} ت</td><td className="px-5 py-4 text-xs text-muted-foreground">{formatDate(u.createdAt)}</td><td className="px-5 py-4"><button onClick={() => updateUser(u.id, { status: u.status === "active" ? "suspended" : "active" })} className={cn("text-[11px] px-2 py-1 rounded-md font-medium", u.status === "active" ? "bg-emerald-400/15 text-emerald-400" : "bg-red-400/15 text-red-400")}>{u.status === "active" ? "فعال" : "معلق"}</button></td><td className="px-5 py-4"><div className="flex gap-1"><button onClick={() => { adjustUserBalance(u.id, 50000); toast.success("۵۰٬۰۰۰ ت اضافه شد"); }} className="p-1 rounded text-muted-foreground hover:text-emerald-400 text-xs" title="افزایش موجودی">+</button><button onClick={() => { updateUser(u.id, { isAdmin: !u.isAdmin }); toast.success(u.isAdmin ? "ادمین حذف شد" : "ادمین شد"); }} className="p-1 rounded text-muted-foreground hover:text-amber-400 text-xs" title="ادمین">{u.isAdmin ? "★" : "☆"}</button><button onClick={() => { deleteUser(u.id); toast.success("حذف شد"); }} className="p-1 rounded text-muted-foreground hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>
            ))}</tbody></table></div>
        </GlassCard>
      )}

      {tab === "system" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <GlassCard className="space-y-4"><div className="flex items-center gap-2"><Server className="h-4 w-4 text-amber-400" /><h3 className="font-bold text-foreground">وضعیت سرور</h3></div>{[{ label: "CPU", value: 32, color: ADMIN_ACCENT, icon: Cpu }, { label: "RAM", value: 58, color: "#38BDF8", icon: HardDrive }, { label: "Disk", value: 41, color: "#34D399", icon: HardDrive }].map((m) => { const Icon = m.icon; return <div key={m.label}><div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" />{m.label}</span><span className="font-bold text-foreground">{m.value.toLocaleString("fa-IR")}٪</span></div><div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${m.value}%`, backgroundColor: m.color }} /></div></div>; })}</GlassCard>
          <GlassCard className="space-y-4"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-amber-400" /><h3 className="font-bold text-foreground">سرویس‌ها</h3></div>{["API Server", "PostgreSQL", "Redis", "OpenRouter Proxy", "NextPay Gateway"].map((s) => <div key={s} className="flex items-center justify-between p-3 rounded-xl bg-white/5"><span className="text-sm text-foreground">{s}</span><span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />فعال</span></div>)}</GlassCard>
        </div>
      )}
    </div>
  );
}

function SiteContentEditor({ content, onChange, onReset }: { content: any; onChange: (p: any) => void; onReset: () => void }) {
  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between"><h3 className="font-bold text-foreground">ویرایش محتوای سایت</h3><GlowButton variant="ghost" size="sm" onClick={onReset}><RotateCcw className="h-3.5 w-3.5" /> بازگردانی</GlowButton></div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[{ k: "siteName", l: "نام سایت" }, { k: "siteTagline", l: "شعار" }, { k: "heroBadge", l: "بج Hero" }, { k: "heroTitle", l: "عنوان" }, { k: "heroTitleHighlight", l: "عنوان برجسته" }, { k: "contactEmail", l: "ایمیل تماس" }].map((f) => (
          <div key={f.k} className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">{f.l}</label><input value={content[f.k]} onChange={(e) => onChange({ [f.k]: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none" /></div>
        ))}
      </div>
      <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">زیرنویس Hero</label><textarea value={content.heroSubtitle} onChange={(e) => onChange({ heroSubtitle: e.target.value })} rows={3} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none resize-none" /></div>
    </GlassCard>
  );
}
