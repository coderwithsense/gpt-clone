# 💬 ChatGPT Clone

A powerful full-stack, streaming-capable ChatGPT clone built with Next.js, Clerk, Prisma, OpenAI/Gemini models, and markdown-rich UI. Supports real-time chat, persistent history, and seamless extensibility.

---

## 🚀 Features

* 🔐 Authentication via Clerk
* 💾 Persistent chats with Prisma + PostgreSQL
* 💬 Real-time AI streaming with `@ai-sdk`
* 🤖 Model switching support (OpenAI, Gemini)
* 🎨 Markdown + syntax highlighting (ReactMarkdown + Rehype)
* 📎 File upload, 🎤 voice input hooks (UI-ready)
* 🧪 Plug-and-play backend logic for future expansion

---

## 🧰 Tech Stack

| Layer    | Tech                                    |
| -------- | --------------------------------------- |
| Frontend | Next.js (App Router), Tailwind, ShadCN  |
| Auth     | Clerk                                   |
| Backend  | AI SDK (`@ai-sdk/react`), Vercel Edge   |
| DB       | Prisma + PostgreSQL                     |
| Models   | OpenAI GPT-4o, Gemini 1.5 (via wrapper) |

---

## 📸 UI Overview

```
[ Chat Box ]
┌────────────────────────────────────────────┐
│ AI: Hello! How can I help you today?       │
│ You: What is LangGraph?                    │
│ AI: LangGraph is a framework built on...   │
└────────────────────────────────────────────┘

[ Input Field ]
───────────────────────────────────────────────
[ 📎 ] [ 🎤 ] Ask anything... [ ⬆️ ]
```

---

## ⚙️ Setup Guide

### 1. Clone the Repo

```bash
git clone https://github.com/yourname/chatgpt-clone.git
cd chatgpt-clone
```

### 2. Install Dependencies

```bash
yarn install # or npm install
```

### 3. Configure Environment

Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/yourdb
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_CLERK_FRONTEND_API=...
```

### 4. Generate Prisma Client

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Dev Server

```bash
yarn dev
```

Open `http://localhost:3000` 🎉

---

## 🧑‍💻 Contribution Guide

### 💡 Ways to Contribute

* Add support for Claude/Mistral models
* Improve mobile responsiveness
* Add message editing/deletion
* Add image/file parsing
* Add agent memory (LangGraph-compatible)

### 🧪 Running Tests

To be added (PRs welcome!)

### 🧼 Linting & Formatting

```bash
yarn lint
```

### ✉️ Submit a PR

1. Fork this repo
2. Create your branch (`git checkout -b feat/your-feature`)
3. Commit your changes
4. Push and open a PR

---

## 📦 Folder Structure (important ones)

```
.
├── app/
│   └── c/[chatId]/page.tsx     # Chat UI
├── lib/
│   ├── api.ts                  # DB queries
│   ├── prisma.ts               # Prisma client
│   └── models.ts               # AI model config
├── services/
│   └── chat.service.ts         # Logic to talk to AI
├── components/
│   └── ChatInterface.tsx       # Full chat interface
├── pages/
│   └── api/chats/route.ts      # Streaming AI route
```

---

## 🤝 Credits

Built by [YourName](https://github.com/yourname), powered by OpenAI + Gemini.

PRs, stars, forks welcome! ⭐
