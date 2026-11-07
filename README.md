# 🔥 GitShame — The Brutally Honest GitHub Profile Roaster

> Put your code sins, 3 AM panic commits, and 14 abandoned repositories on public trial.

**GitShame** is a viral, full-stack web application that inspects any GitHub developer profile and public repositories to diagnose technical debt, extract cursed commit messages, calculate late-night coding habits, and generate a shareable **"Developer Psychological Evaluation"** card.

Built for 100% free hosting and zero API costs.

---

## ✨ Standout Features

- 🔥 **4 Satirical Roast Personas**:
  - **Savage** (Gordon Ramsay & Tech Twitter insult style)
  - **Corporate HR** (Passive-aggressive LinkedIn jargon & 360-review corporate speak)
  - **10x Boomer** (Graybeard architect screaming about punch cards and 500MB `node_modules`)
  - **FBI Profiler** (Criminal psychological profiling of nocturnal code sins)
- 🩻 **Cursed Commit Hall of Shame**: Automatically detects and showcases real embarrassing commit messages (e.g. `"fix"`, `"asdasd"`, `"please work"`, `"why"`, `"fuck this"`, `"revert revert"`) with exact timestamps and sarcastic AI verdicts.
- 🌙 **Nocturnal Degeneracy Meter**: Tracks commit timestamps between 12:00 AM and 5:00 AM to calculate caffeine-to-despair ratios.
- 🪦 **Graveyard of Abandoned Repos**: Counts dormant projects that died after 1 initial commit.
- ⚔️ **Repo Fight (1v1 Battle Mode)**: Pit two developers head-to-head (you vs your friend or boss) to see who takes home the official **Crown of Shame**.
- 📸 **1-Click Shareable PNG Card**: Instant high-resolution image generation powered by `html-to-image` and celebration confetti, optimized for sharing on **X (Twitter)**, **LinkedIn**, and **Reddit (r/programmerhumor)**.
- ⭐️ **Pre-Loaded Hall of Shame**: One-click preview roasts for tech celebrities like Linus Torvalds, Dan Abramov, and shadcn.

---

## 🛠️ Architecture & Free-Tier Engineering

GitShame is designed to cost **$0.00** to run, even if it goes viral on Reddit or Twitter:

| Layer | Technology | Free Tier Strategy |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router), React 19, TypeScript | Serverless, Edge-ready, fast SSG/SSR |
| **Styling** | Tailwind CSS, Lucide React, Canvas Confetti | Cyberpunk dark aesthetic with glow gradients |
| **AI Engine** | Google Gemini 1.5 Flash (`@google/generative-ai`) | Up to 1,500 requests/day for $0.00 free |
| **Fallback Engine** | Built-in Heuristic Satire Synthesizer | **Zero API key required**; generates dynamic roasts out-of-the-box if no key is provided |
| **Cache & Throttling** | In-Memory TTL Cache (6-hour expiry) | Instant sub-50ms repeat loads, preserves API limits |
| **Export Engine** | `html-to-image` client-side canvas rendering | Zero server CPU or GPU cost for image generation |

---

## 💼 Bullet Points for Your Resume

You can proudly add this project to your resume under **Projects**:

> **GitShame — Full-Stack AI Developer Profile Roaster & Benchmarking Platform**  
> *Next.js 15, TypeScript, React 19, Tailwind CSS, Google Gemini API, GitHub REST API, html-to-image*
> - Engineered an interactive developer analytics platform that audits public GitHub commits, repo longevity, and commit timestamp distributions to generate satirical technical debt evaluations and 1v1 battle comparisons.
> - Implemented resilient LLM prompt orchestration using Google Gemini Flash with strict JSON schema validation, backed by an offline heuristic fallback engine and a TTL in-memory caching layer to eliminate API costs and withstand traffic spikes.
> - Built a client-side vector-to-raster graphic export engine with `html-to-image`, enabling instantaneous client-side PNG generation for viral social sharing on X/Twitter and LinkedIn without consuming server compute.
> - Designed full responsive dark-mode UI with custom animations, dynamic loading sequences, and sub-100ms UI state transitions.

---

## 🚀 Quick Start (Running Locally)

### 1. Clone & Install
\`\`\`bash
cd "Git Shame"
npm install
\`\`\`

### 2. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your keys (both optional! The app works out of the box even without them):
\`\`\`env
# Free Google AI Studio API Key: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: GitHub token to increase rate limit from 60 to 5,000 req/hr
GITHUB_TOKEN=your_github_personal_access_token
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 🚢 1-Click Free Deployment (Vercel)

1. Push this project to your GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repo and hit **Deploy**.
4. (Optional) In Vercel Project Settings > Environment Variables, add `GEMINI_API_KEY` for live AI generation.

---

## ⚖️ License
MIT License. Built for satirical dev fun.
