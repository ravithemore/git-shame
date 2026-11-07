# 🔥 GitShame — Your GitHub Profile Is on Trial

<p align="center">
  <strong>Your commits. Your coding habits. Your questionable life choices.</strong>
  <br />
  A brutally honest roast of your GitHub profile.
</p>

<p align="center">
  <a href="https://gitshame.vercel.app/">🚀 Try GitShame</a>
  &nbsp;·&nbsp;
  <a href="https://github.com/ravithemore/git-shame">⭐ View Source</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 🤔 What is GitShame?

Ever looked at someone's GitHub profile and wondered what their commit history says about them?

GitShame takes a look.

It analyzes public GitHub profile and repository activity to uncover abandoned projects, questionable commit messages, late-night coding habits, and other developer patterns.

Then it turns those findings into a hilarious developer roast.

Whether you're a clean-code enthusiast or someone whose commit history is just `fix`, `final`, `final-final`, and `please-work` — GitShame has something to say about you.

**No judgment. Just data. And a little humiliation.**

## ✨ Features

### 🔥 1. Four Roast Personas

Choose how brutally you want your GitHub profile evaluated.

- **Savage Mode:** No mercy. Your coding history gets the treatment it deserves.
- **Corporate HR:** Performance reviews, corporate jargon, and passive-aggressive feedback.
- **10x Boomer:** Old-school engineering wisdom with absolutely zero patience.
- **FBI Profiler:** A psychological investigation into your developer habits.

### 🩻 2. Cursed Commit Hall of Shame

Find the questionable commit messages hiding in your history.

Examples:
- `fix`
- `final`
- `asdasd`
- `please work`
- `why`
- `revert revert`

Your commit history might be public, but it was never ready for this level of scrutiny.

### 🌙 3. Nocturnal Coding Meter

Discover how much of your development activity happens between midnight and 5 AM.

Because sometimes the best code is written at 2 AM. And sometimes it's just caffeine and bad decisions.

### 🪦 4. Abandoned Repository Detector

Find repositories that appear to have been abandoned.

Start a project. Push the first commit. Disappear forever.

GitShame remembers.

### ⚔️ 5. Repo Fight — 1v1 Battle

Compare two GitHub profiles and find out who deserves the Crown of Shame.

Challenge a friend, teammate, or your boss.

### 📸 6. Shareable Roast Cards

Generate downloadable PNG roast cards and share your developer evaluation with friends or across social platforms.

### ⭐ 7. Preloaded Hall of Shame

Explore sample roasts using selected well-known developer profiles without having to enter a username first.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 | Full-stack application framework |
| React 19 | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling |
| Google Generative AI SDK | AI-powered roasting (optional) |
| GitHub API | Public profile and repository data |
| html-to-image | Roast card generation |
| canvas-confetti | Celebration effects |
| Lucide React | Icons |

## 🚀 Run Locally

### Prerequisites

- Node.js (compatible with your installed Next.js version)
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ravithemore/git-shame.git
cd git-shame
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your API keys if you want to use the optional integrations:

```env
# Optional: Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key

# Optional: GitHub Personal Access Token
GITHUB_TOKEN=your_github_token
```

**Note:** GitShame includes a heuristic roast fallback, so the Gemini key is optional. A GitHub token can help increase API rate limits.

Never commit your actual `.env.local` file or expose API keys in client-side code.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create a production build

```bash
npm run build
npm start
```

---

## 🔐 Privacy & Data

- GitShame analyzes publicly available GitHub profile and repository information.
- Optional API integrations require environment variables.
- Never publish your personal access tokens or API keys.
- Roast results are intended for entertainment and should not be treated as a professional assessment of a developer's skills.

## 💡 Why I Built This

GitHub profiles tell stories. Some tell stories of consistency, some of ambitious side projects, and some of repositories that haven't been touched since 2022.

GitShame was built to turn those patterns into an entertaining experience for developers.

It's a little bit of data analysis, a little bit of AI, and a whole lot of developer humor.

## 🤝 Contributing

Found a bug or have an idea for a new roast persona?

Contributions, feature suggestions, and pull requests are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Open a pull request.

## 📬 Connect

**Built by [Ravi Damor](https://github.com/ravithemore)**

- GitHub: [@ravithemore](https://github.com/ravithemore)
- Project: [GitShame](https://github.com/ravithemore/git-shame)
- Live Demo: [gitshame](https://gitshame.vercel.app/)

---

<p align="center">
  <strong>If GitShame roasted your profile, give it a ⭐</strong>
  <br />
  No hard feelings. Your commit history is still questionable.
</p>
