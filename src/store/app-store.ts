import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ Types ============
export type ViewKey =
  | "landing" | "auth" | "dashboard" | "chat" | "api-keys" | "provider-keys"
  | "billing" | "admin" | "install" | "messages" | "image-gen" | "vision"
  | "voice-stt" | "voice-tts" | "support" | "analytics";

export interface User {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  isAdmin: boolean;
  creditBalance: number;
  status: "active" | "suspended";
  createdAt: string;
  totalUsage: number;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  fullKey?: string;
  isEnabled: boolean;
  createdAt: string;
  lastUsedAt?: string;
  allowedModelIds?: string[];
  monthlyCapToman?: number;
}

export type ProviderType = "openrouter" | "openai" | "anthropic" | "google" | "azure" | "custom" | "caspian";

export interface ProviderKey {
  id: string;
  name: string;
  provider: ProviderType;
  apiKey: string;
  baseUrl?: string;
  isEnabled: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export const PROVIDERS = [
  { type: "openrouter" as const, label: "OpenRouter", defaultBaseUrl: "https://openrouter.ai/api/v1", docsUrl: "https://openrouter.ai/keys", description: "دسترسی به همه مدل‌های جهانی", color: "#8B5CF6" },
  { type: "openai" as const, label: "OpenAI", defaultBaseUrl: "https://api.openai.com/v1", docsUrl: "https://platform.openai.com/api-keys", description: "اتصال مستقیم به OpenAI", color: "#10A37F" },
  { type: "anthropic" as const, label: "Anthropic", defaultBaseUrl: "https://api.anthropic.com/v1", docsUrl: "https://console.anthropic.com/settings/keys", description: "اتصال مستقیم به Claude", color: "#D97757" },
  { type: "google" as const, label: "Google AI", defaultBaseUrl: "https://generativelanguage.googleapis.com/v1", docsUrl: "https://aistudio.google.com/apikey", description: "اتصال مستقیم به Gemini", color: "#4285F4" },
  { type: "azure" as const, label: "Azure OpenAI", defaultBaseUrl: "", docsUrl: "https://portal.azure.com", description: "Azure OpenAI Service", color: "#0078D4" },
  { type: "custom" as const, label: "سفارشی", defaultBaseUrl: "", docsUrl: "#", description: "هر endpoint سازگار با OpenAI", color: "#94A3B8" },
  { type: "caspian" as const, label: "کاسپین (مغز خودمان)", defaultBaseUrl: "http://127.0.0.1:8585/v1", docsUrl: "#", description: "مغز محلی کاسپین — بدون سرویس بیرونی، بدون کلیدِ خارجی", color: "#F4A300" },
];

export interface Transaction {
  id: string;
  type: "deposit" | "usage" | "refund";
  amount: number;
  balanceAfter: number;
  description: string;
  refId?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokenCount?: number;
  cost?: number;
  modelId?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  agentId?: string;
  providerKeyId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: ProviderType;
  upstreamModelId: string;
  inputTokenPriceToman: number;
  outputTokenPriceToman: number;
  isActive: boolean;
  description: string;
  badge?: string;
  contextWindow?: number;
  capabilities?: string[];
  pinnedProviderKeyId?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
  isPublic: boolean;
  color: string;
  defaultModelId?: string;
  providerKeyId?: string;
  temperature?: number;
  maxTokens?: number;
  createdAt: string;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPriceToman: number;
  includedCredit: number;
  features: string[];
  highlighted?: boolean;
}

export interface InboxMessage {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string; // "admin" for admin messages
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  reply?: string;
  replyAt?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userMobile: string;
  subject: string;
  body: string;
  status: "open" | "ai_resolved" | "human_pending" | "resolved" | "closed";
  aiResponse?: string;
  aiConfidence?: number;
  humanResponse?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ImageGeneration {
  id: string;
  userId: string;
  prompt: string;
  modelId: string;
  size: string;
  quality: string;
  imageUrl: string;
  cost: number;
  createdAt: string;
}

export interface VisionAnalysis {
  id: string;
  userId: string;
  imageData: string; // base64 or URL
  question: string;
  modelId: string;
  answer: string;
  cost: number;
  createdAt: string;
}

export interface VoiceTranscription {
  id: string;
  userId: string;
  audioFileName: string;
  transcript: string;
  modelId: string;
  duration: number;
  cost: number;
  createdAt: string;
}

export interface SiteContent {
  siteName: string;
  siteTagline: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaSecondary: string;
  signupBonusToman: number;
  features: { id: string; icon: string; title: string; description: string; color: string }[];
  trustedBrands: string[];
  modelsSectionTitle: string;
  modelsSectionSubtitle: string;
  agentsSectionTitle: string;
  agentsSectionSubtitle: string;
  pricingSectionTitle: string;
  pricingSectionSubtitle: string;
  testimonial: { id: string; quote: string; authorName: string; authorRole: string };
  ctaTitle: string;
  ctaSubtitle: string;
  footerDescription: string;
  contactEmail: string;
  socialLinks: { twitter?: string; github?: string; telegram?: string };
}

// ============ Default data ============
const DEFAULT_SITE_CONTENT: SiteContent = {
  siteName: "کاسپین AI",
  siteTagline: "هوش مصنوعی، عمیق و شفاف",
  heroBadge: "پلتفرم هوش مصنوعی نسل جدید برای ایران",
  heroTitle: "کاسپین AI",
  heroTitleHighlight: "هوش مصنوعی، عمیق و شفاف",
  heroSubtitle: "به قدرتمندترین مدل‌های هوش مصنوعی جهان با شفافیت کامل قیمت و کیف پول تومانی دسترسی داشته باشید.",
  heroCtaText: "شروع رایگان با ۲۰٬۰۰۰ تومان اعتبار",
  heroCtaSecondary: "نصب روی سرور خودتان",
  signupBonusToman: 20000,
  features: [
    { id: "f1", icon: "Clock", title: "بدون تاریخ انقضا", description: "اعتبار شارژ شده هرگز منقضی نمی‌شود.", color: "sky" },
    { id: "f2", icon: "Globe2", title: "مدل‌های متنوع جهانی", description: "دسترسی به GPT، Claude، Gemini و ده‌ها مدل دیگر.", color: "indigo" },
    { id: "f3", icon: "ShieldCheck", title: "درگاه پرداخت امن", description: "پرداخت از طریق درگاه‌های معتبر ایرانی.", color: "emerald" },
    { id: "f4", icon: "CreditCard", title: "شفافیت کامل قیمت", description: "قیمت دقیق هر توکن پیش از ارسال نمایش داده می‌شود.", color: "amber" },
  ],
  trustedBrands: ["دیجی‌کالا", "اسنپ", "تپسی", "باسلام", "کافه‌بازار", "آپارات"],
  modelsSectionTitle: "یک API، ده‌ها مدل",
  modelsSectionSubtitle: "بهترین مدل‌های هوش مصنوعی جهان با قیمت‌گذاری شفاف تومانی.",
  agentsSectionTitle: "دستیارهای آماده برای هر کار",
  agentsSectionSubtitle: "عامل‌های از پیش تنظیم شده با پرامپت سیستم تخصصی.",
  pricingSectionTitle: "پلن مناسب خودتان را انتخاب کنید",
  pricingSectionSubtitle: "فقط برای آنچه استفاده می‌کنید پرداخت می‌کنید.",
  testimonial: { id: "t1", quote: "کاسپین AI به تیم ما اجازه داد بدون دردسرهای کارت بانکی خارجی از هوش مصنوعی استفاده کنیم.", authorName: "مهسا کریمی", authorRole: "مدیر محصول، فین‌تک" },
  ctaTitle: "همین امروز شروع کنید",
  ctaSubtitle: "با ثبت‌نام، ۲۰٬۰۰۰ تومان اعتبار رایگان دریافت کنید.",
  footerDescription: "پلتفرم هوش مصنوعی کاسپین — ساخته شده برای کاربران ایرانی.",
  contactEmail: "support@caspian.ai",
  socialLinks: { twitter: "#", github: "#", telegram: "#" },
};

const DEFAULT_MODELS: AIModel[] = [
  { id: "caspian-fanus", name: "فانوس (کاسپین)", provider: "caspian", upstreamModelId: "caspian-fanus-sparse", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "مغز خودمان — اسپارس، روی پردازنده معمولی", badge: "کاسپین", contextWindow: 4096, capabilities: ["chat"] },
  { id: "caspian-chat", name: "کاسپین گفت‌وگو", provider: "caspian", upstreamModelId: "caspian-chat-v0.4.1", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "مدل گفت‌وگوی فارسی خودمان — دانش در وزن‌ها", badge: "محلی", contextWindow: 4096, capabilities: ["chat"] },
  { id: "gpt-5.6", name: "GPT-5.6", provider: "openrouter", upstreamModelId: "openai/gpt-5.6", inputTokenPriceToman: 18, outputTokenPriceToman: 72, isActive: true, description: "قدرتمندترین مدل OpenAI", badge: "محبوب", contextWindow: 256000, capabilities: ["chat", "vision", "tools"] },
  { id: "claude-sonnet-5", name: "Claude Sonnet 5", provider: "openrouter", upstreamModelId: "anthropic/claude-sonnet-5", inputTokenPriceToman: 22, outputTokenPriceToman: 110, isActive: true, description: "بهترین تعادل کیفیت و سرعت", badge: "پیشنهادی", contextWindow: 200000, capabilities: ["chat", "vision", "tools"] },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "openrouter", upstreamModelId: "google/gemini-2.5-pro", inputTokenPriceToman: 16, outputTokenPriceToman: 64, isActive: true, description: "مدل چندوجهی گوگل", contextWindow: 2000000, capabilities: ["chat", "vision", "tools"] },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "openrouter", upstreamModelId: "deepseek/deepseek-chat", inputTokenPriceToman: 4, outputTokenPriceToman: 12, isActive: true, description: "اقتصادی و قدرتمند", badge: "ارزان", contextWindow: 64000, capabilities: ["chat", "tools"] },
  { id: "llama-3.3-70b", name: "Llama 3.3 70B", provider: "openrouter", upstreamModelId: "meta-llama/llama-3.3-70b-instruct", inputTokenPriceToman: 6, outputTokenPriceToman: 20, isActive: true, description: "مدل متن‌باز متا", contextWindow: 128000, capabilities: ["chat"] },
  { id: "dall-e-3", name: "DALL-E 3", provider: "openai", upstreamModelId: "dall-e-3", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "تصویرساز OpenAI", badge: "تصویر", capabilities: ["image"] },
  { id: "stable-diffusion-xl", name: "Stable Diffusion XL", provider: "custom", upstreamModelId: "stability-ai/sdxl", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "تصویرساز متن‌باز", capabilities: ["image"] },
  { id: "whisper-1", name: "Whisper", provider: "openai", upstreamModelId: "whisper-1", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "صدا به متن", capabilities: ["stt"] },
  { id: "tts-1", name: "TTS-1", provider: "openai", upstreamModelId: "tts-1", inputTokenPriceToman: 0, outputTokenPriceToman: 0, isActive: true, description: "متن به صدا", capabilities: ["tts"] },
];

