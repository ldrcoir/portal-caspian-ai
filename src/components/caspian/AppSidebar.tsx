"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  KeyRound,
  Wallet,
  Shield,
  LogOut,
  Menu,
  X,
  Droplet,
  ChevronLeft,
} from "lucide-react";
import { useAppStore, ViewKey, formatToman } from "@/store/app-store";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface NavItem {
  key: ViewKey;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "پیشخوان", icon: LayoutDashboard },
  { key: "chat", label: "چت هوشمند", icon: MessageSquare },
  { key: "api-keys", label: "کلیدهای API", icon: KeyRound },
  { key: "billing", label: "کیف پول و تراکنش‌ها", icon: Wallet },
  { key: "admin", label: "پنل مدیریت", icon: Shield, adminOnly: true },
];

export function AppSidebar() {
  const { view, setView, user, logout } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.isAdmin
  );

  const handleNavigate = (key: ViewKey) => {
    setView(key);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 glass-strong rounded-xl p-2.5 text-foreground"
        aria-label="باز کردن منو"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 right-0 z-50 lg:z-10 h-screen w-72 shrink-0",
          "glass-strong border-l border-sky-400/10 flex flex-col",
          "transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <Logo size={36} />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground p-1"
            aria-label="بستن منو"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wallet balance quick view */}
        {user && (
          <div className="mx-4 mt-4 p-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-indigo-500/5 border border-sky-400/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Wallet className="h-3.5 w-3.5" />
              موجودی کیف پول
            </div>
            <div className="text-xl font-bold text-gradient-sky">
              {formatToman(user.creditBalance)}
            </div>
            <button
              onClick={() => handleNavigate("billing")}
              className="mt-3 w-full h-8 text-xs rounded-lg bg-sky-400/15 text-sky-300 hover:bg-sky-400/25 transition-colors font-medium"
            >
              + شارژ حساب
            </button>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={cn(
                  "w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                  active
                    ? "bg-sky-400/15 text-sky-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {active && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-l-full bg-gradient-to-b from-sky-400 to-sky-600 glow-primary-sm" />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    active ? "text-sky-400" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  strokeWidth={1.75}
                />
                <span className="flex-1 text-right">{item.label}</span>
                {item.adminOnly && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-400/15 text-amber-400 font-bold">
                    ادمین
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        {user && (
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-sky-950 font-bold text-sm shrink-0">
                {user.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">
                  {user.fullName}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.email}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                aria-label="خروج"
                title="خروج از حساب"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
