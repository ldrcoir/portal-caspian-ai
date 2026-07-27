"use client";

import { useAppStore } from "@/store/app-store";
import { LandingPage } from "@/components/caspian/LandingPage";
import { AuthView } from "@/components/caspian/AuthView";
import { AppSidebar } from "@/components/caspian/AppSidebar";
import { DashboardView } from "@/components/caspian/DashboardView";
import { ChatView } from "@/components/caspian/ChatView";
import { ApiKeysView } from "@/components/caspian/ApiKeysView";
import { BillingView } from "@/components/caspian/BillingView";
import { AdminView } from "@/components/caspian/AdminView";
import { InstallView } from "@/components/caspian/InstallView";

export function AppShell() {
  const { view, user } = useAppStore();

  // Public views (no auth required)
  if (view === "landing") return <LandingPage />;
  if (view === "auth") return <AuthView />;
  if (view === "install") return <InstallView />;

  // Protected views — if no user, redirect to auth
  if (!user) return <AuthView />;

  // Chat view is full-screen (own layout)
  if (view === "chat") return <ChatView />;

  // App shell with sidebar
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        {view === "dashboard" && <DashboardView />}
        {view === "api-keys" && <ApiKeysView />}
        {view === "billing" && <BillingView />}
        {view === "admin" && (user.isAdmin ? <AdminView /> : <DashboardView />)}
      </main>
    </div>
  );
}
