import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ Types ============
export type ViewKey =
  | "landing"
  | "auth"
  | "dashboard"
  | "chat"
  | "api-keys"
  | "billing"
  | "admin"
  | "install";

export interface User {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  isAdmin: boolean;
  creditBalance: number; // toman
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  fullKey?: string; // only on creation
  isEnabled: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export interface Transaction {
  id: string;
  type: "deposit" | "usage" | "refund";
  amount: number; // toman, positive
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
  cost?: number; // toman
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  modelId: string;
  agentId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  inputTokenPriceToman: number; // per 1k tokens
  outputTokenPriceToman: number;
  isActive: boolean;
  description: string;
  badge?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string; // lucide icon name
  isPublic: boolean;
  color: string;
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

// ============ Mock Data ============
const MOCK_MODELS: AIModel[] = [
  {
    id: "gpt-5.6",
    name: "GPT-5.6",
    provider: "OpenAI",
    inputTokenPriceToman: 18,
    outputTokenPriceToman: 72,
    isActive: true,
    description: "قدرتمندترین مدل OpenAI برای وظایف پیچیده استدلالی و خلاقیت",
    badge: "محبوب",
  },
  {
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    provider: "Anthropic",
    inputTokenPriceToman: 22,
    outputTokenPriceToman: 110,
    isActive: true,
    description: "بهترین تعادل بین کیفیت و سرعت، عالی برای کدنویسی و تحلیل",
    badge: "پیشنهادی",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputTokenPriceToman: 16,
    outputTokenPriceToman: 64,
    isActive: true,
    description: "مدل چندوجهی گوگل با پنجره محتوای بسیار بزرگ",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    inputTokenPriceToman: 4,
    outputTokenPriceToman: 12,
    isActive: true,
    description: "اقتصادی و قدرتمند، بهترین گزینه برای حجم بالا",
    badge: "ارزان",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    inputTokenPriceToman: 6,
    outputTokenPriceToman: 20,
    isActive: true,
    description: "مدل متن‌باز متا با عملکردی رقابتی",
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    provider: "Alibaba",
    inputTokenPriceToman: 5,
    outputTokenPriceToman: 16,
    isActive: false,
    description: "مدل چینی با پشتیبانی عالی از زبان فارسی",
  },
];

const MOCK_AGENTS: Agent[] = [
  {
    id: "vakilyar",
    name: "وکیل‌یار",
    description: "دستیار حقوقی هوشمند برای پاسخ به سوالات حقوقی ایران",
    systemPrompt:
      "تو یک دستیار حقوقی متخصص در قوانین ایران هستی. پاسخ‌هایت دقیق، مستند و بر اساس قوانین فعلی جمهوری اسلامی ایران باشد.",
    icon: "Scale",
    isPublic: true,
    color: "#38BDF8",
  },
  {
    id: "kodyar",
    name: "کدیار",
    description: "برنامه‌نویس حرفه‌ای برای تولید، بازبینی و دیباگ کد",
    systemPrompt:
      "تو یک مهندس نرم‌افزار ارشد هستی. کدهای تمیز، امن و بهینه تولید کن و بهترین Practices را رعایت کن.",
    icon: "Code2",
    isPublic: true,
    color: "#34D399",
  },
  {
    id: "mohtavayar",
    name: "محتوایار",
    description: "تولید محتوای متنی، تبلیغاتی و سئو برای کسب‌وکارها",
    systemPrompt:
      "تو یک متخصص تولید محتوا و بازاریابی دیجیتال هستی. محتوای جذاب، سئوفرندلی و متناسب با مخاطب ایرانی تولید کن.",
    icon: "PenLine",
    isPublic: true,
    color: "#FBBF24",
  },
  {
    id: "tarjomehyar",
    name: "ترجمه‌یار",
    description: "مترجم همزبان فارسی-انگلیسی-عربی با حفظ لحن",
    systemPrompt:
      "تو یک مترجم حرفه‌ای هستی. ترجمه‌هایت روان، دقیق و متناسب با زمینه متنی باشد.",
    icon: "Languages",
    isPublic: true,
    color: "#818CF8",
  },
];

const MOCK_USER: User = {
  id: "u-1001",
  email: "demo@caspian.ai",
  fullName: "کاربر نمونه",
  mobile: "09120000000",
  isAdmin: true,
  creditBalance: 245000,
  createdAt: "2025-06-12T10:30:00Z",
};

const MOCK_API_KEYS: ApiKey[] = [
  {
    id: "k-1",
    name: "تولید اپ پروداکشن",
    prefix: "csk-7f3a",
    isEnabled: true,
    createdAt: "2025-07-01T08:00:00Z",
    lastUsedAt: "2026-07-27T01:14:00Z",
  },
  {
    id: "k-2",
    name: "محیط تست",
    prefix: "csk-2b8c",
    isEnabled: true,
    createdAt: "2025-07-15T14:20:00Z",
    lastUsedAt: "2026-07-26T19:42:00Z",
  },
  {
    id: "k-3",
    name: "ربات تلگرام",
    prefix: "csk-9e1d",
    isEnabled: false,
    createdAt: "2025-05-20T11:10:00Z",
  },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t-1",
    type: "deposit",
    amount: 100000,
    balanceAfter: 245000,
    description: "شارژ کیف پول از طریق درگاه نکست‌پی",
    refId: "np-8723492",
    createdAt: "2026-07-26T09:15:00Z",
  },
  {
    id: "t-2",
    type: "usage",
    amount: 4820,
    balanceAfter: 145000,
    description: "مصرف API — GPT-5.6",
    refId: "req-a92f",
    createdAt: "2026-07-26T11:32:00Z",
  },
  {
    id: "t-3",
    type: "usage",
    amount: 1240,
    balanceAfter: 140180,
    description: "مصرف چت — Claude Sonnet 5",
    refId: "req-b71c",
    createdAt: "2026-07-26T14:05:00Z",
  },
  {
    id: "t-4",
    type: "deposit",
    amount: 50000,
    balanceAfter: 190180,
    description: "شارژ کیف پول از طریق درگاه نکست‌پی",
    refId: "np-8725104",
    createdAt: "2026-07-25T18:40:00Z",
  },
  {
    id: "t-5",
    type: "usage",
    amount: 3260,
    balanceAfter: 140180,
    description: "مصرف API — DeepSeek V3",
    refId: "req-c03d",
    createdAt: "2026-07-25T20:11:00Z",
  },
  {
    id: "t-6",
    type: "refund",
    amount: 980,
    balanceAfter: 143440,
    description: "بازگشت وجه — خطای سرور پروایدر",
    refId: "ref-d44a",
    createdAt: "2026-07-24T10:22:00Z",
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c-1",
    title: "طراحی معماری پلتفرم SaaS",
    modelId: "claude-sonnet-5",
    agentId: "kodyar",
    createdAt: "2026-07-26T10:00:00Z",
    updatedAt: "2026-07-26T11:30:00Z",
    messages: [
      {
        id: "m-1",
        role: "user",
        content:
          "سلام، می‌خوام یک پلتفرم SaaS بسازم که API هوش مصنوعی رو به کاربران ایرانی بفروشه. معماری کلی رو پیشنهاد بده.",
        createdAt: "2026-07-26T10:00:00Z",
      },
      {
        id: "m-2",
        role: "assistant",
        content:
          "سلام! برای ساخت یک پلتفرم SaaS فروش API هوش مصنوعی، معماری پیشنهادی من شامل این لایه‌هاست:\n\n**۱. لایه Gateway:** یک پروکسی معکوس (Nginx یا Caddy) که درخواست‌ها را به سرویس‌های داخلی هدایت می‌کند و SSL را خاتمه می‌دهد.\n\n**۲. لایه برنامه (FastAPI):** هسته اصلی شامل ماژول‌های احراز هویت، مدیریت کلید API، پروکسی OpenAI، و پنل ادمین.\n\n**۳. لایه داده:** PostgreSQL برای داده‌های اصلی، Redis برای کش و Rate Limiting.\n\n**۴. ماژول پرداخت:** پیاده‌سازی شده با الگوی Strategy تا درگاه‌های مختلف (نکست‌پی، زرین‌پال) قابل افزودن باشند.\n\n**۵. لایه مانیتورینگ:** Prometheus + Grafana برای متریک‌ها، Loki برای لاگ‌ها.\n\nاگر بخواهی هر کدام از این لایه‌ها را عمیق‌تر بررسی کنیم، خوشحال می‌شوم کمک کنم.",
        tokenCount: 312,
        cost: 540,
        createdAt: "2026-07-26T10:01:00Z",
      },
      {
        id: "m-3",
        role: "user",
        content: "برای Rate Limiting چه روشی پیشنهاد می‌کنی؟",
        createdAt: "2026-07-26T11:25:00Z",
      },
      {
        id: "m-4",
        role: "assistant",
        content:
          "برای Rate Limiting در یک پلتفرم SaaS، بهترین رویکرد ترکیبی از روش‌های زیر است:\n\n**۱. الگوریتم Token Bucket:** انعطاف‌پذیرترین روش — هر کاربر یک سطل با ظرفیت مشخص دارد که توکن‌ها با نرخ مشخص پر می‌شوند. مناسب برای جلوگیری از ترافیک ناگهانی.\n\n**۲. پیاده‌سازی با Redis:** با اسکریپت Lua در Redis می‌توان عملیات را اتمیک کرد. کتابخانه `redis-py` و `slowapi` در FastAPI این کار را ساده می‌کنند.\n\n**۳. سطوح مختلف محدودیت:**\n- هر دقیقه: ۶۰ درخواست\n- هر ساعت: ۱۰۰۰ درخواست\n- هر روز: ۱۰۰۰۰ درخواست\n\n**۴. محدودیت بر اساس پلن:** کاربران رایگان، حرفه‌ای و سازمانی سقف‌های متفاوتی داشته باشند.\n\n**۵. هدرهای اطلاع‌رسانی:** در هر پاسخ `X-RateLimit-Limit`، `X-RateLimit-Remaining` و `X-RateLimit-Reset` را ارسال کن تا کلاینت بتواند رفتار خود را تنظیم کند.",
        tokenCount: 287,
        cost: 478,
        createdAt: "2026-07-26T11:26:00Z",
      },
    ],
  },
  {
    id: "c-2",
    title: "نگارش قرارداد همکاری",
    modelId: "gpt-5.6",
    agentId: "vakilyar",
    createdAt: "2026-07-25T14:00:00Z",
    updatedAt: "2026-07-25T15:45:00Z",
    messages: [
      {
        id: "m-5",
        role: "user",
        content:
          "یک قرارداد همکاری بین دو شرکت نرم‌افزاری برای توسعه مشترک محصول می‌خوام. نکات حقوقی مهمش چیست؟",
        createdAt: "2026-07-25T14:00:00Z",
      },
      {
        id: "m-6",
        role: "assistant",
        content:
          "برای قرارداد همکاری مشترک بین دو شرکت نرم‌افزاری، این نکات حقوقی حیاتی هستند:\n\n**۱. مالکیت معنوی:** باید دقیقاً مشخص شود هر قطعه کد، طراحی یا ایده متعلق به کدام شرکت است و چگونه در صورت فسخ قرارداد تقسیم می‌شود.\n\n**۲. سهم درآمد:** روش محاسبه سهم هر طرف (درصد ثابت، متغیر بر اساس نقش، یا ترکیبی) و زمان پرداخت باید شفاف باشد.\n\n**۳. محرمانگی (NDA):** اطلاعات تجاری، کد منبع، و داده‌های کاربران هر دو طرف باید محرمانه بماند.\n\n**۴. مدت و فسخ:** مدت قرارداد، شرایط تمدید، و شرایطی که هر طرف می‌تواند فسخ کند باید صریح باشد.\n\n**۵. حل اختلاف:** تعیین مرجع حل اختلاف (داوری یا دادگاه) و قانون حاکم (قانون ایران).\n\n**۶. تعهدات غیررقابتی:** هر طرف متعهد شود در دوره قرارداد (و یک مدت بعد از آن) محصول رقیب مستقیم نسازد.\n\nتوصیه می‌کنم پیش از امضا، یک وکیل متخصص حقوق تجارت قرارداد را بازبینی کند.",
        tokenCount: 342,
        cost: 588,
        createdAt: "2026-07-25T14:01:00Z",
      },
    ],
  },
  {
    id: "c-3",
    title: "ایده‌پردازی کمپین تبلیغاتی",
    modelId: "gemini-2.5-pro",
    agentId: "mohtavayar",
    createdAt: "2026-07-24T09:00:00Z",
    updatedAt: "2026-07-24T10:20:00Z",
    messages: [
      {
        id: "m-7",
        role: "user",
        content:
          "برای یک برند پوشاک ایرانی که مخاطب زنان ۲۵ تا ۳۵ ساله است، ایده کمپین تابستانه می‌خوام.",
        createdAt: "2026-07-24T09:00:00Z",
      },
      {
        id: "m-8",
        role: "assistant",
        content:
          "برند پوشاک زنانه با مخاطب ۲۵-۳۵ ساله در تابستان — چند ایده کمپین:\n\n**۱. «تابستانِ من، قانونِ من»**\nمفهوم: استقلال و اعتماد به نفس زن ایرانی. ویدیوهایی از زنان در لحظات مختلف تابستان — کافه، سفر، فراغت. هشتگ #تابستان_من.\n\n**۲. «از خیابون تا دریا»**\nمفهوم: لباس‌های چندمنظوره که هم برای کار روزمره و هم برای تعطیلات مناسب هستند. influencerهایی که یک لباس را در دو ستین متفاوت استایل می‌کنند.\n\n**۳. «رنگ‌های خورشید»**\nکالکشن محدود با پالت رنگی گرم (مرجانی، زرد، فیروزه‌ای). هر هفته یک رنگ جدید با استوری اینستاگرامی تعاملی.\n\n**کانال‌های پیشنهادی:** اینستاگرام (Reels)، تیک‌تاک (با میکرو-اینفلوئنسرها)، و یوتیوب Shorts. بودجه پیشنهادی: ۴۰٪ تولید محتوا، ۳۵٪ تبلیغات پولی، ۲۵٪ اینفلوئنسر.",
        tokenCount: 298,
        cost: 384,
        createdAt: "2026-07-24T09:01:00Z",
      },
    ],
  },
];

const MOCK_PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "رایگان",
    description: "برای آشنایی با پلتفرم",
    monthlyPriceToman: 0,
    includedCredit: 20000,
    features: [
      "۲۰٬۰۰۰ تومان اعتبار هدیه",
      "دسترسی به همه مدل‌ها",
      "۱ کلید API",
      "پشتیبانی جامعه کاربری",
    ],
  },
  {
    id: "pro",
    name: "حرفه‌ای",
    description: "برای توسعه‌دهندگان و کسب‌وکارهای کوچک",
    monthlyPriceToman: 290000,
    includedCredit: 350000,
    features: [
      "۳۵۰٬۰۰۰ تومان اعتبار ماهانه",
      "۱۰ کلید API",
      "نرخ ارزان‌تر مدل‌ها (۱۰٪)",
      "اولویت در صف درخواست‌ها",
      "پشتیبانی ۲۴/۷",
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "سازمانی",
    description: "برای تیم‌های بزرگ و سازمان‌ها",
    monthlyPriceToman: 990000,
    includedCredit: 1500000,
    features: [
      "۱٬۵۰۰٬۰۰۰ تومان اعتبار ماهانه",
      "کلیدهای API نامحدود",
      "نرخ ویژه سازمانی (۲۰٪)",
      "SLA با تضمین ۹۹.۹٪ آپتایم",
      "مدیر اختصاصی حساب",
      "آموزش تیمی",
    ],
  },
];

