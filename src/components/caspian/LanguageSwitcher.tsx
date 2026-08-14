"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n, LOCALES, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, detectFromIP, detectedLocale, hasUserChoice } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    detectFromIP();
  }, [detectFromIP]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-xl transition-colors",
          compact
            ? "h-9 px-2.5 glass hover:border-sky-400/40 text-foreground"
            : "h-10 px-3 glass hover:border-sky-400/40 text-foreground"
        )}
        aria-label="Language switcher"
      >
        <Globe className="h-4 w-4 text-sky-400" />
        <span className="text-sm font-medium">{current.flag}</span>
        {!compact && (
          <span className="text-sm font-medium hidden sm:inline">{current.nativeName}</span>
        )}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-56 glass-strong rounded-xl p-2 z-50 shadow-2xl">
          <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium border-b border-white/5 mb-1">
            {hasUserChoice ? "زبان انتخاب‌شده" : detectedLocale ? "زبان تشخیص‌ داده‌شده از IP" : "انتخاب زبان"}
          </div>
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale, true);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-right",
                locale === l.code
                  ? "bg-sky-400/15 text-sky-300"
                  : "hover:bg-white/5 text-foreground"
              )}
            >
              <span className="text-xl">{l.flag}</span>
              <div className="flex-1 text-right">
                <div className="text-sm font-semibold">{l.nativeName}</div>
                <div className="text-xs text-muted-foreground">{l.name} • {l.dir.toUpperCase()}</div>
              </div>
              {locale === l.code && <Check className="h-4 w-4 text-sky-400" />}
            </button>
          ))}
          {!hasUserChoice && detectedLocale && (
            <div className="mt-1 px-2 py-1.5 text-[10px] text-muted-foreground border-t border-white/5">
              زبان به‌صورت خودکار از موقعیت شما تشخیص داده شد. برای تغییر، روی زبان دلخواه کلیک کنید.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
