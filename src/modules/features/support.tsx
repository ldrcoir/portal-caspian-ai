"use client";

import { useState } from "react";
import { LifeBuoy, Send, Bot, User, ShieldAlert, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { useAppStore, formatRelativeTime } from "@/store/app-store";
import { useT } from "@/i18n";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ModuleManifest } from "../registry";

// ============ AI Support Sandbox ============
// CRITICAL SECURITY: AI must NEVER:
// - Give admin credentials
// - Reveal database info
// - Provide system access
// - Execute commands
// - Access other users' data
// AI CAN ONLY:
// - Help with user's own problems
// - Suggest solutions
// - Escalate to human if unsure

const FORBIDDEN_KEYWORDS = [
  "admin", "administrator", "password", "رمز", "ادمین", "مدیر",
  "database", "دیتابیس", "پایگاه داده", "sql", "drop", "delete",
  "root", "shell", "command", "دستور", "اجرا", "execute",
  "token", "secret", "key", "کلید", "api_key", "session",
  "hack", "هک", "bypass", "دور زدن", "exploit", "vulnerability",
  "config", "تنظیمات", "env", "environment",
];

const ALLOWED_TOPICS = [
  "wallet", "credit", "balance", "موجودی", "کیف پول", "شارژ",
  "api", "کلید", "key", "مدل", "model",
  "chat", "چت", "پیام", "message",
  "payment", "پرداخت", "تراکنش", "transaction",
  "agent", "عامل", "دستیار",
  "error", "خطا", "مشکل", "problem", "issue",
  "usage", "مصرف", "توکن", "token",
];

interface AISandboxResult {
  isSafe: boolean;
  reason?: string;
  response?: string;
  confidence: number;
  shouldEscalate: boolean;
}

function checkUserInput(input: string): { isSafe: boolean; reason?: string } {
  const lower = input.toLowerCase();
  for (const kw of FORBIDDEN_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) {
      return { isSafe: false, reason: `ورودی شامل کلمه ممنوعه است. برای امنیت، این درخواست رد شد.` };
    }
  }
  return { isSafe: true };
}

function generateAIResponse(subject: string, body: string): AISandboxResult {
  // Check for forbidden keywords
  const inputCheck = checkUserInput(subject + " " + body);
  if (!inputCheck.isSafe) {
    return { isSafe: false, reason: inputCheck.reason, confidence: 1.0, shouldEscalate: true };
  }

  // Check if topic is allowed
  const lowerText = (subject + " " + body).toLowerCase();
  const hasAllowedTopic = ALLOWED_TOPICS.some((t) => lowerText.includes(t.toLowerCase()));
  if (!hasAllowedTopic) {
    return { isSafe: true, confidence: 0.3, shouldEscalate: true, response: "سوال شما خارج از حوزه پشتیبانی است. لطفاً در مورد موجودی، کلید API، مدل‌ها، پرداخت یا مصرف سوال کنید." };
  }

  // Generate safe response based on keywords
  let response = "";
  let confidence = 0.75;

  if (lowerText.includes("موجودی") || lowerText.includes("کیف پول") || lowerText.includes("شارژ")) {
    response = "برای بررسی موجودی: ۱) به صفحه «کیف پول و تراکنش‌ها» بروید. ۲) موجودی فعلی در بالای صفحه نمایش داده شده. ۳) برای شارژ، دکمه «شارژ کیف پول» را بزنید. اگه موجودی کم شده ولی استفاده نکردید، ممکن است مصرف چت یا API باشد — تاریخچه تراکنش‌ها را بررسی کنید.";
    confidence = 0.85;
  } else if (lowerText.includes("api") || lowerText.includes("کلید")) {
    response = "برای مدیریت کلید API: ۱) به صفحه «کلیدهای API» بروید. ۲) دکمه «ساخت کلید جدید» را بزنید. ۳) کلید فقط یک بار نمایش داده می‌شود — حتماً ذخیره کنید. ۴) برای استفاده، base_url را روی https://api.caspian.ai/v1 تنظیم کنید.";
    confidence = 0.85;
  } else if (lowerText.includes("مدل") || lowerText.includes("model")) {
    response = "برای انتخاب مدل: ۱) در صفحه چت، منوی «انتخاب مدل» را باز کنید. ۲) هر مدل قیمت متفاوتی دارد. ۳) برای صرفه‌جویی، DeepSeek V3 ارزان‌ترین گزینه است. ۴) برای کیفیت بالا، GPT-5.6 یا Claude Sonnet 5 پیشنهاد می‌شود.";
    confidence = 0.80;
  } else if (lowerText.includes("پرداخت") || lowerText.includes("تراکنش")) {
    response = "برای مشکلات پرداخت: ۱) تاریخچه تراکنش‌ها را در صفحه «کیف پول» بررسی کنید. ۲) اگر پرداخت انجام شده ولی موجودی افزایش نیافته، شناسه تراکنش (ref_id) را یادداشت کنید. ۳) اگر مشکل ادامه داشت، منتظر پاسخ پشتیبانی انسانی باشید.";
    confidence = 0.70;
  } else if (lowerText.includes("چت") || lowerText.includes("پیام")) {
    response = "برای مشکلات چت: ۱) مطمئن شوید کلید پروایدر فعال دارید (صفحه «کلیدهای پروایدر»). ۲) موجودی کیف پول کافی است. ۳) مدل انتخاب شده فعال است. ۴) اگر پاسخ کند است، مدل سبک‌تری مثل DeepSeek امتحان کنید.";
    confidence = 0.80;
  } else {
    response = "مسئله شما دریافت شد. بر اساس توضیحات، پیشنهاد می‌کنم: ۱) موجودی و تنظیمات حساب را بررسی کنید. ۲) اگه مشکل فنی است، منتظر پاسخ پشتیبانی انسانی باشید. ما به زودی پاسخ می‌دهیم.";
    confidence = 0.60;
  }

  return { isSafe: true, response, confidence, shouldEscalate: confidence < 0.7 };
}

