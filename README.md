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



## ⚖️ License
MIT License. Built for satirical dev fun.

