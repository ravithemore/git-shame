"use client";

import React, { useState, useEffect } from "react";
import { RoastTone } from "@/types";
import { sounds } from "@/lib/audio";

const cleanHandle = (input: string) => {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/^github\.com\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^@/, "");
};

interface SearchHeroProps {
  onRoastSubmit: (username: string, tone: RoastTone) => Promise<void>;
  onBattleSubmit: (user1: string, user2: string) => Promise<void>;
  loading: boolean;
  activeTone: RoastTone;
  setActiveTone: (tone: RoastTone) => void;
  initialUsername?: string;
  mode: "solo" | "fight" | "team";
  setMode: (mode: "solo" | "fight" | "team") => void;
}

interface Persona {
  id: RoastTone;
  name: string;
  tag: string;
  tagColor: string;
  icon: string;
  desc: string;
}

const PERSONAS: Persona[] = [
  {
    id: "savage",
    name: "Savage Linter",
    tag: "Brutal",
    tagColor: "text-primary-container bg-primary-container/10",
    icon: "skull",
    desc: "Zero empathy. Destroys commit messages and ternary hell.",
  },
  {
    id: "corporate",
    name: "Passive-Aggressive Senior",
    tag: "Passive",
    tagColor: "text-outline bg-surface-container-highest",
    icon: "sentiment_dissatisfied",
    desc: '"Per my previous PR review...", deeply disappointed in you.',
  },
  {
    id: "boomer",
    name: "Corporate HR Audit",
    tag: "Corporate",
    tagColor: "text-outline bg-surface-container-highest",
    icon: "domain",
    desc: "Flags profanities in comments as actionable behavioral infractions.",
  },
  {
    id: "fbi",
    name: "FBI Profiler",
    tag: "Forensic",
    tagColor: "text-tertiary-container bg-tertiary-container/10",
    icon: "policy",
    desc: "Unpacks the emotional degradation of the engineer across git blame logs.",
  },
];

const FREQUENT_VICTIMS = [
  { label: "torvalds", handle: "torvalds" },
  { label: "shadcn", handle: "shadcn" },
  { label: "gaearon", handle: "gaearon" },
  { label: "supabase", handle: "supabase" },
  { label: "react", handle: "facebook" },
  { label: "ravithemore", handle: "ravithemore" },
];

