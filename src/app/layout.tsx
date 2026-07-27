import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کاسپین AI | هوش مصنوعی، عمیق و شفاف",
  description:
    "پلتفرم هوش مصنوعی کاسپین — دسترسی به قدرتمندترین مدل‌های جهان با شفافیت کامل قیمت، کیف پول تومانی و درگاه پرداخت امن.",
  keywords: [
    "کاسپین AI",
    "هوش مصنوعی",
    "ChatGPT",
    "Claude",
    "OpenRouter",
    "API ایرانی",
    "درگاه پرداخت",
  ],
  authors: [{ name: "Caspian AI Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "کاسپین AI",
    description: "هوش مصنوعی، عمیق و شفاف",
    siteName: "کاسپین AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
