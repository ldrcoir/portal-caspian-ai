import type { Metadata } from "next";
import { Vazirmatn, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caspian AI | هوش مصنوعی، عمیق و شفاف",
  description:
    "پلتفرم هوش مصنوعی کاسپین — دسترسی به قدرتمندترین مدل‌های جهان با شفافیت کامل قیمت، کیف پول تومانی و درگاه پرداخت امن.",
  keywords: [
    "Caspian AI",
    "کاسپین AI",
    "AI",
    "ChatGPT",
    "Claude",
    "OpenRouter",
    "API",
  ],
  authors: [{ name: "Caspian AI Team" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Set dir/lang from localStorage before hydration to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = JSON.parse(localStorage.getItem('caspian-i18n') || '{}');
                const locale = stored?.state?.locale || 'fa';
                const dir = locale === 'en' ? 'ltr' : 'rtl';
                document.documentElement.lang = locale;
                document.documentElement.dir = dir;
              } catch (e) {
                document.documentElement.lang = 'fa';
                document.documentElement.dir = 'rtl';
              }
            `,
          }}
        />
      </head>
      <body
        className={`${vazirmatn.variable} ${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