export function SearchHero({
  onRoastSubmit,
  onBattleSubmit,
  loading,
  activeTone,
  setActiveTone,
  initialUsername = "",
  mode,
  setMode,
}: SearchHeroProps) {
  const [username, setUsername] = useState(initialUsername || "torvalds");
  const [fighter1, setFighter1] = useState("tailwindlabs/tailwindcss");
  const [fighter2, setFighter2] = useState("facebook/stylex");
  const [teamOrg, setTeamOrg] = useState("vercel");
  const [liveSinsCount, setLiveSinsCount] = useState(1429802);

  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);

  // Live counter ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSinsCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSoloSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = cleanHandle(username);
    if (!cleaned || loading) return;
    sounds.playBlip();
    onRoastSubmit(cleaned, activeTone);
  };

  const handleFightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c1 = cleanHandle(fighter1);
    const c2 = cleanHandle(fighter2);
    if (!c1 || !c2 || loading) return;
    sounds.playFightBell();
    onBattleSubmit(c1, c2);
  };

  const handleQuickVictim = (handle: string) => {
    setUsername(handle);
    sounds.playBlip();
    if (mode !== "solo") setMode("solo");
  };

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin pt-space-xl md:pt-space-2xl pb-space-2xl">
      {/* Ambient Atmospheric Radiant Light Fields */}
      <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[1100px] h-[580px] bg-gradient-to-b from-primary-container/15 via-secondary-container/5 to-transparent blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-[480px] -left-48 w-[520px] h-[520px] bg-tertiary-container/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[720px] -right-48 w-[580px] h-[580px] bg-primary-container/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Micro Badge Pill */}
      <div className="flex items-center justify-center mb-space-lg">
        <div className="inline-flex items-center gap-space-sm px-space-md py-1.5 rounded-full bg-surface-container-high/70 backdrop-blur-xl shadow-lg border border-white/5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
          </span>
          <span className="font-mono text-label-code-sm text-primary tracking-wide uppercase font-semibold">
            v3.4 Code Sin Neural Engine
          </span>
          <span className="font-mono text-label-code-sm text-on-surface-variant/40">/</span>
          <span className="font-body text-body-sm text-on-surface-variant flex items-center gap-1">
            Zero Discretion Policy{" "}
            <span className="material-symbols-outlined text-[14px] text-primary-container">
              verified
            </span>
          </span>
        </div>
      </div>

      {/* Main Editorial Headline (Hero) */}
      <div className="text-center max-w-5xl mx-auto space-y-space-md mb-space-xl">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight font-extrabold text-on-surface leading-tight">
          The future of code review is <br className="hidden sm:inline" />
          <span className="inline-flex items-center align-middle mx-1">
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-surface-container-highest/80 shadow-[0_0_30px_rgba(0,245,160,0.25)] text-primary-container mr-2 transform -rotate-3 transition hover:rotate-0 border border-white/5">
              <span className="material-symbols-outlined text-[28px] md:text-[38px]">
                fingerprint
              </span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-secondary to-primary-fixed">
              brutal
            </span>
          </span>
          <span className="text-outline font-light mx-2">+</span>
          <span className="inline-flex items-center align-middle">
            <span className="text-on-surface">honest</span>
            <span
              className="material-symbols-outlined text-tertiary-container text-[26px] md:text-[36px] ml-2 animate-pulse"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
          </span>
        </h1>
        <p className="font-body text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed pt-space-xs">
          Connect any GitHub repository or handle to uncover 3 AM panic pushes, ghost commits, and
          receive an unfiltered AI roast dossier with collectible shame receipts.
        </p>
      </div>

      {/* Mode Selector Segmented Controls */}
      <div className="flex justify-center mb-space-lg">
        <div className="inline-flex items-center p-1.5 rounded-full bg-surface-container-low/90 backdrop-blur-2xl shadow-xl border border-white/5">
          <button
            type="button"
            onClick={() => {
              setMode("solo");
              sounds.playBlip();
            }}
            className={`flex items-center gap-space-xs px-space-lg py-2 rounded-full font-body text-body-sm transition-all duration-200 ${
              mode === "solo"
                ? "font-semibold text-on-primary-container bg-primary-container shadow-[0_0_16px_rgba(0,245,160,0.3)]"
                : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Solo Roast</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("fight");
              sounds.playBlip();
            }}
            className={`flex items-center gap-space-xs px-space-lg py-2 rounded-full font-body text-body-sm transition-all duration-200 ${
              mode === "fight"
                ? "font-semibold text-on-primary-container bg-primary-container shadow-[0_0_16px_rgba(0,245,160,0.3)]"
                : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">swords</span>
            <span>Repo Fight (1v1)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary-container font-bold">
              HOT
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("team");
              sounds.playBlip();
            }}
            className={`flex items-center gap-space-xs px-space-lg py-2 rounded-full font-body text-body-sm transition-all duration-200 ${
              mode === "team"
                ? "font-semibold text-on-primary-container bg-primary-container shadow-[0_0_16px_rgba(0,245,160,0.3)]"
                : "font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group</span>
            <span>Team Sins Audit</span>
          </button>
        </div>
      </div>

      {/* Command Console & Input Bar */}
      <div className="max-w-3xl mx-auto mb-space-md">
        {mode === "solo" ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-container/30 via-tertiary-container/20 to-secondary/30 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />
            <form
              onSubmit={handleSoloSubmit}
              className="relative flex flex-col sm:flex-row items-center gap-space-xs p-2 rounded-3xl sm:rounded-full bg-surface-container/95 backdrop-blur-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-300"
            >
              <div className="flex items-center w-full pl-space-md py-1.5 gap-space-sm flex-1">
                <span className="font-mono text-label-code-md text-primary-container font-bold select-none flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  git shame @
                </span>
                <input
                  id="repo-input"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="torvalds/linux or github-username"
                  className="w-full bg-transparent font-mono text-label-code-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end pr-1 pb-1 sm:pb-0">
                <span className="hidden md:inline-flex items-center px-2 py-1 rounded bg-surface-container-highest font-mono text-[11px] text-on-surface-variant/70 border border-white/5">
                  ⌘K
                </span>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3.5 rounded-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-display text-body-sm font-bold tracking-tight shadow-[0_0_24px_rgba(0,245,160,0.45)] hover:shadow-[0_0_36px_rgba(0,245,160,0.7)] transition-all duration-200 active:scale-95 whitespace-nowrap disabled:opacity-50"
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      loading ? "animate-spin" : ""
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {loading ? "sync" : "local_fire_department"}
                  </span>
                  <span>{loading ? "Prosecuting..." : "Roast Repository"}</span>
                </button>
              </div>
            </form>
          </div>
        ) : mode === "fight" ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-container/30 via-tertiary-container/20 to-secondary/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />
            <form
              onSubmit={handleFightSubmit}
              className="relative p-space-md rounded-3xl bg-surface-container/95 backdrop-blur-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] border border-white/10 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center">
                <div className="md:col-span-5 flex items-center bg-surface-container-lowest px-4 py-2.5 rounded-2xl border border-white/5">
                  <span className="font-mono text-primary-container font-bold mr-2 text-xs">P1:</span>
                  <input
                    type="text"
                    value={fighter1}
                    onChange={(e) => setFighter1(e.target.value)}
                    placeholder="e.g. ravithemore"
                    className="w-full bg-transparent font-mono text-sm text-on-surface focus:outline-none"
                    disabled={loading}
                  />
                </div>

                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-display text-xs font-black text-primary-container border border-white/10">
                    VS
                  </div>
                </div>

                <div className="md:col-span-5 flex items-center bg-surface-container-lowest px-4 py-2.5 rounded-2xl border border-white/5">
                  <span className="font-mono text-tertiary-container font-bold mr-2 text-xs">P2:</span>
                  <input
                    type="text"
                    value={fighter2}
                    onChange={(e) => setFighter2(e.target.value)}
                    placeholder="e.g. Sejal-shh"
                    className="w-full bg-transparent font-mono text-sm text-on-surface focus:outline-none"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-display text-body-sm font-bold tracking-tight shadow-[0_0_24px_rgba(0,245,160,0.45)] transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">sports_martial_arts</span>
                  <span>{loading ? "Simulating Bloodbath..." : "Start 1v1 Battle"}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="relative group">
            <div className="p-6 rounded-3xl bg-surface-container/95 backdrop-blur-3xl shadow-xl border border-white/10 text-center space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-tertiary-container font-bold">
                Team Sins Audit
              </span>
              <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
                Benchmark an entire engineering organization&apos;s architectural sins and rank all
                contributors by technical debt.
              </p>
              <div className="flex max-w-md mx-auto gap-2">
                <input
                  type="text"
                  value={teamOrg}
                  onChange={(e) => setTeamOrg(e.target.value)}
                  placeholder="github organization name"
                  className="flex-1 bg-surface-container-lowest px-4 py-2 rounded-full font-mono text-sm text-on-surface focus:outline-none border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleQuickVictim(teamOrg);
                  }}
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-body text-sm font-bold"
                >
                  Audit Org
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick victim pills */}
        <div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-md text-body-sm text-on-surface-variant font-mono">
          <span className="text-outline uppercase text-[11px] tracking-wider font-semibold mr-1">
            Frequent Victims:
          </span>
          {FREQUENT_VICTIMS.map((v) => (
            <button
              key={v.handle}
              type="button"
              onClick={() => handleQuickVictim(v.handle)}
              className="px-3 py-1 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface hover:text-primary-container border border-white/5 transition-all duration-150 flex items-center gap-1 text-xs"
            >
              <span className="text-outline">@</span>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Persona Selector Matrix */}
      <div className="max-w-4xl mx-auto mt-space-lg mb-space-2xl">
        <div className="text-center mb-space-sm">
          <span className="font-mono text-label-code-sm uppercase tracking-wider text-outline">
            Select AI Prosecutorial Voice
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
          {PERSONAS.map((p) => {
            const isActive = activeTone === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActiveTone(p.id);
                  sounds.playBlip();
                }}
                className={`text-left p-space-md rounded-2xl transition-all duration-200 border ${
                  isActive
                    ? "bg-surface-container-high/90 shadow-md ring-2 ring-primary-container/80 border-primary-container/50"
                    : "bg-surface-container/70 shadow-md hover:bg-surface-container-high/80 border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-space-xs">
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isActive ? "text-primary-container" : "text-on-surface-variant"
                    }`}
                  >
                    {p.icon}
                  </span>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${p.tagColor}`}
                  >
                    {p.tag}
                  </span>
                </div>
                <p className="font-display text-body-md font-bold text-on-surface">{p.name}</p>
                <p className="font-body text-body-sm text-on-surface-variant mt-1 leading-snug">
                  {p.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ORBITAL TELEMETRY & LIVE BENCHMARK STAGE */}
      <div className="relative w-full max-w-6xl mx-auto rounded-3xl bg-surface-container-lowest/80 backdrop-blur-3xl overflow-hidden py-space-2xl px-space-md md:px-space-xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)] border border-white/5">
        {/* Concentric Orbital Grid Rings SVG Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <svg className="w-[960px] h-[960px] text-outline-variant" fill="none" viewBox="0 0 800 800">
            <circle
              cx="400"
              cy="400"
              r="140"
              stroke="currentColor"
              strokeDasharray="3 4"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="260"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="380"
              stroke="currentColor"
              strokeDasharray="6 6"
              strokeOpacity="0.25"
              strokeWidth="1"
            />
            <line
              stroke="currentColor"
              strokeDasharray="4 8"
              strokeOpacity="0.15"
              x1="400"
              x2="400"
              y1="20"
              y2="780"
            />
            <line
              stroke="currentColor"
              strokeDasharray="4 8"
              strokeOpacity="0.15"
              x1="20"
              x2="780"
              y1="400"
              y2="400"
            />
          </svg>
        </div>

        {/* Orbital Node Cluster */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
          {/* Left Floating Sin Pill Nodes */}
          <div className="lg:col-span-3 space-y-space-md flex flex-col items-center lg:items-start">
            {/* Orbit Sin 1 */}
            <div className="w-full max-w-xs p-space-md rounded-2xl bg-surface-container/90 backdrop-blur-xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-300 border border-white/5">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-container/40 text-error font-mono text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">warning</span> Panic Cascade
                </span>
                <span className="font-mono text-[11px] text-outline">03:42 AM</span>
              </div>
              <p className="font-display text-body-sm font-semibold text-on-surface">
                &ldquo;42 commits titled &apos;fix&apos; in 20 mins&rdquo;
              </p>
              <p className="font-body text-[12px] text-on-surface-variant mt-1">
                Branch: <span className="font-mono text-primary">hotfix/prod-on-fire</span>
              </p>
            </div>

            {/* Orbit Sin 2 */}
            <div className="w-full max-w-xs p-space-md rounded-2xl bg-surface-container/90 backdrop-blur-xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform duration-300 ml-0 lg:ml-6 border border-white/5">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary-container font-mono text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">psychology</span> Coping
                  Mechanism
                </span>
                <span className="font-mono text-[11px] text-outline">Linter Fraud</span>
              </div>
              <p className="font-display text-body-sm font-semibold text-on-surface">
                1,280 <code className="text-secondary font-mono text-xs">// @ts-ignore</code>
              </p>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-tertiary-container h-full w-[94%]" />
              </div>
            </div>

            {/* Orbit Sin 3 */}
            <div className="w-full max-w-xs p-space-md rounded-2xl bg-surface-container/90 backdrop-blur-xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 border border-white/5">
              <div className="flex items-center gap-space-xs text-error font-mono text-[12px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span>Root Keys in Public .env</span>
              </div>
              <p className="font-body text-[12px] text-on-surface-variant mt-1 leading-snug">
                Revocation occurred 48 hours after AWS $34,000 crypto mining drain.
              </p>
            </div>
          </div>

          {/* Center Stage: The Live Sin Neural Core Hologram */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center px-space-sm py-space-md">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              {/* Glowing Pulsing Core Aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-container/20 to-tertiary-container/30 blur-2xl animate-pulse" />
              <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full bg-surface-container-highest/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,245,160,0.15)] flex items-center justify-center border border-white/5" />
              {/* Rotating Radar Sweep ring */}
              <div
                className="absolute inset-4 rounded-full border-2 border-primary-container/20 animate-spin"
                style={{ animationDuration: "20s" }}
              />

              {/* Central Live Telemetry Readout */}
              <div className="relative z-10 flex flex-col items-center p-space-md">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high shadow-lg flex items-center justify-center mb-space-xs text-primary-container border border-white/10">
                  <span
                    className="material-symbols-outlined text-[32px] animate-spin"
                    style={{ animationDuration: "9s" }}
                  >
                    reorder
                  </span>
                </div>
                <span className="font-mono text-label-code-sm text-primary font-bold tracking-wider uppercase mb-1">
                  ANALYZING: @{username || "torvalds"}
                </span>
                <div className="text-3xl md:text-4xl font-display text-on-surface font-extrabold flex items-center gap-1">
                  <span className="text-error">F</span>
                  <span className="text-on-surface-variant font-light text-body-md">
                    / 98.4% Debt
                  </span>
                </div>
                <span className="font-body text-body-sm text-on-surface-variant max-w-[210px] mt-1">
                  &ldquo;3,480 goto labels found. C code smells like 1991 caffeine panic.&rdquo;
                </span>
                <div className="mt-space-sm inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-mono text-[11px] text-primary-container border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                  <span>Extracting Shame Dossier...</span>
                </div>
              </div>

              {/* Floating Mini Integration Tech Orbitals */}
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-surface-container-high/90 shadow-md font-mono text-[11px] text-on-surface flex items-center gap-1 border border-white/5">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  alt_route
                </span>{" "}
                git push -f
              </div>
              <div className="absolute -bottom-2 right-8 px-3 py-1 rounded-full bg-surface-container-high/90 shadow-md font-mono text-[11px] text-on-surface flex items-center gap-1 border border-white/5">
                <span className="material-symbols-outlined text-[14px] text-error">bug_report</span>{" "}
                120 TODOs from 2017
              </div>
            </div>

            {/* Bottom Action within Canvas */}
            <div className="mt-space-lg flex items-center gap-space-md">
              <button
                type="button"
                onClick={() => {
                  sounds.playBlip();
                  onRoastSubmit(username || "torvalds", activeTone);
                }}
                className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>Inspect Raw Receipt #8942</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playBlip();
                  const shareText = `GitShame analyzed @${username}: Grade F / 98.4% Technical Debt. Get your code sins roasted at gitshame.dev!`;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
                    "_blank"
                  );
                }}
                className="inline-flex items-center gap-space-xs px-space-md py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>Share to X / Twitter</span>
              </button>
            </div>
          </div>

          {/* Right Floating Dossier & Receipts */}
          <div className="lg:col-span-3 space-y-space-md flex flex-col items-center lg:items-end">
            {/* Orbit Sin 4 */}
            <div className="w-full max-w-xs p-space-md rounded-2xl bg-surface-container/90 backdrop-blur-xl shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border border-white/5">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-mono text-[11px] uppercase tracking-wide text-primary-container font-semibold">
                  Diagnostic
                </span>
                <span className="material-symbols-outlined text-[16px] text-outline">
                  verified_user
                </span>
              </div>
              <p className="font-display text-body-md font-bold text-on-surface">
                Psychological Profile:
              </p>
              <p className="font-body text-body-sm text-on-surface-variant mt-1">
                <span className="text-error font-medium">Terminal Impostor Syndrome.</span> Uses
                400-line single functions to avoid writing modular tests.
              </p>
            </div>

            {/* Orbit Sin 5: Collectible Receipt Preview */}
            <div className="w-full max-w-xs p-space-md rounded-2xl bg-surface-container/90 backdrop-blur-xl shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 mr-0 lg:mr-6 border border-white/5">
              <div className="flex items-center justify-between text-outline font-mono text-[10px] mb-space-xs">
                <span>GITSHAME DEBT RECEIPT</span>
                <span>#TX-09214</span>
              </div>
              <div className="space-y-1 font-mono text-[12px]">
                <div className="flex justify-between text-on-surface">
                  <span>Copy-Pasted StackOverflow</span>
                  <span className="text-error font-semibold">68.2%</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>Variables named foo / temp</span>
                  <span className="text-secondary font-semibold">2,140</span>
                </div>
                <div className="flex justify-between text-on-surface">
                  <span>Test Coverage</span>
                  <span className="text-error font-bold">0.00%</span>
                </div>
              </div>
              <div className="mt-space-sm pt-space-xs text-center bg-surface-container-highest/60 rounded-lg py-1 border border-white/5">
                <span className="font-mono text-[11px] text-primary-container font-bold">
                  VERDICT: GUILTY AS CHARGED
                </span>
              </div>
            </div>

            {/* Orbit Sin 6: Tech Ecosystem Pills */}
            <div className="w-full max-w-xs flex flex-wrap gap-1.5 justify-center lg:justify-end">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-mono border border-white/5">
                VS Code Extension
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-mono border border-white/5">
                GitHub Actions Bot
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-mono border border-white/5">
                Slack Shame Ticker
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Social Proof & Telemetry Counter Strip */}
      <div className="mt-space-2xl grid grid-cols-2 md:grid-cols-4 gap-space-md max-w-5xl mx-auto">
        <div className="p-space-lg rounded-2xl bg-surface-container/60 backdrop-blur-xl shadow-lg text-center border border-white/5">
          <p className="font-display text-3xl md:text-4xl font-extrabold text-primary-container">
            {liveSinsCount.toLocaleString()}
          </p>
          <p className="font-body text-body-sm text-on-surface-variant mt-1">
            Sins Humiliated Publicly
          </p>
        </div>

        <div className="p-space-lg rounded-2xl bg-surface-container/60 backdrop-blur-xl shadow-lg text-center border border-white/5">
          <p className="font-display text-3xl md:text-4xl font-extrabold text-secondary">14,891</p>
          <p className="font-body text-body-sm text-on-surface-variant mt-1">
            Force Pushes Caught Today
          </p>
        </div>

        <div className="p-space-lg rounded-2xl bg-surface-container/60 backdrop-blur-xl shadow-lg text-center border border-white/5">
          <p className="font-display text-3xl md:text-4xl font-extrabold text-tertiary-container">
            4.9 / 5.0
          </p>
          <p className="font-body text-body-sm text-on-surface-variant mt-1">Dev Masochism Rating</p>
        </div>

        <div className="p-space-lg rounded-2xl bg-surface-container/60 backdrop-blur-xl shadow-lg text-center border border-white/5">
          <p className="font-display text-3xl md:text-4xl font-extrabold text-error">91.4%</p>
          <p className="font-body text-body-sm text-on-surface-variant mt-1">
            Unresolved Technical Hubris
          </p>
        </div>
      </div>
    </section>
  );
}
