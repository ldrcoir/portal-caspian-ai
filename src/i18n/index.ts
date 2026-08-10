"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "fa" | "en";

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  dir: "rtl" | "ltr";
}

export const LOCALES: LocaleInfo[] = [
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷", dir: "rtl" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
];

const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  IR: "fa",
  AF: "fa",
  TJ: "fa",
};

export function localeFromCountry(countryCode?: string): Locale {
  if (!countryCode) return "fa";
  return COUNTRY_TO_LOCALE[countryCode.toUpperCase()] || "en";
}

type TranslationDict = Record<string, { fa: string; en: string }>;

export const translations: TranslationDict = {
  // ============ Common ============
  "common.save": { fa: "ذخیره", en: "Save" },
  "common.cancel": { fa: "انصراف", en: "Cancel" },
  "common.delete": { fa: "حذف", en: "Delete" },
  "common.edit": { fa: "ویرایش", en: "Edit" },
  "common.create": { fa: "ایجاد", en: "Create" },
  "common.add": { fa: "افزودن", en: "Add" },
  "common.close": { fa: "بستن", en: "Close" },
  "common.back": { fa: "بازگشت", en: "Back" },
  "common.next": { fa: "بعدی", en: "Next" },
  "common.previous": { fa: "قبلی", en: "Previous" },
  "common.search": { fa: "جستجو", en: "Search" },
  "common.loading": { fa: "در حال بارگذاری...", en: "Loading..." },
  "common.confirm": { fa: "تأیید", en: "Confirm" },
  "common.yes": { fa: "بله", en: "Yes" },
  "common.no": { fa: "خیر", en: "No" },
  "common.active": { fa: "فعال", en: "Active" },
  "common.inactive": { fa: "غیرفعال", en: "Inactive" },
  "common.enabled": { fa: "فعال", en: "Enabled" },
  "common.disabled": { fa: "غیرفعال", en: "Disabled" },
  "common.status": { fa: "وضعیت", en: "Status" },
  "common.actions": { fa: "عملیات", en: "Actions" },
  "common.name": { fa: "نام", en: "Name" },
  "common.email": { fa: "ایمیل", en: "Email" },
  "common.password": { fa: "رمز عبور", en: "Password" },
  "common.phone": { fa: "تلفن", en: "Phone" },
  "common.date": { fa: "تاریخ", en: "Date" },
  "common.amount": { fa: "مبلغ", en: "Amount" },
  "common.description": { fa: "توضیحات", en: "Description" },
  "common.type": { fa: "نوع", en: "Type" },
  "common.provider": { fa: "پروایدر", en: "Provider" },
  "common.model": { fa: "مدل", en: "Model" },
  "common.cost": { fa: "هزینه", en: "Cost" },
  "common.balance": { fa: "موجودی", en: "Balance" },
  "common.copy": { fa: "کپی", en: "Copy" },
  "common.copied": { fa: "کپی شد", en: "Copied" },
  "common.refresh": { fa: "بازخوانی", en: "Refresh" },
  "common.reset": { fa: "بازنشانی", en: "Reset" },
  "common.all": { fa: "همه", en: "All" },
  "common.none": { fa: "هیچ‌کدام", en: "None" },
  "common.optional": { fa: "اختیاری", en: "Optional" },
  "common.required": { fa: "الزامی", en: "Required" },

  // ============ Auth ============
  "auth.login": { fa: "ورود", en: "Login" },
  "auth.register": { fa: "ثبت‌نام", en: "Sign Up" },
  "auth.loginTitle": { fa: "ورود به حساب", en: "Login to your account" },
  "auth.registerTitle": { fa: "ساخت حساب جدید", en: "Create a new account" },
  "auth.loginSubtitle": { fa: "برای ادامه وارد حساب خود شوید", en: "Sign in to continue" },
  "auth.registerSubtitle": { fa: "۲۰٬۰۰۰ تومان اعتبار رایگان بگیرید", en: "Get 20,000 toman free credit" },
  "auth.fullName": { fa: "نام و نام خانوادگی", en: "Full name" },
  "auth.fullNamePlaceholder": { fa: "مثال: علی رضایی", en: "e.g. John Doe" },
  "auth.mobile": { fa: "شماره موبایل", en: "Mobile number" },
  "auth.mobilePlaceholder": { fa: "09120000000", en: "+98 912 000 0000" },
  "auth.emailPlaceholder": { fa: "you@example.com", en: "you@example.com" },
  "auth.passwordPlaceholder": { fa: "••••••••", en: "••••••••" },
  "auth.rememberMe": { fa: "مرا به خاطر بسپار", en: "Remember me" },
  "auth.forgotPassword": { fa: "رمز عبور را فراموش کرده‌اید؟", en: "Forgot password?" },
  "auth.loginButton": { fa: "ورود به حساب", en: "Sign in" },
  "auth.registerButton": { fa: "ایجاد حساب رایگان", en: "Create free account" },
  "auth.demoAccount": { fa: "حساب نمونه", en: "Demo account" },
  "auth.demoHint": { fa: "برای آزمایش می‌توانید با ایمیل demo@caspian.ai و هر رمز عبوری وارد شوید.", en: "For testing, login with demo@caspian.ai and any password." },
  "auth.processing": { fa: "در حال پردازش...", en: "Processing..." },
  "auth.welcomeBack": { fa: "خوش آمدید!", en: "Welcome back!" },
  "auth.signupSuccess": { fa: "ثبت‌نام موفق! ۲۰٬۰۰۰ تومان اعتبار هدیه دریافت کردید.", en: "Sign up successful! You received 20,000 toman bonus credit." },
  "auth.fillAllFields": { fa: "لطفاً تمام فیلدها را پر کنید", en: "Please fill all fields" },
  "auth.enterEmailPassword": { fa: "لطفاً ایمیل و رمز عبور را وارد کنید", en: "Please enter email and password" },
  "auth.logout": { fa: "خروج", en: "Logout" },
  "auth.backToHome": { fa: "بازگشت به خانه", en: "Back to home" },

  // ============ Landing ============
  "landing.badge": { fa: "پلتفرم هوش مصنوعی نسل جدید برای ایران", en: "Next-generation AI platform" },
  "landing.heroTitle": { fa: "کاسپین AI", en: "Caspian AI" },
  "landing.heroHighlight": { fa: "هوش مصنوعی، عمیق و شفاف", en: "Deep & transparent AI" },
  "landing.heroSubtitle": { fa: "به قدرتمندترین مدل‌های هوش مصنوعی جهان — GPT-5.6، Claude Sonnet 5، Gemini 2.5 Pro و ده‌ها مدل دیگر — با شفافیت کامل قیمت و کیف پول تومانی دسترسی داشته باشید. بدون تاریخ انقضا، با درگاه پرداخت امن ایرانی.", en: "Access the world's most powerful AI models — GPT-5.6, Claude Sonnet 5, Gemini 2.5 Pro and dozens more — with transparent pricing and toman wallet. No expiry, secure local payment gateway." },
  "landing.ctaPrimary": { fa: "شروع رایگان با ۲۰٬۰۰۰ تومان اعتبار", en: "Start free with 20,000 toman credit" },
  "landing.ctaSecondary": { fa: "نصب روی سرور خودتان", en: "Self-host on your server" },
  "landing.noForeignCard": { fa: "بدون نیاز به کارت بانکی خارجی", en: "No foreign card needed" },
  "landing.openaiCompatible": { fa: "سازگار با OpenAI API", en: "OpenAI API compatible" },
  "landing.trustedBy": { fa: "به اعتماد کسب‌وکارهای ایرانی", en: "Trusted by businesses" },
  "landing.featuresBadge": { fa: "چرا کاسپین؟", en: "Why Caspian?" },
  "landing.featuresTitle": { fa: "ساخته شده برای ایران", en: "Built for everyone" },
  "landing.featuresSubtitle": { fa: "تمام چیزی که برای استفاده حرفه‌ای از هوش مصنوعی نیاز دارید، در یک پلتفرم یکپارچه — با تمرکز بر شفافیت، امنیت و تجربه کاربری.", en: "Everything you need for professional AI usage, in one unified platform — focused on transparency, security and UX." },
  "landing.modelsBadge": { fa: "مدل‌ها", en: "Models" },
  "landing.modelsTitle": { fa: "یک API، ده‌ها مدل", en: "One API, dozens of models" },
  "landing.modelsSubtitle": { fa: "بهترین مدل‌های هوش مصنوعی جهان را با قیمت‌گذاری شفاف به‌صورت تومانی در دسترس داشته باشید.", en: "Access the best AI models with transparent toman pricing." },
  "landing.agentsBadge": { fa: "عامل‌های تخصصی", en: "Specialized Agents" },
  "landing.agentsTitle": { fa: "دستیارهای آماده برای هر کار", en: "Ready-to-use assistants for every task" },
  "landing.agentsSubtitle": { fa: "عامل‌های از پیش تنظیم شده با پرامپت سیستم تخصصی، برای پاسخ به نیازهای خاص شما — بدون نیاز به دانش پرامپت‌نویسی.", en: "Pre-configured agents with specialized system prompts for specific needs — no prompt engineering required." },
  "landing.pricingBadge": { fa: "قیمت‌گذاری", en: "Pricing" },
  "landing.pricingTitle": { fa: "پلن مناسب خودتان را انتخاب کنید", en: "Choose your plan" },
  "landing.pricingSubtitle": { fa: "فقط برای آنچه استفاده می‌کنید پرداخت می‌کنید. بدون هزینه پنهان، بدون قرارداد طولانی‌مدت.", en: "Pay only for what you use. No hidden fees, no long contracts." },
  "landing.ctaTitle": { fa: "همین امروز شروع کنید", en: "Start today" },
  "landing.ctaSubtitle": { fa: "با ثبت‌نام، ۲۰٬۰۰۰ تومان اعتبار رایگان دریافت کنید. بدون نیاز به کارت بانکی خارجی، بدون تاریخ انقضا.", en: "Sign up and get 20,000 toman free credit. No foreign card, no expiry." },
  "landing.emailPlaceholder": { fa: "ایمیل شما", en: "Your email" },
  "landing.startFree": { fa: "شروع رایگان", en: "Start free" },

  // ============ Nav ============
  "nav.dashboard": { fa: "پیشخوان", en: "Dashboard" },
  "nav.chat": { fa: "چت هوشمند", en: "AI Chat" },
  "nav.apiKeys": { fa: "کلیدهای API", en: "API Keys" },
  "nav.providerKeys": { fa: "کلیدهای پروایدر", en: "Provider Keys" },
  "nav.billing": { fa: "کیف پول و تراکنش‌ها", en: "Wallet & Transactions" },
  "nav.admin": { fa: "پنل مدیریت", en: "Admin Panel" },
  "nav.messages": { fa: "پیام‌ها", en: "Messages" },
  "nav.imageGen": { fa: "تصویرساز", en: "Image Generator" },
  "nav.vision": { fa: "تحلیل تصویر", en: "Image Analysis" },
  "nav.analytics": { fa: "تحلیل و آنالیتیکس", en: "Analytics" },

  // ============ Dashboard ============
  "dashboard.hello": { fa: "سلام", en: "Hello" },
  "dashboard.subtitle": { fa: "خلاصه فعالیت حساب شما در ۷ روز گذشته", en: "Your account activity in the past 7 days" },
  "dashboard.walletBalance": { fa: "موجودی کیف پول", en: "Wallet balance" },
  "dashboard.todayUsage": { fa: "مصرف امروز", en: "Today's usage" },
  "dashboard.activeApiKeys": { fa: "کلیدهای API فعال", en: "Active API keys" },
  "dashboard.weeklyConversations": { fa: "مکالمات هفته", en: "Weekly conversations" },
  "dashboard.recentTransactions": { fa: "تراکنش‌های اخیر", en: "Recent transactions" },
  "dashboard.viewAll": { fa: "مشاهده همه", en: "View all" },
  "dashboard.newConversation": { fa: "شروع مکالمه جدید", en: "New conversation" },
  "dashboard.usage7days": { fa: "مصرف ۷ روز گذشته", en: "7-day usage" },
  "dashboard.usageByModel": { fa: "مصرف بر اساس مدل", en: "Usage by model" },
  "dashboard.chargeWallet": { fa: "شارژ", en: "Charge" },
  "dashboard.lowerThanYesterday": { fa: "کمتر از دیروز", en: "lower than yesterday" },
  "dashboard.higherThanYesterday": { fa: "بیشتر از دیروز", en: "higher than yesterday" },
  "dashboard.newConversations": { fa: "مکالمه جدید", en: "new conversations" },
  "dashboard.weekTotal": { fa: "هفته جاری", en: "This week" },
  "dashboard.ofTotal": { fa: "از", en: "of" },
  "dashboard.keysTotal": { fa: "کلید کل", en: "total keys" },
  "dashboard.requests": { fa: "درخواست", en: "requests" },
  "dashboard.never": { fa: "هرگز", en: "Never" },

  // ============ Chat ============
  "chat.newConversation": { fa: "مکالمه جدید", en: "New conversation" },
  "chat.searchConversations": { fa: "جستجوی مکالمات...", en: "Search conversations..." },
  "chat.noConversationSelected": { fa: "مکالمه‌ای انتخاب نشده", en: "No conversation selected" },
  "chat.selectModel": { fa: "انتخاب مدل", en: "Select model" },
  "chat.noAgent": { fa: "بدون عامل", en: "No agent" },
  "chat.default": { fa: "پیش‌فرض", en: "Default" },
  "chat.defaultModel": { fa: "پیش‌فرض مدل", en: "Default" },
  "chat.inputPlaceholder": { fa: "پیام خود را بنویسید... (Enter برای ارسال)", en: "Type your message... (Enter to send)" },
  "chat.sendHint": { fa: "Enter برای ارسال • Shift+Enter برای خط جدید", en: "Enter to send • Shift+Enter for new line" },
  "chat.startNewConversation": { fa: "شروع یک مکالمه جدید", en: "Start a new conversation" },
  "chat.startNewConversationDesc": { fa: "از مدل‌های قدرتمند جهانی برای پاسخ به سوالات خود استفاده کنید. کافی است پیام خود را در کادر زیر بنویسید.", en: "Use powerful global models to answer your questions. Just type your message below." },
  "chat.noConversations": { fa: "مکالمه‌ای یافت نشد", en: "No conversations found" },
  "chat.conversationDeleted": { fa: "مکالمه حذف شد", en: "Conversation deleted" },
  "chat.copied": { fa: "متن کپی شد", en: "Text copied" },
  "chat.copy": { fa: "کپی", en: "Copy" },
  "chat.tokens": { fa: "توکن", en: "tokens" },
  "chat.agent": { fa: "عامل", en: "Agent" },
  "chat.showConversations": { fa: "نمایش مکالمات", en: "Show conversations" },
  "chat.selectAgentTitle": { fa: "عامل تخصصی", en: "Specialized agent" },
  "chat.noAgentDesc": { fa: "مدل خام بدون پرامپت سیستمی", en: "Raw model without system prompt" },
  "chat.selectModelTitle": { fa: "انتخاب مدل هوش مصنوعی", en: "Select AI model" },
  "chat.providerKeyTitle": { fa: "کلید پروایدر (برای این مکالمه)", en: "Provider key (for this conversation)" },
  "chat.defaultModelDesc": { fa: "از کلید پیش‌فرض پروایدر مدل استفاده می‌شود", en: "Uses the model's default provider key" },

  // ============ API Keys ============
  "apiKeys.title": { fa: "کلیدهای API", en: "API Keys" },
  "apiKeys.subtitle": { fa: "کلیدهای API برای دسترسی برنامه‌نویسی به پلتفرم کاسپین", en: "API keys for programmatic access to Caspian platform" },
  "apiKeys.create": { fa: "ساخت کلید جدید", en: "Create new key" },
  "apiKeys.note": { fa: "نکته مهم: کلیدهای API فقط یک بار هنگام ساخت نمایش داده می‌شوند. حتماً آن را در جای امنی ذخیره کنید. در صورت گم شدن، باید کلید را حذف و کلید جدید بسازید.", en: "Important: API keys are shown only once at creation. Save it in a safe place. If lost, you must delete and create a new key." },
  "apiKeys.totalKeys": { fa: "کل کلیدها", en: "Total keys" },
  "apiKeys.activeKeys": { fa: "فعال", en: "Active" },
  "apiKeys.inactiveKeys": { fa: "غیرفعال", en: "Inactive" },
  "apiKeys.key": { fa: "کلید", en: "Key" },
  "apiKeys.lastUsed": { fa: "آخرین استفاده", en: "Last used" },
  "apiKeys.createdAt": { fa: "تاریخ ساخت", en: "Created at" },
  "apiKeys.createTitle": { fa: "ساخت کلید API جدید", en: "Create new API key" },
  "apiKeys.createDesc": { fa: "یک نام توصیفی برای کلید انتخاب کنید تا بعداً راحت پیدایش کنید.", en: "Choose a descriptive name so you can find it later." },
  "apiKeys.keyName": { fa: "نام کلید", en: "Key name" },
  "apiKeys.keyNamePlaceholder": { fa: "مثلاً: اپ پروداکشن، ربات تلگرام...", en: "e.g. Production app, Telegram bot..." },
  "apiKeys.created": { fa: "کلید ساخته شد!", en: "Key created!" },
  "apiKeys.createdDesc": { fa: "این کلید فقط یک بار نمایش داده می‌شود. همین حالا کپی و در جای امن ذخیره کنید.", en: "This key is shown only once. Copy and save it now." },
  "apiKeys.copyKey": { fa: "کپی کلید", en: "Copy key" },
  "apiKeys.deleteConfirm": { fa: "حذف کلید API؟", en: "Delete API key?" },
  "apiKeys.quickstart": { fa: "شروع سریع", en: "Quick start" },
  "apiKeys.quickstartDesc": { fa: "کاسپین AI کاملاً با OpenAI API سازگار است. فقط کافی است URL پایه را تغییر دهید و کلید خود را در هدر قرار دهید:", en: "Caspian AI is fully OpenAI API compatible. Just change the base URL and add your key to the header:" },

  // ============ Provider Keys ============
  "providerKeys.title": { fa: "کلیدهای پروایدر", en: "Provider Keys" },
  "providerKeys.subtitle": { fa: "کلیدهای API پروایدرهای هوش مصنوعی (OpenRouter، OpenAI، Anthropic و...) برای اتصال مستقیم", en: "API keys for AI providers (OpenRouter, OpenAI, Anthropic, etc.) for direct connection" },
  "providerKeys.add": { fa: "افزودن کلید پروایدر", en: "Add provider key" },
  "providerKeys.edit": { fa: "ویرایش", en: "Edit" },
  "providerKeys.editKey": { fa: "ویرایش کلید پروایدر", en: "Edit provider key" },
  "providerKeys.addNew": { fa: "افزودن کلید پروایدر جدید", en: "Add new provider key" },
  "providerKeys.noKeys": { fa: "هیچ کلید پروایدری اضافه نشده", en: "No provider keys added" },
  "providerKeys.noKeysDesc": { fa: "برای شروع استفاده از چت هوشمند، حداقل یک کلید پروایدر اضافه کنید", en: "Add at least one provider key to start using AI chat" },
  "providerKeys.addFirst": { fa: "افزودن اولین کلید", en: "Add first key" },
  "providerKeys.supportedProviders": { fa: "پروایدرهای پشتیبانی شده", en: "Supported providers" },

  // ============ Billing ============
  "billing.title": { fa: "کیف پول و تراکنش‌ها", en: "Wallet & Transactions" },
  "billing.subtitle": { fa: "مدیریت موجودی حساب و مشاهده تاریخچه کامل تراکنش‌ها", en: "Manage your balance and view transaction history" },
  "billing.currentBalance": { fa: "موجودی فعلی", en: "Current balance" },
  "billing.chargeWallet": { fa: "شارژ کیف پول", en: "Charge wallet" },
  "billing.totalDeposits": { fa: "کل شارژها", en: "Total deposits" },
  "billing.totalUsage": { fa: "کل مصرف", en: "Total usage" },
  "billing.transactions": { fa: "تاریخچه تراکنش‌ها", en: "Transaction history" },
  "billing.deposit": { fa: "شارژ", en: "Deposit" },
  "billing.usage": { fa: "مصرف", en: "Usage" },
  "billing.refund": { fa: "بازگشت", en: "Refund" },
  "billing.balanceAfter": { fa: "موجودی بعد", en: "Balance after" },
  "billing.depositTitle": { fa: "شارژ کیف پول", en: "Charge wallet" },
  "billing.customAmount": { fa: "مبلغ دلخواه (تومان)", en: "Custom amount (toman)" },
  "billing.redirecting": { fa: "در حال انتقال به درگاه...", en: "Redirecting to gateway..." },
  "billing.continueToGateway": { fa: "ادامه به درگاه نکست‌پی", en: "Continue to NextPay" },
  "billing.minAmount": { fa: "حداقل مبلغ شارژ ۱۰٬۰۰۰ تومان است", en: "Minimum deposit is 10,000 toman" },
  "billing.chargedSuccess": { fa: "به کیف پول شما اضافه شد", en: "added to your wallet" },
  "billing.transactionId": { fa: "شناسه تراکنش", en: "Transaction ID" },
  "billing.sslEncrypted": { fa: "SSL رمزنگاری", en: "SSL encrypted" },
  "billing.secureGateway": { fa: "درگاه امن", en: "Secure gateway" },
  "billing.noFee": { fa: "بدون کارمزد", en: "No fee" },
  "billing.gatewayFee": { fa: "کارمزد درگاه", en: "Gateway fee" },
  "billing.free": { fa: "رایگان", en: "Free" },
  "billing.payable": { fa: "مبلغ قابل پرداخت", en: "Payable amount" },
  "billing.depositAmount": { fa: "مبلغ شارژ", en: "Deposit amount" },

  // ============ Admin ============
  "admin.title": { fa: "پنل مدیریت", en: "Admin Panel" },
  "admin.subtitle": { fa: "مدیریت کامل پلتفرم کاسپین AI — مدل‌ها، عامل‌ها، قیمت‌گذاری و محتوا", en: "Full management of Caspian AI platform" },
  "admin.dashboard": { fa: "داشبورد", en: "Dashboard" },
  "admin.models": { fa: "مدل‌ها", en: "Models" },
  "admin.agents": { fa: "عامل‌ها", en: "Agents" },
  "admin.pricing": { fa: "قیمت‌گذاری", en: "Pricing" },
  "admin.content": { fa: "محتوای سایت", en: "Site Content" },
  "admin.modules": { fa: "ماژول‌ها", en: "Modules" },
  "admin.users": { fa: "کاربران", en: "Users" },
  "admin.system": { fa: "سیستم", en: "System" },
  "admin.totalUsers": { fa: "کل کاربران", en: "Total users" },
  "admin.todayRevenue": { fa: "درآمد امروز", en: "Today's revenue" },
  "admin.todayRequests": { fa: "درخواست‌های امروز", en: "Today's requests" },
  "admin.topModel": { fa: "مدل محبوب امروز", en: "Top model today" },
  "admin.revenue7days": { fa: "درآمد ۷ روز گذشته", en: "7-day revenue" },
  "admin.walletDeposits": { fa: "شارژ کیف پول", en: "Wallet deposits" },
  "admin.apiUsage": { fa: "مصرف API", en: "API usage" },
  "admin.modelUsage": { fa: "مصرف مدل‌ها", en: "Model usage" },
  "admin.tokensUsed": { fa: "تعداد توکن مصرف‌شده", en: "Tokens used" },
  "admin.modelShare": { fa: "سهم مدل‌ها از هزینه", en: "Model cost share" },
  "admin.growth": { fa: "رشد", en: "growth" },
  "admin.monthlyGrowth": { fa: "رشد ماهانه", en: "monthly growth" },
  "admin.higherYesterday": { fa: "بیشتر از دیروز", en: "higher than yesterday" },
  "admin.requestsLabel": { fa: "درخواست", en: "requests" },

  // ============ Footer ============
  "footer.product": { fa: "محصول", en: "Product" },
  "footer.features": { fa: "امکانات", en: "Features" },
  "footer.models": { fa: "مدل‌ها", en: "Models" },
  "footer.pricing": { fa: "قیمت‌گذاری", en: "Pricing" },
  "footer.selfHost": { fa: "نصب روی سرور", en: "Self-host" },
  "footer.legal": { fa: "قوانین", en: "Legal" },
  "footer.terms": { fa: "قوانین و مقررات", en: "Terms of service" },
  "footer.privacy": { fa: "حریم خصوصی", en: "Privacy policy" },
  "footer.refund": { fa: "سیاست بازگشت وجه", en: "Refund policy" },
  "footer.sla": { fa: "SLA", en: "SLA" },
  "footer.contact": { fa: "ارتباط با ما", en: "Contact us" },
  "footer.telegramChannel": { fa: "کانال تلگرام", en: "Telegram channel" },
  "footer.madeWith": { fa: "ساخته شده با ❤️ در ایران", en: "Made with ❤️" },

  // ============ Time ============
  "time.now": { fa: "هم‌اکنون", en: "Just now" },
  "time.minutesAgo": { fa: "دقیقه پیش", en: "minutes ago" },
  "time.hoursAgo": { fa: "ساعت پیش", en: "hours ago" },
  "time.daysAgo": { fa: "روز پیش", en: "days ago" },
};

