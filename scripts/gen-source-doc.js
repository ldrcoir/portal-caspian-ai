// Generate Persian Word document: Source Code Explanation
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ShadingType, PageOrientation, BorderStyle } = require("docx");
const fs = require("fs");

const C = { primary: "0B1121", accent: "38BDF8", emerald: "34D399", red: "EF4444", gray: "64748B", white: "FFFFFF", black: "000000", codeBg: "1A2744" };

function h(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 150 }, children: [new TextRun({ text, bold: true, color: C.primary, font: "Tahoma", size: level === HeadingLevel.HEADING_1 ? 32 : 28 })] });
}
function p(text) { return new Paragraph({ spacing: { line: 360, before: 100, after: 100 }, alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 420 }, children: [new TextRun({ text, font: "Tahoma", size: 24, color: C.black })] }); }
function code(text) { return new Paragraph({ spacing: { line: 280, before: 100, after: 100 }, shading: { type: ShadingType.CLEAR, fill: C.codeBg, color: C.codeBg }, children: [new TextRun({ text, font: "Consolas", size: 18, color: C.white })] }); }
function bullet(text) { return new Paragraph({ spacing: { line: 340, before: 50, after: 50 }, bullet: { level: 0 }, children: [new TextRun({ text, font: "Tahoma", size: 24, color: C.black })] }); }
function infoBox(text, color = C.accent) { return new Paragraph({ spacing: { line: 340, before: 150, after: 150 }, shading: { type: ShadingType.CLEAR, fill: "E0F2FE", color: "auto" }, border: { left: { style: BorderStyle.SINGLE, size: 24, color } }, children: [new TextRun({ text, font: "Tahoma", size: 22, color: C.primary, bold: true })] }); }

