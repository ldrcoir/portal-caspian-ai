"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Plus,
  Search,
  Trash2,
  Bot,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  MessageSquare,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { useAppStore, formatToman, formatRelativeTime } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { DynamicIcon } from "@/components/caspian/DynamicIcon";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ChatView() {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    createConversation,
    sendMessage,
    deleteConversation,
    models,
    agents,
  } = useAppStore();

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showConvListMobile, setShowConvListMobile] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeModel = models.find((m) => m.id === activeConv?.modelId);
  const activeAgent = agents.find((a) => a.id === activeConv?.agentId);

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    const content = input.trim();
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      sendMessage(activeConv.id, content);
      setIsTyping(false);
    }, 1100);
  };

  const handleNewChat = () => {
    const id = createConversation("مکالمه جدید", "claude-sonnet-5", "kodyar");
    setShowConvListMobile(true);
    setTimeout(() => setShowConvListMobile(false), 50);
  };

  const handleCopy = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 1500);
    toast.success("متن کپی شد");
  };

  const handleSelectConv = (id: string) => {
    setActiveConversation(id);
    setShowConvListMobile(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conversations sidebar */}
      <div
        className={cn(
          "absolute lg:static inset-y-0 right-0 z-30 w-full sm:w-80 lg:w-72 shrink-0",
          "glass-strong border-l border-sky-400/10 flex flex-col",
          "transition-transform duration-300",
          showConvListMobile ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 space-y-3 border-b border-white/5">
          <GlowButton
            variant="primary"
            glow
            size="md"
            className="w-full"
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            مکالمه جدید
          </GlowButton>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی مکالمات..."
              className="w-full h-10 pr-9 pl-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-sky-400/40 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
          {filteredConvs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
              مکالمه‌ای یافت نشد
            </div>
          )}
          {filteredConvs.map((conv) => {
            const model = models.find((m) => m.id === conv.modelId);
            const agent = agents.find((a) => a.id === conv.agentId);
            const active = conv.id === activeConversationId;
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelectConv(conv.id);
                }}
                className={cn(
                  "w-full text-right p-3 rounded-xl transition-all duration-200 group relative cursor-pointer",
                  active
                    ? "bg-sky-400/15 border border-sky-400/30"
                    : "hover:bg-white/5 border border-transparent"
                )}
              >
                {active && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-l-full bg-gradient-to-b from-sky-400 to-sky-600" />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-sm font-semibold text-foreground truncate flex-1">
                    {conv.title}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                      toast.success("مکالمه حذف شد");
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {lastMsg && (
                  <div className="text-xs text-muted-foreground truncate mb-2">
                    {lastMsg.role === "user" ? "" : ""}
                    {lastMsg.content.slice(0, 60)}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  {agent && (
                    <span
                      className="px-1.5 py-0.5 rounded-md font-medium"
                      style={{
                        backgroundColor: `${agent.color}22`,
                        color: agent.color,
                      }}
                    >
                      {agent.name}
                    </span>
                  )}
                  {model && <span className="opacity-70">{model.name}</span>}
                  <span className="mr-auto">{formatRelativeTime(conv.updatedAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Chat header */}
        <div className="glass-header px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-sky-400/10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowConvListMobile(true)}
              className="lg:hidden p-2 -mr-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
              aria-label="نمایش مکالمات"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <div className="font-bold text-foreground truncate">
                {activeConv?.title || "مکالمه‌ای انتخاب نشده"}
              </div>
              {activeAgent && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: activeAgent.color }}
                  />
                  عامل: {activeAgent.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowModelMenu(!showModelMenu);
                  setShowAgentMenu(false);
                }}
                className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-sky-400/40 transition-colors text-sm flex items-center gap-2 text-foreground"
              >
                <Bot className="h-3.5 w-3.5 text-sky-400" />
                <span className="hidden sm:inline">{activeModel?.name || "انتخاب مدل"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {showModelMenu && (
                <div className="absolute left-0 top-full mt-2 w-72 glass-strong rounded-xl p-2 z-50 max-h-96 overflow-y-auto scrollbar-thin shadow-2xl">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                    انتخاب مدل هوش مصنوعی
                  </div>
                  {models.filter((m) => m.isActive).map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        if (activeConv) {
                          // update model id via createConversation replacement
                          useAppStore.setState((s) => ({
                            conversations: s.conversations.map((c) =>
                              c.id === activeConv.id ? { ...c, modelId: model.id } : c
                            ),
                          }));
                        }
                        setShowModelMenu(false);
                      }}
                      className={cn(
                        "w-full text-right p-2.5 rounded-lg hover:bg-white/5 transition-colors",
                        activeConv?.modelId === model.id && "bg-sky-400/10"
                      )}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm text-foreground">{model.name}</span>
                        {model.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-sky-400/15 text-sky-300 font-bold">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">{model.provider}</div>
                      <div className="text-[10px] text-muted-foreground">
                        ورودی: {model.inputTokenPriceToman.toLocaleString("fa-IR")} ت — خروجی: {model.outputTokenPriceToman.toLocaleString("fa-IR")} ت /۱K
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Agent selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAgentMenu(!showAgentMenu);
                  setShowModelMenu(false);
                }}
                className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-sky-400/40 transition-colors text-sm flex items-center gap-2 text-foreground"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">{activeAgent?.name || "بدون عامل"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {showAgentMenu && (
                <div className="absolute left-0 top-full mt-2 w-72 glass-strong rounded-xl p-2 z-50 max-h-96 overflow-y-auto scrollbar-thin shadow-2xl">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
                    عامل تخصصی
                  </div>
                  <button
                    onClick={() => {
                      if (activeConv) {
                        useAppStore.setState((s) => ({
                          conversations: s.conversations.map((c) =>
                            c.id === activeConv.id ? { ...c, agentId: undefined } : c
                          ),
                        }));
                      }
                      setShowAgentMenu(false);
                    }}
                    className={cn(
                      "w-full text-right p-2.5 rounded-lg hover:bg-white/5 transition-colors",
                      !activeConv?.agentId && "bg-sky-400/10"
                    )}
                  >
                    <div className="font-semibold text-sm text-foreground">بدون عامل</div>
                    <div className="text-xs text-muted-foreground">مدل خام بدون پرامپت سیستمی</div>
                  </button>
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        if (activeConv) {
                          useAppStore.setState((s) => ({
                            conversations: s.conversations.map((c) =>
                              c.id === activeConv.id ? { ...c, agentId: agent.id } : c
                            ),
                          }));
                        }
                        setShowAgentMenu(false);
                      }}
                      className={cn(
                        "w-full text-right p-2.5 rounded-lg hover:bg-white/5 transition-colors flex items-start gap-2.5",
                        activeConv?.agentId === agent.id && "bg-sky-400/10"
                      )}
                    >
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${agent.color}22` }}
                      >
                        <DynamicIcon name={agent.icon} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm" style={{ color: agent.color }}>
                          {agent.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{agent.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {(!activeConv || activeConv.messages.length === 0) && (
              <div className="text-center py-20 space-y-6">
                <div className="mx-auto h-20 w-20 rounded-3xl glass-strong flex items-center justify-center pulse-glow">
                  <Bot className="h-10 w-10 text-sky-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    شروع یک مکالمه جدید
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    از مدل‌های قدرتمند جهانی برای پاسخ به سوالات خود استفاده کنید.
                    کافی است پیام خود را در کادر زیر بنویسید.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                  {[
                    "یک برنامه تمرین هفتگی برای کاهش وزن بنویس",
                    "کد پایتون برای خواندن فایل CSV بزرگ پیشنهاد بده",
                    "ایده‌های خلاقانه برای کمپین تبلیغاتی بده",
                    "ترجمه این متن به انگلیسی: ...",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="text-right p-3 rounded-xl glass hover:border-sky-400/30 transition-colors text-sm text-muted-foreground hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeConv?.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-sky-400 to-indigo-500 text-sky-950"
                      : "glass-strong text-sky-400"
                  )}
                >
                  {msg.role === "user" ? (
                    <UserIcon className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <Bot className="h-5 w-5" strokeWidth={1.75} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={cn(
                    "flex-1 max-w-[80%]",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap",
                      msg.role === "user"
                        ? "bg-sky-500/15 text-foreground rounded-tr-sm border border-sky-400/20"
                        : "glass text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>

                  {/* Footer */}
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-3 mt-2 px-2 text-xs text-muted-foreground">
                      {msg.cost && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-400" />
                          هزینه: {formatToman(msg.cost)}
                        </span>
                      )}
                      {msg.tokenCount && (
                        <span className="opacity-70">
                          {msg.tokenCount.toLocaleString("fa-IR")} توکن
                        </span>
                      )}
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-sky-300 transition-colors"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        کپی
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 flex-row">
                <div className="h-9 w-9 rounded-xl glass-strong flex items-center justify-center text-sky-400 shrink-0">
                  <Bot className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="glass rounded-2xl rounded-tl-sm p-4 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400 typing-dot" />
                  <span
                    className="h-2 w-2 rounded-full bg-sky-400 typing-dot"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-sky-400 typing-dot"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 border-t border-sky-400/10 bg-[#0B1121]/80 backdrop-blur-md">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 glass-strong rounded-2xl p-2 focus-within:border-sky-400/40 transition-colors">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="پیام خود را بنویسید... (Enter برای ارسال)"
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground px-3 py-2.5 max-h-32 min-h-[44px]"
                style={{ height: "auto" }}
              />
              <GlowButton
                variant="primary"
                glow
                size="sm"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="!h-10 !w-10 !p-0 shrink-0"
              >
                <Send className="h-4 w-4" />
              </GlowButton>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
              <span>
                مدل: <span className="text-sky-300">{activeModel?.name || "—"}</span>
                {activeAgent && (
                  <span>
                    {" "}• عامل:{" "}
                    <span style={{ color: activeAgent.color }}>{activeAgent.name}</span>
                  </span>
                )}
              </span>
              <span>Enter برای ارسال • Shift+Enter برای خط جدید</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {showConvListMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-20"
          onClick={() => setShowConvListMobile(false)}
        />
      )}
    </div>
  );
}
