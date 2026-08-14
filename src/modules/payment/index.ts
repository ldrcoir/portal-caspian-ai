"use client";

import { CreditCard, Shield } from "lucide-react";
import type { ModuleManifest, PaymentGatewayManifest } from "../registry";

const NEXTPAY_CONFIG_SCHEMA = [
  { key: "apiKey", label: "کلید API نکست‌پی", type: "password" as const, placeholder: "nextpay_api_key...", defaultValue: "", description: "کلید API از پنل نکست‌پی", required: true },
  { key: "callbackUrl", label: "آدرس بازگشت", type: "text" as const, placeholder: "https://yoursite.com/api/billing/callback", defaultValue: "", description: "آدرس بازگشت کاربر پس از پرداخت" },
  { key: "testMode", label: "حالت تست", type: "boolean" as const, defaultValue: true, description: "در حالت تست پرداخت واقعی انجام نمی‌شود" },
];

const NEXTPAY_GATEWAY: PaymentGatewayManifest = {
  id: "nextpay", moduleId: "payment-nextpay", name: "نکست‌پی (NextPay)", description: "درگاه پرداخت امن و رایج ایرانی", icon: "CreditCard", color: "#38BDF8", isEnabled: true,
  config: { apiKey: "", callbackUrl: "", testMode: true },
  configSchema: NEXTPAY_CONFIG_SCHEMA,
  requestPayment: async (amount, callbackUrl, config) => {
    const transId = `np-${Math.floor(Math.random() * 9000000) + 1000000}`;
    return { redirectUrl: `https://api.nextpay.org/gateway/payment/${transId}`, transId };
  },
  verifyPayment: async (transId, amount, config) => true,
};

export const nextPayModule: ModuleManifest = {
  id: "payment-nextpay", name: "درگاه پرداخت نکست‌پی", description: "ماژول درگاه پرداخت نکست‌پی — پیش‌فرض پلتفرم کاسپین.", version: "1.0.0", author: "Caspian AI Team", icon: "CreditCard", type: "payment", isEnabled: true, isCore: false,
  config: { apiKey: "", callbackUrl: "", testMode: true }, configSchema: NEXTPAY_CONFIG_SCHEMA,
  paymentGateways: [NEXTPAY_GATEWAY],
};

const ZARINPAL_CONFIG_SCHEMA = [
  { key: "merchantId", label: "مرچنت کد زرین‌پال", type: "password" as const, placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", defaultValue: "", description: "مرچنت کد از پنل زرین‌پال", required: true },
  { key: "callbackUrl", label: "آدرس بازگشت", type: "text" as const, placeholder: "https://yoursite.com/api/billing/callback/zarinpal", defaultValue: "" },
  { key: "sandbox", label: "حالت سندباکس", type: "boolean" as const, defaultValue: false },
];

const ZARINPAL_GATEWAY: PaymentGatewayManifest = {
  id: "zarinpal", moduleId: "payment-zarinpal", name: "زرین‌پال (Zarinpal)", description: "درگاه پرداخت زرین‌پال", icon: "Shield", color: "#FBBF24", isEnabled: false,
  config: { merchantId: "", callbackUrl: "", sandbox: true },
  configSchema: ZARINPAL_CONFIG_SCHEMA,
  requestPayment: async (amount, callbackUrl, config) => {
    const transId = `zp-${Math.floor(Math.random() * 9000000) + 1000000}`;
    return { redirectUrl: `https://www.zarinpal.com/pg/StartPay/${transId}`, transId };
  },
  verifyPayment: async (transId, amount, config) => true,
};

export const zarinpalModule: ModuleManifest = {
  id: "payment-zarinpal", name: "درگاه پرداخت زرین‌پال", description: "ماژول درگاه پرداخت زرین‌پال — برای فعال‌سازی مرچنت کد وارد کنید.", version: "1.0.0", author: "Caspian AI Team", icon: "Shield", type: "payment", isEnabled: false, isCore: false,
  config: { merchantId: "", callbackUrl: "", sandbox: true }, configSchema: ZARINPAL_CONFIG_SCHEMA,
  paymentGateways: [ZARINPAL_GATEWAY],
};
