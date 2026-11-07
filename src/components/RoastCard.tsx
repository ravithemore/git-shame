"use client";

import React, { useRef, useState, useEffect } from "react";
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
  RefreshCw,
  ExternalLink,
  Volume2,
  VolumeX,
  FileBadge,
  Receipt,
  ShieldAlert
} from "lucide-react";
import { fireConfetti, captureToPng } from "@/lib/export-utils";
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
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cardTheme, setCardTheme] = useState<"receipt" | "dossier">("receipt");

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    try {
      setDownloading(true);
      const dataUrl = await captureToPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
      });

      const link = document.createElement("a");
      link.download = `gitshame-${cardTheme}-${roast.username.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      fireConfetti({
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
    const tweetText = `I just got brutally roasted by GitShame 🔥\n\nOffender: @${roast.username}\nShame Score: ${roast.shameScore}/100\nTitle: "${roast.title}"\n\nCheck your GitHub sins at gitshame.dev\n\n#GitShame #DevHumor`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyText = async () => {
    const text = `🔥 GitShame Developer Evaluation for @${roast.username} (${roast.shameScore}/100)\nTitle: ${roast.title}\nPersonality: ${roast.devPersonality}\n\n${roast.roastParagraph}\n\nWorst Habits:\n${roast.worstHabits.map(h => `• ${h}`).join("\n")}\n\nVerdict: ${roast.verdict}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readmeBadgeMarkdown = `[![GitShame Score](https://img.shields.io/badge/GitShame%20Score-${roast.shameScore}%2F100-red?style=for-the-badge&logo=github)](https://gitshame.dev/?user=${roast.username})`;

  const handleCopyBadge = async () => {
    await navigator.clipboard.writeText(readmeBadgeMarkdown);
    setBadgeCopied(true);
    setTimeout(() => setBadgeCopied(false), 2000);
  };

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narration = `Developer audit for ${roast.name || roast.username}. Assigned title: ${roast.title}. Shame Score: ${roast.shameScore} out of 100. ${roast.roastParagraph}. Verdict: ${roast.verdict}`;
    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("UK") || v.name.includes("Daniel")));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Itemized costs for the Thermal Receipt style
  const receiptItems = [
    { name: `Vague single-word commits`, qty: stats?.cursedCommits.length ? `${stats.cursedCommits.length}x` : "3x", cost: `$${(stats?.cursedCommits.length || 3) * 60}.00` },
    { name: `Nocturnal 3 AM commits`, qty: stats?.lateNightCommitsCount ? `${stats.lateNightCommitsCount}x` : "2x", cost: `$${(stats?.lateNightCommitsCount || 2) * 150}.00` },
    { name: `Ghost/abandoned repos`, qty: stats?.abandonedReposCount ? `${stats.abandonedReposCount}x` : "4x", cost: `$${(stats?.abandonedReposCount || 4) * 85}.00` },
    { name: `Zero unit test coverage`, qty: "1x", cost: "$750.00" },
    { name: `Caffeine intoxication tax`, qty: "1x", cost: "$240.00" },
  ];

  const totalDamage = (stats?.cursedCommits.length || 3) * 60 + (stats?.lateNightCommitsCount || 2) * 150 + (stats?.abandonedReposCount || 4) * 85 + 750 + 240;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16 space-y-6">
      {/* Top Format Switcher & Audio Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Style Switcher: CVS Receipt vs Cyber Dossier */}
        <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setCardTheme("receipt")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              cardTheme === "receipt"
                ? "bg-zinc-100 text-zinc-950 font-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Thermal Receipt 🧾</span>
          </button>
          <button
            type="button"
            onClick={() => setCardTheme("dossier")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              cardTheme === "dossier"
                ? "bg-rose-600 text-white font-black shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Police Dossier 🚨</span>
          </button>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSpeaking
                ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Read Out Loud</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowBadgeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-all"
          >
            <FileBadge className="w-3.5 h-3.5 text-amber-400" />
            <span>README Badge</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* CARD VIEW 1: THE THERMAL STORE RECEIPT (RECEIPTIFY STYLE)        */}
      {/* ============================================================== */}
      {cardTheme === "receipt" ? (
        <div
          ref={cardRef}
          id="gitshame-card"
          className="relative bg-[#fbfbfa] text-zinc-900 font-mono p-6 sm:p-8 rounded-sm shadow-2xl border-t-8 border-b-8 border-zinc-400/30 selection:bg-zinc-800 selection:text-white"
          style={{
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))",
          }}
        >
          {/* Top Perforated Receipt Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-dashed border-zinc-400">
            <h2 className="text-xl font-black tracking-widest uppercase">GITSHAME VIOLATION RECEIPT</h2>
            <p className="text-[11px] text-zinc-600 uppercase">MUNICIPAL SOFTWARE HYGIENE DEPT</p>
            <p className="text-[10px] text-zinc-500">TERMINAL: #420-STAGING • STORE: PROD-DIRECT</p>
          </div>

          {/* Offender Info */}
          <div className="py-4 border-b border-dashed border-zinc-300 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">OFFENDER:</span>
              <span className="font-bold">@{roast.username} ({roast.name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">DATE RECORDED:</span>
              <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ASSIGNED TITLE:</span>
              <span className="font-bold text-rose-700">{roast.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">ARCHETYPE:</span>
              <span>{roast.devPersonality}</span>
            </div>
          </div>

          {/* Itemized Sins Table */}
          <div className="py-4 border-b-2 border-dashed border-zinc-400 text-xs space-y-2">
            <div className="flex justify-between text-[11px] font-black text-zinc-600 pb-1 border-b border-zinc-200">
              <span>QTY / INFRACTION DESCRIPTION</span>
              <span>FINE</span>
            </div>
            {receiptItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-[11px]">
                <div className="truncate pr-2">
                  <span className="font-bold mr-1.5">{item.qty}</span>
                  <span>{item.name}</span>
                </div>
                <span className="font-bold flex-shrink-0">{item.cost}</span>
              </div>
            ))}
          </div>

          {/* Totals & Shame Index */}
          <div className="py-4 border-b-2 border-dashed border-zinc-400 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>ESTIMATED TECH DEBT:</span>
              <span>${totalDamage.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between items-center text-sm font-black pt-1">
              <span className="text-rose-700">SHAME INDEX RATING:</span>
              <span className="text-2xl font-black bg-zinc-900 text-white px-2 py-0.5 rounded">
                {roast.shameScore} / 100
              </span>
            </div>
          </div>

          {/* The Roast Text in Monospace Typewriter Font */}
          <div className="py-4 border-b border-dashed border-zinc-300 text-xs leading-relaxed text-zinc-800 space-y-2">
            <div className="font-black text-[10px] uppercase text-zinc-500 tracking-wider">
              --- OFFICIAL COURT PSYCH EVALUATION ---
            </div>
            <p className="whitespace-pre-line text-[11.5px] italic">
              &ldquo;{roast.roastParagraph}&rdquo;
            </p>
          </div>

          {/* Cursed Commit Evidence */}
          {roast.cursedCommits && roast.cursedCommits.length > 0 && (
            <div className="py-3 border-b border-dashed border-zinc-300 text-[11px] space-y-1.5">
              <div className="font-black text-[10px] uppercase text-zinc-500">FLAGGED COMMIT EXHIBITS:</div>
              {roast.cursedCommits.slice(0, 2).map((c, i) => (
                <div key={i} className="bg-zinc-100 p-2 rounded border border-zinc-200">
                  <span className="font-bold text-rose-700">&quot;{c.message}&quot;</span>
                  <div className="text-[10px] text-zinc-600 mt-0.5">↳ {c.verdict}</div>
                </div>
              ))}
            </div>
          )}

          {/* Closing Sentence */}
          <div className="py-3 text-center text-xs font-black text-rose-800">
            {roast.verdict}
          </div>

          {/* Barcode & Store Policy */}
          <div className="pt-3 text-center space-y-2">
            <div className="text-[9px] text-zinc-500 uppercase tracking-widest">
              NO REFUNDS • ALL CODE COMMITTED TO MAIN IS FINAL
            </div>
            {/* Realistic Barcode Graphic */}
            <div className="flex justify-center items-center py-2">
              <div className="font-mono text-3xl tracking-[0.25em] select-none text-zinc-900">
                ||| | |||| | || |||| | ||| || ||||
              </div>
            </div>
            <div className="text-[10px] text-zinc-500 font-bold tracking-widest">
              *GS-{roast.username.toUpperCase()}-{roast.shameScore}*
            </div>
            <div className="text-[9px] text-zinc-400 font-sans">
              gitshame.dev • roasted by AI
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================== */
        /* CARD VIEW 2: THE POLICE DOSSIER / CYBER EVIDENCE FILE           */
        /* ============================================================== */
        <div
          ref={cardRef}
          id="gitshame-card"
          className="relative bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-zinc-800 shadow-2xl relative overflow-hidden"
        >
          {/* Angled Red Rubber Stamp */}
          <div className="absolute top-6 right-6 pointer-events-none transform rotate-12 border-4 border-rose-600 px-4 py-1.5 rounded-lg text-rose-500 font-black text-sm tracking-widest uppercase opacity-90 shadow-lg">
            GUILTY: SINS DETECTED
          </div>

          {/* Identity Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
            <div className="w-18 h-18 rounded-2xl overflow-hidden ring-2 ring-rose-500/50 bg-zinc-900 flex-shrink-0">
              <img
                src={roast.avatarUrl}
                alt={roast.username}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{roast.name}</h2>
              <span className="text-xs font-mono text-zinc-400">@{roast.username}</span>
              <div className="mt-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono inline-block">
                {roast.title}
              </div>
            </div>
          </div>

          {/* Score Box */}
          <div className="my-5 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">SHAME INDEX</span>
              <span className="text-3xl font-black font-mono text-rose-400">
                {roast.shameScore}<span className="text-xs text-zinc-600 font-normal">/100</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">ARCHETYPE</span>
              <span className="text-xs font-bold text-zinc-200">{roast.devPersonality}</span>
            </div>
          </div>

          {/* Roast Paragraph */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 mb-5 text-xs sm:text-sm leading-relaxed text-zinc-200">
            {roast.roastParagraph}
          </div>

          {/* Worst Habits */}
          <div className="mb-5 space-y-2">
            <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">FLAGGED ANTI-PATTERNS:</div>
            {roast.worstHabits.map((h, i) => (
              <div key={i} className="text-xs text-zinc-300 flex items-start gap-2 bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/60">
                <span className="text-rose-500 font-bold">•</span>
                <span>{h}</span>
              </div>
            ))}
          </div>

          {/* Verdict */}
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center text-xs font-bold font-mono text-rose-300">
            {roast.verdict}
          </div>

          {/* Watermark */}
          <div className="mt-5 pt-3 border-t border-zinc-800 flex justify-between text-[11px] font-mono text-zinc-500">
            <span>GitShame.dev</span>
            <span>DOCKET #GS-2026</span>
          </div>
        </div>
      )}

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

      {/* GitHub README Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm">Add Badge to GitHub README</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBadgeModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste this markdown into your GitHub profile README so visitors can see your shame score:
            </p>

            {/* Badge Preview */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <img
                src={`https://img.shields.io/badge/GitShame%20Score-${roast.shameScore}%2F100-red?style=for-the-badge&logo=github`}
                alt="GitShame Score"
                className="rounded"
              />
            </div>

            {/* Code Box */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 break-all select-all">
              {readmeBadgeMarkdown}
            </div>

            <button
              type="button"
              onClick={handleCopyBadge}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
            >
              {badgeCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied Markdown to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Markdown Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