const DEFAULT_AGENTS: Agent[] = [
  { id: "vakilyar", name: "وکیل‌یار", description: "دستیار حقوقی هوشمند", systemPrompt: "تو یک دستیار حقوقی متخصص در قوانین ایران هستی.", icon: "Scale", isPublic: true, color: "#38BDF8", defaultModelId: "gpt-5.6", temperature: 0.3, maxTokens: 4096, createdAt: "2025-05-10T08:00:00Z" },
  { id: "kodyar", name: "کدیار", description: "برنامه‌نویس حرفه‌ای", systemPrompt: "تو یک مهندس نرم‌افزار ارشد هستی.", icon: "Code2", isPublic: true, color: "#34D399", defaultModelId: "claude-sonnet-5", temperature: 0.2, maxTokens: 8192, createdAt: "2025-05-10T08:00:00Z" },
  { id: "mohtavayar", name: "محتوایار", description: "تولید محتوای متنی و سئو", systemPrompt: "تو یک متخصص تولید محتوا هستی.", icon: "PenLine", isPublic: true, color: "#FBBF24", defaultModelId: "gpt-5.6", temperature: 0.8, maxTokens: 4096, createdAt: "2025-05-10T08:00:00Z" },
];

const DEFAULT_USER: User = { id: "u-1001", email: "demo@caspian.ai", fullName: "کاربر نمونه", mobile: "09120000000", isAdmin: true, creditBalance: 245000, status: "active", createdAt: "2025-06-12T10:30:00Z", totalUsage: 9320 };

