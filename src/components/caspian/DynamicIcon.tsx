"use client";

import {
  Scale,
  Code2,
  PenLine,
  Languages,
  Sparkles,
  Bot,
  Brain,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Scale,
  Code2,
  PenLine,
  Languages,
  Sparkles,
  Bot,
  Brain,
  Briefcase,
};

export function DynamicIcon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICON_MAP[name] || Bot;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