// ============ i18n Store ============

interface I18nState {
  locale: Locale;
  detectedLocale: Locale | null;
  hasUserChoice: boolean;
  setLocale: (locale: Locale, isUserChoice?: boolean) => void;
  detectFromIP: () => Promise<void>;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: "fa",
      detectedLocale: null,
      hasUserChoice: false,
      setLocale: (locale, isUserChoice = true) =>
        set({ locale, hasUserChoice: isUserChoice }),
      detectFromIP: async () => {
        if (get().hasUserChoice) return;
        try {
          const res = await fetch("https://ipapi.co/json/");
          if (res.ok) {
            const data = await res.json();
            const locale = localeFromCountry(data.country_code);
            set({ locale, detectedLocale: locale });
          }
        } catch {
          // fail silently
        }
      },
    }),
    {
      name: "caspian-i18n",
    }
  )
);

// ============ Helper: useT hook ============

export function useT() {
  const locale = useI18n((s) => s.locale);
  return (key: string, params?: Record<string, string | number>): string => {
    const entry = translations[key];
    if (!entry) return key;
    let text = entry[locale] || entry.fa;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return text;
  };
}

export function useDir(): "rtl" | "ltr" {
  const locale = useI18n((s) => s.locale);
  return LOCALES.find((l) => l.code === locale)?.dir || "rtl";
}