const DEFAULT_USERS: User[] = [
  DEFAULT_USER,
  { id: "u-1002", email: "ali@example.com", fullName: "علی رضایی", mobile: "09121111111", isAdmin: false, creditBalance: 89000, status: "active", createdAt: "2025-07-01T08:00:00Z", totalUsage: 1820000 },
  { id: "u-1003", email: "mahsa@example.com", fullName: "مهسا کریمی", mobile: "09122222222", isAdmin: false, creditBalance: 510000, status: "active", createdAt: "2025-06-15T10:00:00Z", totalUsage: 2340000 },
  { id: "u-1004", email: "hossein@example.com", fullName: "حسین موسوی", mobile: "09123333333", isAdmin: false, creditBalance: 0, status: "suspended", createdAt: "2025-05-20T11:00:00Z", totalUsage: 540000 },
];

const DEFAULT_API_KEYS: ApiKey[] = [
  { id: "k-1", name: "تولید اپ پروداکشن", prefix: "csk-7f3a", isEnabled: true, createdAt: "2025-07-01T08:00:00Z", lastUsedAt: "2026-07-27T01:14:00Z", allowedModelIds: [], monthlyCapToman: 0 },
  { id: "k-2", name: "محیط تست", prefix: "csk-2b8c", isEnabled: true, createdAt: "2025-07-15T14:20:00Z", lastUsedAt: "2026-07-26T19:42:00Z", allowedModelIds: ["gpt-5.6"], monthlyCapToman: 50000 },
];