const doc = new Document({
  creator: "Caspian AI", title: "کاسپین AI - مستندات سورس کد",
  styles: { default: { document: { run: { font: "Tahoma", size: 24 } } } },
  sections: [
    // Cover
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1417, right: 1417 } } },
      children: [
        new Paragraph({ spacing: { before: 4000 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "کاسپین AI", font: "Tahoma", size: 72, bold: true, color: C.primary })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: "مستندات سورس کد", font: "Tahoma", size: 40, color: C.accent })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "توضیح خط‌به‌خط کامل کدهای پلتفرم", font: "Tahoma", size: 24, color: C.gray })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2000 }, children: [new TextRun({ text: "نسخه ۱.۰.۰ — ۱۴۰۵", font: "Tahoma", size: 22, color: C.gray })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ] },
    // Content
    { properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1417, right: 1417 } } },
      children: [
        h("۱. مقدمه و معماری کلی"),
        p("پلتفرم کاسپین AI یک CRM ماژولار کامل است که با Next.js 16، TypeScript و Tailwind CSS ساخته شده. این پلتفرم شامل چت هوشمند، تولید تصویر، تحلیل تصویر، تبدیل صدا، سیستم پرداخت، پیام‌رسانی و پشتیبانی هوش مصنوعی است."),
        p("معماری بر اساس Module Registry طراحی شده — هر قابلیت یک ماژول مستقل است که بدون تغییر کدهای دیگر، قابل افزودن/حذف/غیرفعال‌سازی است."),
        infoBox("نکته کلیدی: تمام قابلیت‌ها از پنل مدیریت قابل فعال/غیرفعال شدن هستند.", C.emerald),

        h("۲. ساختار پوشه‌ها"),
        code("src/\n├── app/                    # Next.js App Router\n├── components/caspian/     # کامپوننت‌های پلتفرم\n├── modules/                # ماژول‌های مستقل\n│   ├── registry.ts         # رجیستری مرکزی\n│   ├── bootstrap.ts        # ثبت ماژول‌ها\n│   ├── payment/            # ماژول‌های پرداخت\n│   └── features/           # ماژول‌های قابلیت\n├── store/app-store.ts      # Zustand store\n└── i18n/index.ts           # سیستم چندزبانه"),

        h("۳. سیستم ماژولار (Module Registry)"),
        p("فایل registry.ts قلب معماری است. شامل تایپ ModuleManifest، PaymentGatewayManifest و store رجیستری است."),
        h("۳.۱. ModuleManifest", HeadingLevel.HEADING_2),
        code("interface ModuleManifest {\n  id: string;\n  name: string;\n  type: ModuleType;\n  isEnabled: boolean;\n  isCore: boolean;\n  config: Record<...>;\n  configSchema: SettingField[];\n  navItems?: NavItem[];\n  adminTabs?: AdminTab[];\n  paymentGateways?: PaymentGatewayManifest[];\n  handlers?: { onUserLogin, onMessageSent, ... };\n}"),
        p("هر ماژول تمام قابلیت‌های خود را در یک Manifest تعریف می‌کند و رجیستری به‌طور خودکار آنها را در جای مناسب نمایش می‌دهد."),

        h("۴. مدیریت State (Zustand Store)"),
        p("فایل app-store.ts تمام state برنامه را مدیریت می‌کند: کاربران، تراکنش‌ها، مکالمات، مدل‌ها، عامل‌ها، کلیدها و تمام داده‌های دیگر."),
        p("Store با persist middleware در localStorage ذخیره می‌شود. تابع partialize مشخص می‌کند کدام فیلدها ذخیره شوند."),
        infoBox("امنیت: در محیط تولید، داده‌های حساس باید در سرور ذخیره شوند، نه localStorage.", C.red),

        h("۵. سیستم چندزبانه (i18n)"),
        p("فایل i18n/index.ts سیستم ترجمه را مدیریت می‌کند. از فارسی (RTL) و انگلیسی (LTR) پشتیبانی می‌کند."),
        h("۵.۱. تشخیص خودکار از IP", HeadingLevel.HEADING_2),
        code('detectFromIP: async () => {\n  const res = await fetch("https://ipapi.co/json/");\n  const data = await res.json();\n  const locale = localeFromCountry(data.country_code);\n  set({ locale, detectedLocale: locale });\n}'),
        p("اگر کاربر از ایران، افغانستان یا تاجیکستان باشد، فارسی انتخاب می‌شود."),

        h("۶. ماژول‌های پرداخت"),
        p("درگاه‌های پرداخت به‌صورت ماژول مستقل پیاده‌سازی شده‌اند. هر درگاه PaymentGatewayManifest با متدهای requestPayment و verifyPayment دارد."),
        h("۶.۱. نکست‌پی (پیش‌فرض)", HeadingLevel.HEADING_2),
        code("requestPayment: async (amount, callbackUrl, config) => {\n  // POST https://api.nextpay.org/gateway/token\n  const transId = 'np-' + Math.random();\n  return { redirectUrl: '...', transId };\n}"),
        h("۶.۲. زرین‌پال", HeadingLevel.HEADING_2),
        p("غیرفعال به‌صورت پیش‌فرض. ادمین از پنل مدیریت فعال می‌کند و مرچنت کد وارد می‌کند."),

        h("۷. ماژول پیام‌رسانی"),
        p("ارتباط بین کاربران و ادمین با محافظت اسپم و rate limiting."),
        h("۷.۱. محافظت اسپم", HeadingLevel.HEADING_2),
        code("const MESSAGE_RATE_LIMIT = 5; // 5 پیام در 10 دقیقه\nconst MIN_LENGTH = 10;\nconst MAX_LENGTH = 2000;\n\nfunction checkSpam(messages) {\n  const recent = messages.filter(m =>\n    Date.now() - new Date(m.createdAt) < 600000\n  );\n  if (recent.length >= 5) return { isSpam: true };\n  return { isSpam: false };\n}"),
        h("۷.۲. اطلاع‌رسانی همگانی", HeadingLevel.HEADING_2),
        p("ادمین می‌تواند پیام به تمام کاربران ارسال کند."),

        h("۸. ماژول پشتیبانی هوش مصنوعی"),
        p("AI در sandbox امن کار می‌کند و هرگز به اطلاعات حساس دسترسی ندارد."),
        infoBox("امنیت بحرانی: AI هرگز نباید به ادمین، دیتابیس، کلیدها یا تنظیمات دسترسی بدهد.", C.red),
        h("۸.۱. لیست کلمات ممنوعه", HeadingLevel.HEADING_2),
        code('const FORBIDDEN_KEYWORDS = [\n  "admin", "password", "رمز", "ادمین",\n  "database", "دیتابیس", "sql", "drop",\n  "root", "shell", "command", "execute",\n  "token", "secret", "key", "کلید",\n  "hack", "هک", "bypass", "exploit"\n];'),
        p("اگر ورودی شامل این کلمات باشد، رد می‌شود و به انسان ارجاع داده می‌شود."),
        h("۸.۲. تولید پاسخ امن", HeadingLevel.HEADING_2),
        p("AI فقط در موضوعات مجاز (موجودی، کلید API، مدل، پرداخت، چت) پاسخ می‌دهد. اگر اطمینان کمتر از ۰.۷ باشد، به انسان ارجاع می‌شود."),
        h("۸.۳. جمع‌آوری اطلاعات تماس", HeadingLevel.HEADING_2),
        p("ایمیل و موبایل کاربر جمع‌آوری می‌شود تا پشتیبان انسانی بتواند پیگیری کند."),

        h("۹. ماژول تصویرساز"),
        p("تولید تصویر از متن با DALL-E 3 و Stable Diffusion. هر تولید هزینه مشخصی دارد."),
        code('const IMAGE_MODELS = [\n  { id: "dall-e-3", name: "DALL-E 3", cost: 50000 },\n  { id: "stable-diffusion-xl", name: "SDXL", cost: 15000 }\n];'),
        p("کاربر می‌تواند اندازه و کیفیت را انتخاب کند. تصاویر در تاریخچه ذخیره می‌شوند."),

        h("۱۰. ماژول تحلیل تصویر (Vision)"),
        p("کاربر تصویر آپلود می‌کند و سوال می‌پرسد. مدل بینایی تحلیل می‌کند. حداکثر ۱۰ مگابایت، فرمت‌های JPG/PNG/WebP."),

        h("۱۱. ماژول صدا (STT/TTS)"),
        p("دو قابلیت: تبدیل صوت به متن (Whisper) و متن به صوت (TTS-1)."),
        h("۱۱.۱. ضبط صدا", HeadingLevel.HEADING_2),
        code("const stream = await navigator.mediaDevices\n  .getUserMedia({ audio: true });\nconst recorder = new MediaRecorder(stream);"),

        h("۱۲. کامپوننت‌های UI"),
        bullet("GlassCard — کارت شیشه‌ای با blur"),
        bullet("GlowButton — دکمه با درخشش"),
        bullet("Logo — لوگوی داینامیک از siteContent"),
        bullet("LanguageSwitcher — منوی زبان"),
        bullet("AppSidebar — سایدبار از رجیستری"),

        h("۱۳. پنل مدیریت (Admin)"),
        p("۱۰ تب: داشبورد، مدل‌ها، عامل‌ها، قیمت‌گذاری، محتوا، ماژول‌ها، کاربران، پیام‌ها، پشتیبانی، سیستم."),
        bullet("مدل‌ها — CRUD کامل + قیمت‌گذاری"),
        bullet("عامل‌ها — CRUD + مدل پیش‌فرض + کلید پروایدر"),
        bullet("کاربران — CRUD + تنظیم موجودی + تعلیق"),
        bullet("ماژول‌ها — فعال/غیرفعال + تنظیمات"),
        bullet("محتوا — ویرایش تمام متن‌های سایت"),

        h("۱۴. امنیت و محافظت"),
        h("۱۴.۱. Sandbox پشتیبانی AI", HeadingLevel.HEADING_2),
        p("AI در محیط ایزوله. لیست کلمات ممنوعه، موضوعات مجاز و حد اطمینان برای جلوگیری از نشت اطلاعات."),
        h("۱۴.۲. Rate Limiting", HeadingLevel.HEADING_2),
        p("حداکثر ۵ پیام در ۱۰ دقیقه در ماژول پیام‌رسان. جلوگیری از اسپم و brute-force."),
        h("۱۴.۳. ذخیره امن کلیدها", HeadingLevel.HEADING_2),
        p("در محیط تولید، کلیدهای API باید با رمزنگاری در سرور ذخیره شوند."),

        h("۱۵. راهنمای توسعه"),
        h("۱۵.۱. افزودن ماژول جدید", HeadingLevel.HEADING_2),
        code("// 1. src/modules/features/my-module.tsx\nexport const myModule = {\n  id: 'feature-my-module',\n  name: 'ماژول من',\n  navItems: [{ id: 'my-page', ... }],\n};"),
        code("// 2. bootstrap.ts\nBUILTIN_MODULES.push(myModule);"),
        p("تمام! ماژول در سایدبار و پنل ادمین ظاهر می‌شود."),
        h("۱۵.۲. افزودن درگاه پرداخت", HeadingLevel.HEADING_2),
        p("فایل جدید در modules/payment/ با PaymentGatewayManifest. در bootstrap ثبت کنید."),
        h("۱۵.۳. افزودن زبان جدید", HeadingLevel.HEADING_2),
        p("در i18n/index.ts، Locale جدید اضافه کنید و ترجمه‌ها را در dictionary قرار دهید."),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/z/my-project/download/caspian-source-code-doc.docx", buffer);
  console.log("✅ Source code doc generated");
});
