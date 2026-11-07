"use client";

import React, { useState, useEffect } from "react";
import { Flame, Swords, Search, Sparkles, AlertCircle, RefreshCw, Briefcase, UserCheck, ShieldAlert } from "lucide-react";
import { RoastTone } from "@/types";

interface SearchHeroProps {
  onRoastSubmit: (username: string, tone: RoastTone) => Promise<void>;
  onBattleSubmit: (user1: string, user2: string) => Promise<void>;
  loading: boolean;
  activeTone: RoastTone;
  setActiveTone: (tone: RoastTone) => void;
  initialUsername?: string;
}

const TONES: { id: RoastTone; name: string; emoji: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: "savage",
    name: "Savage",
    emoji: "🔥",
    desc: "Brutal tech Twitter & Gordon Ramsay insult style",
    icon: <Flame className="w-4 h-4 text-rose-500" />,
  },
  {
    id: "corporate",
    name: "Corporate HR",
    emoji: "💼",
    desc: "Passive-aggressive LinkedIn & 360 review jargon",
    icon: <Briefcase className="w-4 h-4 text-sky-400" />,
  },
  {
    id: "boomer",
    name: "10x Boomer",
    emoji: "👴",
    desc: "Graybeard architect screaming about 500MB node_modules",
    icon: <UserCheck className="w-4 h-4 text-amber-400" />,
  },
  {
    id: "fbi",
    name: "FBI Profiler",
    emoji: "🕵️",
    desc: "Criminal code analysis & nocturnal dev psychology",
    icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />,
  },
];

const QUICK_CHIPS = [
  { label: "Linus Torvalds", handle: "torvalds" },
  { label: "shadcn", handle: "shadcn" },
  { label: "Dan Abramov", handle: "gaearon" },
  { label: "Evan You", handle: "yyx990803" },
  { label: "TJ Holowaychuk", handle: "tj" },
];

const LOADING_STEPS = [
  "Cloning psychological baggage...",
  "Auditing 3:42 AM commit sins...",
  "Measuring emotional damage vs test coverage...",
  "Consulting the High Council of Code Reviewers...",
  "Synthesizing maximum disrespect...",
];

export function SearchHero({
  onRoastSubmit,
  onBattleSubmit,
  loading,
  activeTone,
  setActiveTone,
  initialUsername = "",
}: SearchHeroProps) {
  const [tab, setTab] = useState<"solo" | "vs">("solo");
  const [username, setUsername] = useState(initialUsername);
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingTextIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSoloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || loading) return;
    onRoastSubmit(username.trim(), activeTone);
  };

  const handleVsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user1.trim() || !user2.trim() || loading) return;
    onBattleSubmit(user1.trim(), user2.trim());
  };

  return (
    <section className="relative pt-12 pb-10 px-4 max-w-4xl mx-auto text-center">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-6 animate-pulse">
        <Flame className="w-3.5 h-3.5" />
        <span>Brutally Honest GitHub Profile Roaster</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
        Put Your Code Sins <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-400 to-amber-300">
          On Public Trial
        </span>
      </h1>

      <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-8">
        Drop any GitHub handle to inspect cursed commits, 3 AM panic pushes, ghost repos, and receive an unfiltered AI developer psychological evaluation.
      </p>

      {/* Tab Switcher: Solo vs Battle */}
      <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 mb-8">
        <button
          type="button"
          onClick={() => setTab("solo")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "solo"
              ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white shadow-md shadow-rose-500/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Solo Roast</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("vs")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "vs"
              ? "bg-gradient-to-r from-purple-600 to-rose-500 text-white shadow-md shadow-purple-500/20"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Repo Fight (1v1)</span>
        </button>
      </div>

      {tab === "solo" ? (
        <div className="space-y-6">
          {/* Tone Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTone(t.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  activeTone === t.id
                    ? "bg-zinc-800/90 border-rose-500/60 text-white shadow-lg shadow-rose-500/10 scale-102"
                    : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                }`}
              >
                <div className="text-lg mb-1">{t.emoji}</div>
                <span className="font-semibold">{t.name}</span>
                <span className="text-[10px] text-zinc-500 truncate max-w-full mt-0.5">{t.desc.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleSoloSubmit} className="max-w-xl mx-auto">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-zinc-500 font-mono text-lg font-bold">@</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="github_username (e.g. torvalds)"
                disabled={loading}
                className="w-full pl-10 pr-36 py-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 text-base font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all shadow-xl"
              />
              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Roasting...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    <span>Roast Me</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Target Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-zinc-500">
            <span>Quick victims:</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.handle}
                type="button"
                onClick={() => {
                  setUsername(chip.handle);
                  onRoastSubmit(chip.handle, activeTone);
                }}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-mono transition-colors"
              >
                @{chip.handle}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* VS Battle Form */
        <form onSubmit={handleVsSubmit} className="max-w-xl mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-zinc-500 font-mono font-bold">@</span>
              <input
                type="text"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                placeholder="Developer 1"
                disabled={loading}
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-zinc-500 font-mono font-bold">@</span>
              <input
                type="text"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                placeholder="Developer 2"
                disabled={loading}
                className="w-full pl-9 pr-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !user1.trim() || !user2.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-rose-500 to-orange-500 text-white font-bold text-sm shadow-xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Repo Fight...</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4" />
                <span>Commence Repo Fight ⚔️</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Dynamic Humorous Loading Step Banner */}
      {loading && (
        <div className="mt-8 p-4 rounded-xl bg-zinc-900/90 border border-rose-500/30 max-w-md mx-auto text-center flex items-center justify-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 text-rose-400 animate-spin flex-shrink-0" />
          <span className="text-xs font-mono text-rose-300 font-medium">
            {LOADING_STEPS[loadingTextIndex]}
          </span>
        </div>
      )}
    </section>
  );
}