const DEFAULT_PROVIDER_KEYS: ProviderKey[] = [
  { id: "pk-1", name: "OpenRouter اصلی", provider: "openrouter", apiKey: "sk-or-v1-xxxxxxxxxxxx", baseUrl: "https://openrouter.ai/api/v1", isEnabled: true, createdAt: "2025-06-15T10:00:00Z", lastUsedAt: "2026-07-27T01:14:00Z" },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: "t-1", type: "deposit", amount: 100000, balanceAfter: 245000, description: "شارژ کیف پول - نکست‌پی", refId: "np-8723492", createdAt: "2026-07-26T09:15:00Z" },
  { id: "t-2", type: "usage", amount: 4820, balanceAfter: 145000, description: "مصرف API — GPT-5.6", refId: "req-a92f", createdAt: "2026-07-26T11:32:00Z" },
  { id: "t-3", type: "usage", amount: 1240, balanceAfter: 140180, description: "مصرف چت — Claude Sonnet 5", refId: "req-b71c", createdAt: "2026-07-26T14:05:00Z" },
  { id: "t-4", type: "deposit", amount: 50000, balanceAfter: 190180, description: "شارژ کیف پول - نکست‌پی", refId: "np-8725104", createdAt: "2026-07-25T18:40:00Z" },
  { id: "t-5", type: "usage", amount: 3260, balanceAfter: 140180, description: "مصرف API — DeepSeek V3", refId: "req-c03d", createdAt: "2026-07-25T20:11:00Z" },
];

const DEFAULT_CONVERSATIONS: Conversation[] = [
  { id: "c-1", title: "طراحی معماری پلتفرم SaaS", modelId: "claude-sonnet-5", agentId: "kodyar", createdAt: "2026-07-26T10:00:00Z", updatedAt: "2026-07-26T11:30:00Z", messages: [
    { id: "m-1", role: "user", content: "سلام، می‌خوام یک پلتفرم SaaS بسازم. معماری کلی رو پیشنهاد بده.", createdAt: "2026-07-26T10:00:00Z" },
    { id: "m-2", role: "assistant", content: "سلام! معماری پیشنهادی شامل لایه‌های Gateway، برنامه، داده و مانیتورینگ است.", tokenCount: 312, cost: 540, modelId: "claude-sonnet-5", createdAt: "2026-07-26T10:01:00Z" },
  ]},
];