// ============ Store ============
interface AppState {
  // navigation
  view: ViewKey;
  setView: (v: ViewKey) => void;

  // auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: { email: string; password: string; fullName: string; mobile: string }) => boolean;
  logout: () => void;

  // data
  models: AIModel[];
  agents: Agent[];
  apiKeys: ApiKey[];
  transactions: Transaction[];
  conversations: Conversation[];
  pricingTiers: PricingTier[];

  // chat state
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  createConversation: (title: string, modelId: string, agentId?: string) => string;
  sendMessage: (conversationId: string, content: string) => void;
  deleteConversation: (id: string) => void;

  // api keys
  createApiKey: (name: string) => ApiKey;
  toggleApiKey: (id: string) => void;
  deleteApiKey: (id: string) => void;

  // billing
  depositViaNextPay: (amountToman: number) => { redirectUrl: string; transId: string };
  verifyNextPayCallback: (transId: string, amount: number) => boolean;

  // admin
  updateModel: (id: string, patch: Partial<AIModel>) => void;
  updateAgent: (id: string, patch: Partial<Agent>) => void;

  // install
  isInstalled: boolean;
  markInstalled: () => void;
}

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

const ASSISTANT_REPLIES = [
  "البته! این یک پاسخ نمونه از مدل انتخاب‌شده است. در محیط واقعی، این پاسخ از طریق پروکسی OpenRouter تولید می‌شود و هزینه توکن‌ها به‌صورت لحظه‌ای از کیف پول شما کسر می‌گردد.\n\nکاسپین AI با شفافیت کامل، قیمت دقیق هر توکن ورودی و خروجی را پیش از ارسال درخواست نمایش می‌دهد.",
  "سوال خوبی پرسیدی. بسته به مدل انتخاب‌شده، کیفیت و سرعت پاسخ متفاوت است. برای مثال GPT-5.6 در وظایف خلاقانه بهتر عمل می‌کند، در حالی که DeepSeek V3 گزینه اقتصادی‌تری برای حجم بالاست.\n\nپیشنهاد می‌کنم با مدل‌های مختلف آزمایش کنی تا بهترین تناسب با نیازت را پیدا کنی.",
  "برای این درخواست، چند رویکرد وجود دارد. اجازه بده مرحله به مرحله بررسی کنیم:\n\n**گام اول:** مسئله را به اجزای کوچک‌تر تقسیم کنیم.\n**گام دوم:** برای هر جزء، راه‌حل‌های ممکن را ارزیابی کنیم.\n**گام سوم:** بهترین ترکیب را انتخاب و اجرا کنیم.\n\nاگر بخواهی روی هر گام تمرکز کنیم، خوشحال می‌شوم کمک کنم.",
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "landing",
      setView: (v) => set({ view: v }),

      user: null,
      login: (email) => {
        const isAdmin = email.toLowerCase().includes("admin") || email === "demo@caspian.ai";
        set({
          user: { ...MOCK_USER, email, isAdmin },
          view: "dashboard",
        });
        return true;
      },
      register: ({ email, fullName, mobile }) => {
        set({
          user: {
            ...MOCK_USER,
            email,
            fullName,
            mobile,
            isAdmin: false,
            creditBalance: 20000,
          },
          view: "dashboard",
        });
        return true;
      },
      logout: () => set({ user: null, view: "landing" }),

      models: MOCK_MODELS,
      agents: MOCK_AGENTS,
      apiKeys: MOCK_API_KEYS,
      transactions: MOCK_TRANSACTIONS,
      conversations: MOCK_CONVERSATIONS,
      pricingTiers: MOCK_PRICING_TIERS,

      activeConversationId: "c-1",
      setActiveConversation: (id) => set({ activeConversationId: id }),

      createConversation: (title, modelId, agentId) => {
        const id = uid("c");
        const now = new Date().toISOString();
        const conv: Conversation = {
          id,
          title,
          modelId,
          agentId,
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeConversationId: id,
        }));
        return id;
      },

      sendMessage: (conversationId, content) => {
        const now = new Date().toISOString();
        const userMsg: Message = {
          id: uid("m"),
          role: "user",
          content,
          createdAt: now,
        };
        const reply = ASSISTANT_REPLIES[Math.floor(Math.random() * ASSISTANT_REPLIES.length)];
        const assistantMsg: Message = {
          id: uid("m"),
          role: "assistant",
          content: reply,
          tokenCount: 180 + Math.floor(Math.random() * 220),
          cost: 120 + Math.floor(Math.random() * 380),
          createdAt: new Date(Date.now() + 1200).toISOString(),
        };

        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, userMsg, assistantMsg],
                  updatedAt: now,
                  title: c.messages.length === 0 ? content.slice(0, 40) : c.title,
                }
              : c
          ),
        }));

        if (assistantMsg.cost && get().user) {
          set((s) => ({
            user: s.user
              ? { ...s.user, creditBalance: Math.max(0, s.user.creditBalance - (assistantMsg.cost || 0)) }
              : null,
            transactions: [
              {
                id: uid("t"),
                type: "usage",
                amount: assistantMsg.cost!,
                balanceAfter: (s.user?.creditBalance || 0) - (assistantMsg.cost || 0),
                description: `مصرف چت — ${s.models.find((m) => m.id === s.conversations.find((c) => c.id === conversationId)?.modelId)?.name || "Unknown"}`,
                refId: uid("req"),
                createdAt: now,
              },
              ...s.transactions,
            ],
          }));
        }
      },

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId:
            s.activeConversationId === id ? s.conversations[0]?.id || null : s.activeConversationId,
        })),

      createApiKey: (name) => {
        const random = Math.random().toString(36).slice(2, 36);
        const fullKey = `csk-${random}`;
        const apiKey: ApiKey = {
          id: uid("k"),
          name,
          prefix: fullKey.slice(0, 8),
          fullKey,
          isEnabled: true,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ apiKeys: [apiKey, ...s.apiKeys] }));
        return apiKey;
      },
      toggleApiKey: (id) =>
        set((s) => ({
          apiKeys: s.apiKeys.map((k) =>
            k.id === id ? { ...k, isEnabled: !k.isEnabled } : k
          ),
        })),
      deleteApiKey: (id) =>
        set((s) => ({ apiKeys: s.apiKeys.filter((k) => k.id !== id) })),

      depositViaNextPay: (amountToman) => {
        const transId = `np-${Math.floor(Math.random() * 9000000) + 1000000}`;
        return {
          redirectUrl: `https://api.nextpay.org/gateway/payment/${transId}`,
          transId,
        };
      },
      verifyNextPayCallback: (transId, amount) => {
        const now = new Date().toISOString();
        set((s) => ({
          user: s.user
            ? { ...s.user, creditBalance: s.user.creditBalance + amount }
            : null,
          transactions: [
            {
              id: uid("t"),
              type: "deposit",
              amount,
              balanceAfter: (s.user?.creditBalance || 0) + amount,
              description: "شارژ کیف پول از طریق درگاه نکست‌پی",
              refId: transId,
              createdAt: now,
            },
            ...s.transactions,
          ],
        }));
        return true;
      },

      updateModel: (id, patch) =>
        set((s) => ({
          models: s.models.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      updateAgent: (id, patch) =>
        set((s) => ({
          agents: s.agents.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      isInstalled: false,
      markInstalled: () => set({ isInstalled: true }),
    }),
    {
      name: "caspian-ai-store",
      partialize: (s) => ({
        user: s.user,
        isInstalled: s.isInstalled,
        apiKeys: s.apiKeys,
        transactions: s.transactions,
        conversations: s.conversations,
      }),
    }
  )
);

// ============ Helpers ============
export const formatToman = (amount: number): string => {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
};

export const formatNumber = (n: number): string => {
  return new Intl.NumberFormat("fa-IR").format(n);
};

export const formatDate = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const formatDateTime = (iso: string): string => {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

export const formatRelativeTime = (iso: string): string => {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "هم‌اکنون";
  if (min < 60) return `${formatNumber(min)} دقیقه پیش`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${formatNumber(hr)} ساعت پیش`;
  const day = Math.floor(hr / 24);
  return `${formatNumber(day)} روز پیش`;
};
