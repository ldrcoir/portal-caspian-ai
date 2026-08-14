"use client";

import { useState, useMemo } from "react";
import {
  LayoutDashboard, MessageSquare, KeyRound, Wallet, Shield, LogOut,
  Menu, X, Plug, Bot, Sparkles, Mail, LifeBuoy, Wand2, Eye, Mic,
  type LucideIcon,
} from "lucide-react";
import { useAppStore, formatToman } from "@/store/app-store";
import { useModuleRegistry, type NavItem } from "@/modules/registry";
import { useT } from "@/i18n";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, MessageSquare, KeyRound, Wallet, Shield, Plug,
  Bot, Sparkles, Mail, LifeBuoy, Wand2, Eye, Mic,
};

const CORE_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", labelKey: "nav.dashboard", label: "پیشخوان", icon: "LayoutDashboard", view: "dashboard", order: 0 },
  { id: "chat", labelKey: "nav.chat", label: "چت هوشمند", icon: "MessageSquare", view: "chat", order: 10 },
  { id: "api-keys", labelKey: "nav.apiKeys", label: "کلیدهای API", icon: "KeyRound", view: "api-keys", order: 20 },
  { id: "provider-keys", labelKey: "nav.providerKeys", label: "کلیدهای پروایدر", icon: "Plug", view: "provider-keys", order: 30 },
  { id: "billing", labelKey: "nav.billing", label: "کیف پول", icon: "Wallet", view: "billing", order: 40 },
  { id: "admin", labelKey: "nav.admin", label: "پنل مدیریت", icon: "Shield", view: "admin", order: 100, adminOnly: true },
];

export function AppSidebar() {
  const { view, setView, user, logout } = useAppStore();
  const modules = useModuleRegistry((s) => s.modules);
  const moduleOrder = useModuleRegistry((s) => s.moduleOrder);
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);

  const moduleNavItems = useMemo(() => {
    const items: NavItem[] = [];
    for (const id of moduleOrder) {
      const mod = modules[id];
      if (mod?.isEnabled && mod.navItems) items.push(...mod.navItems);
    }
    return items;
  }, [modules, moduleOrder]);

  const allNavItems = [...CORE_NAV_ITEMS, ...moduleNavItems]
    .filter((item) => !item.adminOnly || user?.isAdmin)
    .sort((a, b) => a.order - b.order);

  const handleNavigate = (key: string) => { setView(key as any); setMobileOpen(false); };

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 right-4 z-40 glass-strong rounded-xl p-2.5 text-foreground" aria-label="منو">
        <Menu className="h-5 w-5" />
      </button>
      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("fixed lg:sticky top-0 right-0 z-50 lg:z-10 h-screen w-72 shrink-0 glass-strong border-l border-sky-400/10 flex flex-col transition-transform duration-300 lg:translate-x-0", mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0")}>
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <Logo size={36} />
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <button onClick={() => setMobileOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground p-1"><X className="h-5 w-5" /></button>
          </div>
        </div>
        {user && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-indigo-500/5 border border-sky-400/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1"><Wallet className="h-3.5 w-3.5" /> {t("dashboard.walletBalance")}</div>
            <div className="text-xl font-bold text-gradient-sky">{formatToman(user.creditBalance)}</div>
            <button onClick={() => handleNavigate("billing")} className="mt-3 w-full h-8 text-xs rounded-lg bg-sky-400/15 text-sky-300 hover:bg-sky-400/25 transition-colors font-medium">{t("dashboard.chargeWallet")}</button>
          </div>
        )}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {allNavItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || Sparkles;
            const active = view === item.view;
            return (
              <button key={`${item.id}-${item.view}`} onClick={() => handleNavigate(item.view)} className={cn("w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative", active ? "bg-sky-400/15 text-sky-300" : "text-muted-foreground hover:text-foreground hover:bg-white/5")}>
                {active && <span className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-l-full bg-gradient-to-b from-sky-400 to-sky-600 glow-primary-sm" />}
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-sky-400" : "text-muted-foreground group-hover:text-foreground")} strokeWidth={1.75} />
                <span className="flex-1 text-right">{item.labelKey ? t(item.labelKey) : item.label}</span>
                {item.badge && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-400/15 text-purple-400 font-bold">{item.badge}</span>}
                {item.adminOnly && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-400 font-bold">ادمین</span>}
              </button>
            );
          })}
        </nav>
        {user && (
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sky-950 font-bold text-sm shrink-0">{user.fullName.charAt(0)}</div>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-foreground truncate">{user.fullName}</div><div className="text-xs text-muted-foreground truncate">{user.email}</div></div>
              <button onClick={logout} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors" aria-label="خروج"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