const DEFAULT_PRICING: PricingTier[] = [
  { id: "free", name: "رایگان", description: "برای آشنایی", monthlyPriceToman: 0, includedCredit: 20000, features: ["۲۰٬۰۰۰ تومان اعطار هدیه", "دسترسی به همه مدل‌ها", "۱ کلید API"] },
  { id: "pro", name: "حرفه‌ای", description: "برای کسب‌وکار", monthlyPriceToman: 290000, includedCredit: 350000, features: ["۳۵۰٬۰۰۰ تومان اعتبار", "۱۰ کلید API", "نرخ ارزان‌تر", "پشتیبانی ۲۴/۷"], highlighted: true },
  { id: "enterprise", name: "سازمانی", description: "برای تیم‌ها", monthlyPriceToman: 990000, includedCredit: 1500000, features: ["۱٬۵۰۰٬۰۰۰ تومان اعتبار", "کلید نامحدود", "SLA ۹۹.۹٪", "مدیر اختصاصی"] },
];

// ============ Store ============
interface AppState {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (data: { email: string; password: string; fullName: string; mobile: string }) => boolean;
  logout: () => void;

  models: AIModel[];
  agents: Agent[];
  apiKeys: ApiKey[];
  providerKeys: ProviderKey[];
  transactions: Transaction[];
  conversations: Conversation[];
  pricingTiers: PricingTier[];
  siteContent: SiteContent;
  inboxMessages: InboxMessage[];
  supportTickets: SupportTicket[];
  imageGenerations: ImageGeneration[];
  visionAnalyses: VisionAnalysis[];
  voiceTranscriptions: VoiceTranscription[];

  // Chat
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  createConversation: (title: string, modelId: string, agentId?: string, providerKeyId?: string) => string;
  sendMessage: (conversationId: string, content: string) => void;
  deleteConversation: (id: string) => void;

  // API Keys
  createApiKey: (name: string, allowedModelIds?: string[], monthlyCapToman?: number) => ApiKey;
  toggleApiKey: (id: string) => void;
  deleteApiKey: (id: string) => void;

  // Provider Keys
  createProviderKey: (data: Omit<ProviderKey, "id" | "createdAt" | "lastUsedAt">) => ProviderKey;
  updateProviderKey: (id: string, patch: Partial<ProviderKey>) => void;
  toggleProviderKey: (id: string) => void;
  deleteProviderKey: (id: string) => void;

  // Billing
  depositViaNextPay: (amountToman: number) => { redirectUrl: string; transId: string };
  verifyNextPayCallback: (transId: string, amount: number) => boolean;

  // Admin: Models
  createModel: (data: Omit<AIModel, "id">) => void;
  updateModel: (id: string, patch: Partial<AIModel>) => void;
  deleteModel: (id: string) => void;

  // Admin: Agents
  createAgent: (data: Omit<Agent, "id" | "createdAt">) => void;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  // Admin: Users
  createUser: (data: { email: string; fullName: string; mobile: string; password: string; isAdmin?: boolean }) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  deleteUser: (id: string) => void;
  adjustUserBalance: (id: string, amount: number) => void;

  // Admin: Pricing
  createPricingTier: (data: Omit<PricingTier, "id">) => void;
  updatePricingTier: (id: string, patch: Partial<PricingTier>) => void;
  deletePricingTier: (id: string) => void;

  // Admin: Content
  updateSiteContent: (patch: Partial<SiteContent>) => void;
  resetSiteContent: () => void;

  // Messages
  sendMessageToAdmin: (subject: string, body: string) => void;
  replyToMessage: (messageId: string, reply: string) => void;
  markMessageRead: (id: string) => void;
  broadcastMessage: (subject: string, body: string) => void;

  // Support
  createSupportTicket: (data: { subject: string; body: string; userEmail: string; userMobile: string }) => void;
  resolveSupportTicket: (id: string, response: string, byAI: boolean) => void;

  // Image Gen
  addImageGeneration: (data: Omit<ImageGeneration, "id" | "createdAt">) => void;

  // Vision
  addVisionAnalysis: (data: Omit<VisionAnalysis, "id" | "createdAt">) => void;

  // Voice
  addVoiceTranscription: (data: Omit<VoiceTranscription, "id" | "createdAt">) => void;

  isInstalled: boolean;
  markInstalled: () => void;
}

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