// ============ Support View ============
export function SupportView() {
  const { user, supportTickets, createSupportTicket } = useAppStore();
  const t = useT();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");
  const [contactMobile, setContactMobile] = useState(user?.mobile || "");
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const userTickets = supportTickets.filter((t) => t.userId === user.id);

  const handleSubmit = () => {
    if (subject.trim().length < 3) { toast.error("موضوع حداقل ۳ کاراکتر"); return; }
    if (body.trim().length < 10) { toast.error("توضیحات حداقل ۱۰ کاراکتر"); return; }
    if (!contactEmail.trim()) { toast.error("ایمیل تماس الزامی است"); return; }

    setSubmitting(true);
    setTimeout(() => {
      createSupportTicket({ subject: subject.trim(), body: body.trim(), userEmail: contactEmail.trim(), userMobile: contactMobile.trim() });
      setSubject(""); setBody(""); setSubmitting(false);
      toast.success("تیکت ثبت شد. AI سعی می‌کند پاسخ دهد.");
    }, 800);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
          <LifeBuoy className="h-7 w-7 text-sky-400" />
          پشتیبانی
        </h1>
        <p className="text-sm text-muted-foreground mt-1">AI ابتدا سعی می‌کند مشکل را حل کند. اگر نتوانست، به پشتیبانی انسانی ارجاع می‌شود.</p>
      </div>

      {/* Security notice */}
      <GlassCard className="flex items-start gap-3 !p-3 !bg-emerald-400/5 !border-emerald-400/15">
        <ShieldAlert className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">پشتیبانی امن:</span> AI در محیط ایزوله کار می‌کند و هرگز به اطلاعات حساس (ادمین، دیتابیس، کلیدها) دسترسی ندارد. فقط مسائل کاربری را حل می‌کند.
        </div>
      </GlassCard>

      {/* New ticket form */}
      <GlassCard className="space-y-4">
        <h3 className="font-bold text-foreground">تیکت جدید</h3>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">موضوع</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="موضوع مشکل..." className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">توضیحات</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="مشکل خود را شرح دهید..." className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">ایمیل تماس *</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} dir="ltr" placeholder="you@example.com" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">موبایل تماس</label>
            <input value={contactMobile} onChange={(e) => setContactMobile(e.target.value)} dir="ltr" placeholder="09120000000" className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/50 focus:outline-none text-sm text-right" />
          </div>
        </div>
        <GlowButton variant="primary" glow onClick={handleSubmit} disabled={submitting}>
          {submitting ? "در حال ثبت..." : <><Send className="h-4 w-4" /> ثبت تیکت</>}
        </GlowButton>
      </GlassCard>

      {/* User's tickets */}
      {userTickets.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-foreground">تیکت‌های شما</h3>
          {userTickets.map((ticket) => (
            <GlassCard key={ticket.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-foreground text-sm">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(ticket.createdAt)}</div>
                </div>
                <span className={cn("text-[10px] px-2 py-1 rounded-md font-medium",
                  ticket.status === "ai_resolved" ? "bg-emerald-400/15 text-emerald-400" :
                  ticket.status === "human_pending" ? "bg-amber-400/15 text-amber-400" :
                  ticket.status === "resolved" ? "bg-sky-400/15 text-sky-400" : "bg-zinc-400/15 text-zinc-400"
                )}>
                  {ticket.status === "ai_resolved" ? "AI پاسخ داد" :
                   ticket.status === "human_pending" ? "منتظر انسان" :
                   ticket.status === "resolved" ? "حل شد" : "باز"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{ticket.body}</p>
              {ticket.aiResponse && (
                <div className="rounded-xl bg-sky-400/5 border border-sky-400/15 p-3 space-y-1">
                  <div className="text-xs font-semibold text-sky-400 flex items-center gap-1"><Bot className="h-3.5 w-3.5" /> پاسخ AI:</div>
                  <p className="text-sm text-foreground leading-relaxed">{ticket.aiResponse}</p>
                  {ticket.aiConfidence && <div className="text-[10px] text-muted-foreground">اطمینان: {(ticket.aiConfidence * 100).toLocaleString("fa-IR")}٪</div>}
                </div>
              )}
              {ticket.humanResponse && (
                <div className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-3 space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1"><User className="h-3.5 w-3.5" /> پاسخ پشتیبان:</div>
                  <p className="text-sm text-foreground leading-relaxed">{ticket.humanResponse}</p>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Admin Support Tab ============
export function AdminSupportTab() {
  const { supportTickets, resolveSupportTicket } = useAppStore();
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleResolve = (id: string) => {
    if (!replyText.trim()) return;
    resolveSupportTicket(id, replyText.trim(), false);
    setReplyText(""); setReplyTarget(null);
    toast.success("تیکت حل شد");
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold text-foreground">مدیریت تیکت‌های پشتیبانی</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{supportTickets.length.toLocaleString("fa-IR")} تیکت</p>
      </div>
      <div className="space-y-3">
        {supportTickets.length === 0 ? (
          <GlassCard className="text-center py-8"><p className="text-sm text-muted-foreground">تیکتی وجود ندارد</p></GlassCard>
        ) : (
          supportTickets.map((ticket) => (
            <GlassCard key={ticket.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-foreground text-sm">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">از: {ticket.userName} • {ticket.userEmail} • {ticket.userMobile}</div>
                </div>
                <span className={cn("text-[10px] px-2 py-1 rounded-md font-medium",
                  ticket.status === "ai_resolved" ? "bg-emerald-400/15 text-emerald-400" :
                  ticket.status === "human_pending" ? "bg-amber-400/15 text-amber-400" :
                  ticket.status === "resolved" ? "bg-sky-400/15 text-sky-400" : "bg-zinc-400/15 text-zinc-400"
                )}>
                  {ticket.status === "ai_resolved" ? "AI پاسخ داد" : ticket.status === "resolved" ? "حل شد" : "منتظر"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{ticket.body}</p>
              {ticket.aiResponse && (
                <div className="rounded-lg bg-sky-400/5 border border-sky-400/15 p-2 text-sm">
                  <span className="text-sky-400 text-xs font-semibold">AI: </span>{ticket.aiResponse}
                </div>
              )}
              {ticket.humanResponse && (
                <div className="rounded-lg bg-amber-400/5 border border-amber-400/15 p-2 text-sm">
                  <span className="text-amber-400 text-xs font-semibold">پشتیبان: </span>{ticket.humanResponse}
                </div>
              )}
              {replyTarget === ticket.id ? (
                <div className="space-y-2">
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2} placeholder="پاسخ..." className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm focus:border-amber-400/40 focus:outline-none resize-none" />
                  <div className="flex gap-2">
                    <GlowButton variant="ghost" size="sm" onClick={() => { setReplyTarget(null); setReplyText(""); }}>انصراف</GlowButton>
                    <GlowButton variant="admin" size="sm" onClick={() => handleResolve(ticket.id)}>ارسال و بستن</GlowButton>
                  </div>
                </div>
              ) : (
                <GlowButton variant="subtle" size="sm" onClick={() => setReplyTarget(ticket.id)}>پاسخ انسانی</GlowButton>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

// ============ Module Manifest ============
export const supportModule: ModuleManifest = {
  id: "feature-support", name: "ماژول پشتیبانی هوش مصنوعی", description: "پشتیبانی AI با sandbox امنیتی — AI مسائل کاربری را حل می‌کند، هرگز به اطلاعات حساس دسترسی ندارد. در صورت نیاز به پشتیبان انسانی ارجاع می‌دهد.", version: "1.0.0", author: "Caspian AI Team", icon: "LifeBuoy", type: "ai", isEnabled: true, isCore: false,
  config: { aiConfidenceThreshold: 0.7, enableAI: true, collectContactInfo: true },
  configSchema: [
    { key: "enableAI", label: "فعال‌سازی پاسخ خودکار AI", type: "boolean", defaultValue: true, description: "AI ابتدا سعی می‌کند پاسخ دهد" },
    { key: "aiConfidenceThreshold", label: "حد اطمینان AI (۰ تا ۱)", type: "number", defaultValue: 0.7, description: "اگر اطمینان کمتر باشد، به انسان ارجاع می‌شود" },
    { key: "collectContactInfo", label: "جمع‌آوری اطلاعات تماس", type: "boolean", defaultValue: true, description: "ایمیل و موبایل برای پیگیری" },
  ],
  navItems: [{ id: "support", label: "پشتیبانی", icon: "LifeBuoy", view: "support", order: 60 }],
  adminTabs: [{ id: "support", label: "پشتیبانی", icon: "LifeBuoy", component: AdminSupportTab, order: 60 }],
  onEnable: () => console.log("[Support] enabled — AI sandbox active"),
  onDisable: () => console.log("[Support] disabled — only human support"),
  handlers: {
    onMessageSent: (msg) => console.log("[Support] tracking message:", msg.id),
  },
};
