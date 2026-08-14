"use client";

import { useState } from "react";
import { Mail, Send, Inbox, Megaphone, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { useAppStore, formatRelativeTime, formatDateTime } from "@/store/app-store";
import { useT } from "@/i18n";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ModuleManifest } from "../registry";

// ============ Spam Protection ============
const MESSAGE_RATE_LIMIT = 5; // max 5 messages per 10 minutes
const MESSAGE_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 2000;

function checkSpam(messages: { createdAt: string }[], userId: string): { isSpam: boolean; reason?: string } {
  const now = Date.now();
  const recentMessages = messages.filter((m) => now - new Date(m.createdAt).getTime() < MESSAGE_COOLDOWN_MS);
  if (recentMessages.length >= MESSAGE_RATE_LIMIT) {
    return { isSpam: true, reason: `حداکثر ${MESSAGE_RATE_LIMIT} پیام در ۱۰ دقیقه مجاز است. لطفاً صبر کنید.` };
  }
  return { isSpam: false };
}

// ============ Messages View ============
export function MessagesView() {
  const { user, inboxMessages, sendMessageToAdmin, markMessageRead } = useAppStore();
  const t = useT();
  const [tab, setTab] = useState<"inbox" | "compose">("inbox");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) return null;

  const userMessages = inboxMessages.filter((m) => m.fromUserId === user.id || m.toUserId === user.id);
  const unreadCount = userMessages.filter((m) => !m.isRead && m.toUserId === user.id).length;

  const handleSend = () => {
    if (subject.trim().length < 3) { toast.error("موضوع حداقل ۳ کاراکتر باشد"); return; }
    if (body.trim().length < MIN_MESSAGE_LENGTH) { toast.error(`متن پیام حداقل ${MIN_MESSAGE_LENGTH} کاراکتر باشد`); return; }
    if (body.length > MAX_MESSAGE_LENGTH) { toast.error(`متن پیام حداکثر ${MAX_MESSAGE_LENGTH} کاراکتر`); return; }

    // Spam check
    const spamCheck = checkSpam(userMessages.filter((m) => m.fromUserId === user.id), user.id);
    if (spamCheck.isSpam) { toast.error(spamCheck.reason!); return; }

    setSending(true);
    setTimeout(() => {
      sendMessageToAdmin(subject.trim(), body.trim());
      setSubject(""); setBody(""); setSending(false); setTab("inbox");
      toast.success("پیام ارسال شد");
    }, 500);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {t("messages.title")} {unreadCount > 0 && <span className="text-sm text-sky-400">({unreadCount.toLocaleString("fa-IR")} {t("messages.unread")})</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">ارتباط با تیم پشتیبانی</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5">
          <button onClick={() => setTab("inbox")} className={cn("h-9 px-3 rounded-lg text-sm font-semibold", tab === "inbox" ? "bg-sky-400/15 text-sky-300" : "text-muted-foreground")}>
            <Inbox className="h-4 w-4 inline ml-1" /> {t("messages.inbox")}
          </button>
          <button onClick={() => setTab("compose")} className={cn("h-9 px-3 rounded-lg text-sm font-semibold", tab === "compose" ? "bg-sky-400/15 text-sky-300" : "text-muted-foreground")}>
            <Send className="h-4 w-4 inline ml-1" /> {t("messages.compose")}
          </button>
        </div>
      </div>

      {/* Spam protection notice */}
      <GlassCard className="flex items-start gap-3 !p-3 !bg-amber-400/5 !border-amber-400/15">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">محافظت اسپم:</span> حداکثر {MESSAGE_RATE_LIMIT} پیام در ۱۰ دقیقه. پیام‌ها باید بین {MIN_MESSAGE_LENGTH} تا {MAX_MESSAGE_LENGTH} کاراکتر باشند.
        </div>
      </GlassCard>

      {tab === "compose" ? (
        <GlassCard className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("messages.subject")}</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع پیام..." className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">{t("messages.message")}</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="متن پیام خود را بنویسید..." className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm resize-none" />
            <div className="text-xs text-muted-foreground text-left">{body.length.toLocaleString("fa-IR")} / {MAX_MESSAGE_LENGTH.toLocaleString("fa-IR")}</div>
          </div>
          <GlowButton variant="primary" glow onClick={handleSend} disabled={sending}>
            {sending ? "در حال ارسال..." : <><Send className="h-4 w-4" /> {t("messages.send")}</>}
          </GlowButton>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {userMessages.length === 0 ? (
            <GlassCard className="text-center py-12">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">{t("messages.noMessages")}</p>
            </GlassCard>
          ) : (
            userMessages.map((msg) => (
              <GlassCard key={msg.id} hover className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", msg.fromUserId === "admin" ? "bg-amber-400/15 text-amber-400" : "bg-sky-400/15 text-sky-400")}>
                      {msg.fromUserId === "admin" ? <Megaphone className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">{msg.subject}</div>
                      <div className="text-xs text-muted-foreground">{msg.fromUserId === "admin" ? "از ادمین" : `به ادمین`} • {formatRelativeTime(msg.createdAt)}</div>
                    </div>
                  </div>
                  {!msg.isRead && msg.toUserId === user.id && <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0" />}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{msg.body}</p>
                {msg.reply && (
                  <div className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-3 space-y-1">
                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> پاسخ ادمین:</div>
                    <p className="text-sm text-foreground leading-relaxed">{msg.reply}</p>
                  </div>
                )}
              </GlassCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ============ Admin Messages Tab ============
export function AdminMessagesTab() {
  const { inboxMessages, replyToMessage, broadcastMessage, users } = useAppStore();
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");

  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    replyToMessage(id, replyText.trim());
    setReplyText(""); setReplyTarget(null);
    toast.success("پاسخ ارسال شد");
  };

  const handleBroadcast = () => {
    if (!broadcastSubject.trim() || !broadcastBody.trim()) return;
    broadcastMessage(broadcastSubject.trim(), broadcastBody.trim());
    setBroadcastSubject(""); setBroadcastBody(""); setShowBroadcast(false);
    toast.success("اطلاع‌رسانی همگانی ارسال شد");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground">مدیریت پیام‌ها</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{inboxMessages.length.toLocaleString("fa-IR")} پیام</p>
        </div>
        <GlowButton variant="admin" size="sm" onClick={() => setShowBroadcast(!showBroadcast)}>
          <Megaphone className="h-3.5 w-3.5" /> اطلاع‌رسانی همگانی
        </GlowButton>
      </div>

      {showBroadcast && (
        <GlassCard className="space-y-3 !border-amber-400/20">
          <h4 className="font-semibold text-foreground">ارسال پیام به همه کاربران</h4>
          <input value={broadcastSubject} onChange={(e) => setBroadcastSubject(e.target.value)} placeholder="موضوع..." className="w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none" />
          <textarea value={broadcastBody} onChange={(e) => setBroadcastBody(e.target.value)} rows={3} placeholder="متن پیام..." className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none resize-none" />
          <div className="flex gap-2">
            <GlowButton variant="ghost" size="sm" onClick={() => setShowBroadcast(false)}>انصراف</GlowButton>
            <GlowButton variant="admin" size="sm" onClick={handleBroadcast}>ارسال به همه</GlowButton>
          </div>
        </GlassCard>
      )}

      <div className="space-y-3">
        {inboxMessages.length === 0 ? (
          <GlassCard className="text-center py-8"><p className="text-sm text-muted-foreground">پیامی وجود ندارد</p></GlassCard>
        ) : (
          inboxMessages.map((msg) => (
            <GlassCard key={msg.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-foreground text-sm">{msg.subject}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">از: {msg.fromUserName} • {formatDateTime(msg.createdAt)}</div>
                </div>
                {!msg.reply && <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-400">بی‌پاسخ</span>}
              </div>
              <p className="text-sm text-muted-foreground">{msg.body}</p>
              {msg.reply ? (
                <div className="rounded-lg bg-emerald-400/5 border border-emerald-400/15 p-2 text-sm">
                  <span className="text-emerald-400 text-xs font-semibold">پاسخ: </span>{msg.reply}
                </div>
              ) : replyTarget === msg.id ? (
                <div className="space-y-2">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2} placeholder="پاسخ بنویسید..." className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none resize-none" />
                  <div className="flex gap-2">
                    <GlowButton variant="ghost" size="sm" onClick={() => { setReplyTarget(null); setReplyText(""); }}>انصراف</GlowButton>
                    <GlowButton variant="admin" size="sm" onClick={() => handleReply(msg.id)}>ارسال پاسخ</GlowButton>
                  </div>
                </div>
              ) : (
                <GlowButton variant="subtle" size="sm" onClick={() => setReplyTarget(msg.id)}>پاسخ</GlowButton>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

// ============ Module Manifest ============
export const messagesModule: ModuleManifest = {
  id: "feature-messages", name: "ماژول پیام‌رسانی", description: "سیستم پیام‌رسانی بین کاربران و ادمین با محافظت اسپم و اطلاع‌رسانی همگانی.", version: "1.0.0", author: "Caspian AI Team", icon: "Mail", type: "feature", isEnabled: true, isCore: false,
  config: { rateLimit: 5, cooldownMinutes: 10 },
  configSchema: [
    { key: "rateLimit", label: "حداکثر پیام در دوره", type: "number", defaultValue: 5, description: "حداکثر تعداد پیام در دوره زمانی" },
    { key: "cooldownMinutes", label: "دوره زمانی (دقیقه)", type: "number", defaultValue: 10, description: "طول دوره برای rate limiting" },
  ],
  navItems: [{ id: "messages", labelKey: "nav.messages", label: "پیام‌ها", icon: "Mail", view: "messages", order: 50 }],
  adminTabs: [{ id: "messages", labelKey: "admin.messages", label: "پیام‌ها", icon: "Mail", component: AdminMessagesTab, order: 50 }],
  onEnable: () => console.log("[Messages] enabled"),
  onDisable: () => console.log("[Messages] disabled"),
};