const ASSISTANT_REPLIES = [
  "البته! این یک پاسخ نمونه است. در محیط واقعی، پاسخ از طریق پروکسی OpenRouter تولید می‌شود و هزینه از کیف پول کسر می‌گردد.",
  "سوال خوبی است. بسته به مدل انتخاب‌شده، کیفیت و سرعت پاسخ متفاوت است.",
  "برای این درخواست، چند رویکرد وجود دارد. اجازه بده مرحله به مرحله بررسی کنیم.",
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "landing",
      setView: (v) => set({ view: v }),
      user: null,
      users: DEFAULT_USERS,
      login: (email) => {
        const isAdmin = email.toLowerCase().includes("admin") || email === "demo@caspian.ai";
        const existingUser = get().users.find((u) => u.email === email);
        const user = existingUser || { ...DEFAULT_USER, email, isAdmin };
        set({ user, view: "dashboard" });
        return true;
      },
      register: ({ email, fullName, mobile }) => {
        const bonus = get().siteContent.signupBonusToman;
        const newUser: User = { id: uid("u"), email, fullName, mobile, isAdmin: false, creditBalance: bonus, status: "active", createdAt: new Date().toISOString(), totalUsage: 0 };
        set((s) => ({ user: newUser, users: [newUser, ...s.users], view: "dashboard" }));
        return true;
      },
      logout: () => set({ user: null, view: "landing" }),

      models: DEFAULT_MODELS,
      agents: DEFAULT_AGENTS,
      apiKeys: DEFAULT_API_KEYS,
      providerKeys: DEFAULT_PROVIDER_KEYS,
      transactions: DEFAULT_TRANSACTIONS,
      conversations: DEFAULT_CONVERSATIONS,
      pricingTiers: DEFAULT_PRICING,
      siteContent: DEFAULT_SITE_CONTENT,
      inboxMessages: [],
      supportTickets: [],
      imageGenerations: [],
      visionAnalyses: [],
      voiceTranscriptions: [],

      activeConversationId: "c-1",
      setActiveConversation: (id) => set({ activeConversationId: id }),

      createConversation: (title, modelId, agentId, providerKeyId) => {
        const id = uid("c");
        const now = new Date().toISOString();
        const conv: Conversation = { id, title, modelId, agentId, providerKeyId, messages: [], createdAt: now, updatedAt: now };
        set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: id }));
        return id;
      },

      sendMessage: (conversationId, content) => {
        const state = get();
        const conv = state.conversations.find((c) => c.id === conversationId);
        if (!conv) return;
        const model = state.models.find((m) => m.id === conv.modelId);
        const agent = state.agents.find((a) => a.id === conv.agentId);
        const now = new Date().toISOString();
        const inputTokens = Math.ceil(content.length / 3);
        const reply = ASSISTANT_REPLIES[Math.floor(Math.random() * ASSISTANT_REPLIES.length)];
        const outputTokens = Math.ceil(reply.length / 3);
        const cost = Math.round((inputTokens / 1000) * (model?.inputTokenPriceToman || 0) + (outputTokens / 1000) * (model?.outputTokenPriceToman || 0));
        set((s) => ({
          conversations: s.conversations.map((c) => c.id === conversationId ? { ...c, messages: [...c.messages, { id: uid("m"), role: "user", content, createdAt: now }, { id: uid("m"), role: "assistant", content: reply, tokenCount: inputTokens + outputTokens, cost, modelId: conv.modelId, createdAt: new Date(Date.now() + 1200).toISOString() }], updatedAt: now, title: c.messages.length === 0 ? content.slice(0, 40) : c.title } : c),
        }));
        if (cost > 0 && state.user) {
          set((s) => ({ user: s.user ? { ...s.user, creditBalance: Math.max(0, s.user.creditBalance - cost) } : null, transactions: [{ id: uid("t"), type: "usage", amount: cost, balanceAfter: (state.user?.creditBalance || 0) - cost, description: `مصرف چت — ${model?.name || ""}${agent ? ` (${agent.name})` : ""}`, refId: uid("req"), createdAt: now }, ...s.transactions] }));
        }
      },

      deleteConversation: (id) => set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id), activeConversationId: s.activeConversationId === id ? s.conversations[0]?.id || null : s.activeConversationId })),

      createApiKey: (name, allowedModelIds = [], monthlyCapToman = 0) => {
        const fullKey = `csk-${Math.random().toString(36).slice(2, 36)}`;
        const apiKey: ApiKey = { id: uid("k"), name, prefix: fullKey.slice(0, 8), fullKey, isEnabled: true, createdAt: new Date().toISOString(), allowedModelIds, monthlyCapToman };
        set((s) => ({ apiKeys: [apiKey, ...s.apiKeys] }));
        return apiKey;
      },
      toggleApiKey: (id) => set((s) => ({ apiKeys: s.apiKeys.map((k) => k.id === id ? { ...k, isEnabled: !k.isEnabled } : k) })),
      deleteApiKey: (id) => set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),

      createProviderKey: (data) => {
        const pk: ProviderKey = { ...data, id: uid("pk"), createdAt: new Date().toISOString() };
        set((s) => ({ providerKeys: [pk, ...s.providerKeys] }));
        return pk;
      },
      updateProviderKey: (id, patch) => set((s) => ({ providerKeys: s.providerKeys.map((k) => k.id === id ? { ...k, ...patch } : k) })),
      toggleProviderKey: (id) => set((s) => ({ providerKeys: s.providerKeys.map((k) => k.id === id ? { ...k, isEnabled: !k.isEnabled } : k) })),
      deleteProviderKey: (id) => set((s) => ({ providerKeys: s.providerKeys.filter((k) => k.id !== id) })),

      depositViaNextPay: (amountToman) => {
        const transId = `np-${Math.floor(Math.random() * 9000000) + 1000000}`;
        return { redirectUrl: `https://api.nextpay.org/gateway/payment/${transId}`, transId };
      },
      verifyNextPayCallback: (transId, amount) => {
        const now = new Date().toISOString();
        set((s) => ({ user: s.user ? { ...s.user, creditBalance: s.user.creditBalance + amount } : null, transactions: [{ id: uid("t"), type: "deposit", amount, balanceAfter: (s.user?.creditBalance || 0) + amount, description: "شارژ کیف پول - نکست‌پی", refId: transId, createdAt: now }, ...s.transactions] }));
        return true;
      },

      createModel: (data) => set((s) => ({ models: [...s.models, { ...data, id: uid("m") }] })),
      updateModel: (id, patch) => set((s) => ({ models: s.models.map((m) => m.id === id ? { ...m, ...patch } : m) })),
      deleteModel: (id) => set((s) => ({ models: s.models.filter((m) => m.id !== id) })),

      createAgent: (data) => set((s) => ({ agents: [...s.agents, { ...data, id: uid("a"), createdAt: new Date().toISOString() }] })),
      updateAgent: (id, patch) => set((s) => ({ agents: s.agents.map((a) => a.id === id ? { ...a, ...patch } : a) })),
      deleteAgent: (id) => set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),

      createUser: (data) => set((s) => ({ users: [{ id: uid("u"), email: data.email, fullName: data.fullName, mobile: data.mobile, isAdmin: data.isAdmin || false, creditBalance: 0, status: "active", createdAt: new Date().toISOString(), totalUsage: 0 }, ...s.users] })),
      updateUser: (id, patch) => set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, ...patch } : u) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
      adjustUserBalance: (id, amount) => set((s) => ({ users: s.users.map((u) => u.id === id ? { ...u, creditBalance: u.creditBalance + amount } : u) })),

      createPricingTier: (data) => set((s) => ({ pricingTiers: [...s.pricingTiers, { ...data, id: uid("p") }] })),
      updatePricingTier: (id, patch) => set((s) => ({ pricingTiers: s.pricingTiers.map((t) => t.id === id ? { ...t, ...patch } : t) })),
      deletePricingTier: (id) => set((s) => ({ pricingTiers: s.pricingTiers.filter((t) => t.id !== id) })),

      updateSiteContent: (patch) => set((s) => ({ siteContent: { ...s.siteContent, ...patch } })),
      resetSiteContent: () => set({ siteContent: DEFAULT_SITE_CONTENT }),

      sendMessageToAdmin: (subject, body) => {
        if (!get().user) return;
        const u = get().user!;
        const msg: InboxMessage = { id: uid("msg"), fromUserId: u.id, fromUserName: u.fullName, toUserId: "admin", subject, body, isRead: false, createdAt: new Date().toISOString() };
        set((s) => ({ inboxMessages: [msg, ...s.inboxMessages] }));
      },
      replyToMessage: (messageId, reply) => set((s) => ({ inboxMessages: s.inboxMessages.map((m) => m.id === messageId ? { ...m, reply, replyAt: new Date().toISOString(), isRead: true } : m) })),
      markMessageRead: (id) => set((s) => ({ inboxMessages: s.inboxMessages.map((m) => m.id === id ? { ...m, isRead: true } : m) })),
      broadcastMessage: (subject, body) => {
        const now = new Date().toISOString();
        const msgs = get().users.map((u) => ({ id: uid("msg"), fromUserId: "admin", fromUserName: "ادمین", toUserId: u.id, subject, body, isRead: false, createdAt: now }));
        set((s) => ({ inboxMessages: [...msgs, ...s.inboxMessages] }));
      },

      createSupportTicket: (data) => {
        if (!get().user) return;
        const u = get().user!;
        // AI tries to resolve first
        const aiResponse = `پاسخ خودکار: مسئله شما دریافت شد. بر اساس توضیحات، پیشنهاد می‌کنم: ۱) موجودی کیف پول را بررسی کنید. ۲) کلید API معتبر است. ۳) اگه مشکل ادامه داشت، منتظر پاسخ پشتیبانی انسانی باشید.`;
        const ticket: SupportTicket = { id: uid("st"), userId: u.id, userName: u.fullName, userEmail: data.userEmail, userMobile: data.userMobile, subject: data.subject, body: data.body, status: "ai_resolved", aiResponse, aiConfidence: 0.75, createdAt: new Date().toISOString() };
        set((s) => ({ supportTickets: [ticket, ...s.supportTickets] }));
      },
      resolveSupportTicket: (id, response, byAI) => set((s) => ({ supportTickets: s.supportTickets.map((t) => t.id === id ? { ...t, status: "resolved", humanResponse: byAI ? undefined : response, aiResponse: byAI ? response : t.aiResponse, resolvedAt: new Date().toISOString() } : t) })),

      addImageGeneration: (data) => set((s) => ({ imageGenerations: [{ ...data, id: uid("ig"), createdAt: new Date().toISOString() }, ...s.imageGenerations] })),
      addVisionAnalysis: (data) => set((s) => ({ visionAnalyses: [{ ...data, id: uid("va"), createdAt: new Date().toISOString() }, ...s.visionAnalyses] })),
      addVoiceTranscription: (data) => set((s) => ({ voiceTranscriptions: [{ ...data, id: uid("vt"), createdAt: new Date().toISOString() }, ...s.voiceTranscriptions] })),

      isInstalled: false,
      markInstalled: () => set({ isInstalled: true }),
    }),
    {
      name: "caspian-ai-store-v3",
      partialize: (s) => ({
        user: s.user, isInstalled: s.isInstalled, apiKeys: s.apiKeys, providerKeys: s.providerKeys,
        transactions: s.transactions, conversations: s.conversations, models: s.models, agents: s.agents,
        pricingTiers: s.pricingTiers, siteContent: s.siteContent, users: s.users, inboxMessages: s.inboxMessages,
        supportTickets: s.supportTickets, imageGenerations: s.imageGenerations, visionAnalyses: s.visionAnalyses,
        voiceTranscriptions: s.voiceTranscriptions,
      }),
    }
  )
);

// ============ Helpers ============
export const formatToman = (amount: number): string => new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
export const formatNumber = (n: number): string => new Intl.NumberFormat("fa-IR").format(n);
export const formatDate = (iso: string): string => { try { return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso)); } catch { return iso; } };
export const formatDateTime = (iso: string): string => { try { return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); } catch { return iso; } };
export const formatRelativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "هم‌اکنون";
  if (min < 60) return `${formatNumber(min)} دقیقه پیش`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${formatNumber(hr)} ساعت پیش`;
  return `${formatNumber(Math.floor(hr / 24))} روز پیش`;
};
