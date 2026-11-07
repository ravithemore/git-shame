"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { 
  Flame, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Swords, 
  Skull, 
  GitCommit, 
  AlertTriangle, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";
import * as htmlToImage from "html-to-image";
import { RoastResult, GitHubStats } from "@/types";

interface RoastCardProps {
  roast: RoastResult;
  stats?: GitHubStats;
  onChallengeFriend?: (username: string) => void;
  onRegenerateTone?: (tone: RoastResult["tone"]) => void;
}

export function RoastCard({ roast, stats, onChallengeFriend, onRegenerateTone }: RoastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-rose-600 via-orange-500 to-amber-400";
    if (score >= 70) return "from-orange-500 to-amber-400";
    return "from-amber-400 to-emerald-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "TERMINAL CODE SINNER";
    if (score >= 75) return "HIGH RISK OF DEBT";
    if (score >= 60) return "MODERATE HAZARD";
    return "SUSPICIOUSLY HEALTHY";
  };

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    try {
      setDownloading(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `gitshame-${roast.username.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareTwitter = () => {
    const tweetText = `I just got brutally roasted by GitShame 🔥\n\nShame Score: ${roast.shameScore}/100 (${getScoreLabel(roast.shameScore)})\nTitle: "${roast.title}"\n\nCheck your GitHub sins at gitshame.dev\n\n#GitShame #DeveloperHumor`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = async () => {
    const text = `🔥 GitShame Developer Evaluation for @${roast.username} (${roast.shameScore}/100)\nTitle: ${roast.title}\nPersonality: ${roast.devPersonality}\n\n${roast.roastParagraph}\n\nWorst Habits:\n${roast.worstHabits.map(h => `• ${h}`).join("\n")}\n\nVerdict: ${roast.verdict}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16 space-y-6">
      {/* Main Card to be Captured as Image */}
      <div
        ref={cardRef}
        id="gitshame-card"
        className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 shadow-2xl transition-all"
      >
        {/* Glow Background effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-rose-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-600/10 blur-3xl rounded-full pointer-events-none" />

        {/* Top Header: Identity & Shame Meter */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/10 bg-zinc-900 relative">
                {roast.avatarUrl ? (
                  <img
                    src={roast.avatarUrl}
                    alt={roast.username}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xl">
                    ?
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 border border-zinc-700 p-1 rounded-lg text-rose-500 shadow">
                <Flame className="w-4 h-4 fill-rose-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-white tracking-tight">{roast.name}</h2>
                <a
                  href={`https://github.com/${roast.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  @{roast.username}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold font-mono">
                {roast.title}
              </div>
            </div>
          </div>

          {/* Shame Gauge */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 rounded-xl bg-zinc-900/50 sm:bg-transparent border sm:border-0 border-zinc-800">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                Shame Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${getScoreColor(roast.shameScore)}`}>
                  {roast.shameScore}
                </span>
                <span className="text-xs text-zinc-500 font-mono">/100</span>
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
              {getScoreLabel(roast.shameScore)}
            </span>
          </div>
        </div>

        {/* Personality Badge */}
        <div className="my-5 flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">Diagnosis Archetype:</span>
          <span className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-bold font-mono">
            🎭 {roast.devPersonality}
          </span>
        </div>

        {/* The Roast Text */}
        <div className="relative z-10 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 mb-6 backdrop-blur-sm">
          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
            {roast.roastParagraph}
          </p>
        </div>

        {/* Cursed Commit Hall of Shame */}
        {roast.cursedCommits && roast.cursedCommits.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Skull className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
                Cursed Commit Evidence
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {roast.cursedCommits.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/70 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 text-rose-300 font-semibold truncate">
                    <GitCommit className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
                    <span className="truncate">&quot;{c.message}&quot;</span>
                    {c.repo && (
                      <span className="text-zinc-500 text-[10px] font-normal hidden sm:inline">
                        in {c.repo}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 italic">
                    ↳ {c.verdict}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Worst Habits */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
              Diagnosed Anti-Patterns
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roast.worstHabits.map((habit, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-300"
              >
                <span className="text-rose-500 mt-0.5">•</span>
                <span>{habit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {roast.statDiagnoses.map((d, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-center"
            >
              <div className="text-[10px] font-mono uppercase text-zinc-400 font-semibold mb-0.5">
                {d.label}
              </div>
              <div className="text-sm font-black font-mono text-zinc-100">{d.value}</div>
              <div className="text-[10px] text-zinc-500 mt-1 truncate" title={d.critique}>
                {d.critique}
              </div>
            </div>
          ))}
        </div>

        {/* Verdict Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-zinc-900 to-amber-950/40 border border-rose-500/20 text-center mb-6">
          <div className="text-xs font-bold text-rose-300 font-mono tracking-wide">
            {roast.verdict}
          </div>
        </div>

        {/* Watermark for Social Sharing */}
        <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5 font-bold text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>GitShame.dev</span>
          </div>
          <span>Unfiltered Developer Roast</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Card</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShareTwitter}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs transition-all"
        >
          <Share2 className="w-4 h-4 text-sky-400" />
          <span>Post to X</span>
        </button>

        <button
          type="button"
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-xs transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Copy Roast</span>
            </>
          )}
        </button>

        {onChallengeFriend && (
          <button
            type="button"
            onClick={() => onChallengeFriend(roast.username)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 transition-all"
          >
            <Swords className="w-4 h-4" />
            <span>Fight a Friend</span>
          </button>
        )}
      </div>
    </div>
  );
}
