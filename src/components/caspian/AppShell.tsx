"use client";

import { useAppStore } from "@/store/app-store";
import { useModuleBootstrap } from "@/modules/bootstrap";
import { LandingPage } from "@/components/caspian/LandingPage";
import { AuthView } from "@/components/caspian/AuthView";
import { AppSidebar } from "@/components/caspian/AppSidebar";
import { DashboardView } from "@/components/caspian/DashboardView";
import { ChatView } from "@/components/caspian/ChatView";
import { ApiKeysView } from "@/components/caspian/ApiKeysView";
import { BillingView } from "@/components/caspian/BillingView";
import { AdminView } from "@/components/caspian/AdminView";
import { InstallView } from "@/components/caspian/InstallView";
import { ProviderKeysView } from "@/components/caspian/ProviderKeysView";
import { MessagesView } from "@/modules/features/messages";
import { SupportView } from "@/modules/features/support";
import { ImageGenView } from "@/modules/features/image-gen";
import { VisionView } from "@/modules/features/vision";
import { VoiceView } from "@/modules/features/voice";
import { LanguageSwitcher } from "@/components/caspian/LanguageSwitcher";

export function AppShell() {
  useModuleBootstrap();
  const { view, user } = useAppStore();

  // Public views
  if (view === "landing") return <><LandingPage /></>;
  if (view === "auth") return <AuthView />;
  if (view === "install") return <InstallView />;

  // Protected
  if (!user) return <AuthView />;
  if (view === "chat") return <ChatView />;

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        {view === "dashboard" && <DashboardView />}
        {view === "api-keys" && <ApiKeysView />}
        {view === "provider-keys" && <ProviderKeysView />}
        {view === "billing" && <BillingView />}
        {view === "messages" && <MessagesView />}
        {view === "support" && <SupportView />}
        {view === "image-gen" && <ImageGenView />}
        {view === "vision" && <VisionView />}
        {view === "voice-stt" && <VoiceView />}
        {view === "admin" && (user.isAdmin ? <AdminView /> : <DashboardView />)}
      </main>
    </div>
  );
}
