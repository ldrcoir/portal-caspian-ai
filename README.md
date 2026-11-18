# Caspian AI — Modular CRM Platform

پلتفرم هوش مصنوعی کاسپین — یک CRM ماژولار کامل با چت هوشمند، تصویرساز، تحلیل تصویر، تبدیل صدا، سیستم پرداخت، پیام‌رسانی و پشتیبانی هوش مصنوعی.

## ✨ Features

- **Modular Architecture** — Module Registry with Event Bus
- **Multi-language** — Persian (RTL) + English (LTR) with IP auto-detection
- **AI Chat** — OpenAI-compatible API proxy
- **Image Generation** — DALL-E 3 + Stable Diffusion
- **Vision Analysis** — Upload image, ask questions
- **Voice** — Speech-to-Text (Whisper) + Text-to-Speech
- **Payment Gateways** — NextPay + Zarinpal (pluggable)
- **Messaging** — User↔Admin with spam protection
- **AI Support** — Sandboxed AI support (never gives admin/DB access)
- **Admin Panel** — 10 tabs with full CRUD on everything

## 🛠️ Tech Stack

- Next.js 16 with App Router
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Zustand for state management
- Recharts for charts
- Lucide React for icons

## 📦 Modules

| Module | Type | Description |
|--------|------|-------------|
| payment-nextpay | payment | NextPay gateway |
| payment-zarinpal | payment | Zarinpal gateway |
| feature-messages | feature | Messaging with spam protection |
| feature-support | ai | Sandboxed AI support |
| feature-image-gen | feature | Image generation |
| feature-vision | feature | Image analysis |
| feature-voice | feature | STT + TTS |

## 🚀 Quick Start

```bash
bun install
bun run dev
```

Open http://localhost:3000

## 📖 Documentation

See `download/` folder for:
- `caspian-source-code-doc.docx` — Source code explanation (Persian)
- `caspian-vps-deployment-guide.docx` — VPS deployment guide (Persian)

## 🔐 Security

- Rate limiting on messaging
- AI support sandbox with forbidden keywords
- AI never accesses admin/database/keys
- Input sanitization

## 📄 License

MIT
