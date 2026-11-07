"use client";

import React, { useRef, useState, useEffect } from "react";
import { fireConfetti, captureToPng } from "@/lib/export-utils";
import { RoastResult, GitHubStats } from "@/types";
import { sounds } from "@/lib/audio";

interface RoastCardProps {
  roast: RoastResult;
  stats?: GitHubStats;
  onChallengeFriend?: (username: string) => void;
  onRegenerateTone?: (tone: RoastResult["tone"]) => void;
}

export function RoastCard({ roast, stats, onChallengeFriend }: RoastCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cardTheme, setCardTheme] = useState<"dossier" | "receipt">("dossier");

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

  const handleShare = async () => {
    sounds.playBlip();
    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/?user=${encodeURIComponent(roast.username)}`
      : `https://gitshame.dev/?user=${encodeURIComponent(roast.username)}`;
    const shareText = `Check out @${roast.username}'s GitShame Developer Evaluation (${roast.shameScore}/100): "${roast.title}" 🔥`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `GitShame - @${roast.username}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // user dismissed or canceled native share, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyText = async () => {
    const text = `🔥 GitShame Developer Evaluation for @${roast.username} (${roast.shameScore}/100)\nTitle: ${roast.title}\nPersonality: ${roast.devPersonality}\n\n${roast.roastParagraph}\n\nWorst Habits:\n${roast.worstHabits.map((h) => `• ${h}`).join("\n")}\n\nVerdict: ${roast.verdict}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readmeBadgeMarkdown = `[![GitShame Score](https://img.shields.io/badge/GitShame%20Score-${roast.shameScore}%2F100-00f5a0?style=for-the-badge&logo=github)](https://gitshame.dev/?user=${roast.username})`;

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

    const textToSpeak = `${roast.name || roast.username}. ${roast.title}. ${roast.roastParagraph}. ${roast.verdict}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-error";
    if (score >= 70) return "text-secondary";
    return "text-primary-container";
  };

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin pb-space-2xl space-y-space-lg">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container/80 backdrop-blur-2xl p-space-sm rounded-2xl border border-white/5">
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={() => {
              setCardTheme("dossier");
              sounds.playBlip();
            }}
            className={`px-space-md py-1.5 rounded-full font-body text-body-sm font-semibold transition-all flex items-center gap-1.5 ${
              cardTheme === "dossier"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(0,245,160,0.3)]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>Forensic Dossier</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCardTheme("receipt");
              sounds.playBlip();
            }}
            className={`px-space-md py-1.5 rounded-full font-body text-body-sm font-semibold transition-all flex items-center gap-1.5 ${
              cardTheme === "receipt"
                ? "bg-primary-container text-on-primary-container shadow-[0_0_16px_rgba(0,245,160,0.3)]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Thermal Debt Receipt</span>
          </button>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={toggleSpeech}
            className="p-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all border border-white/5"
            title={isSpeaking ? "Mute Roast" : "Read Roast Aloud"}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSpeaking ? "volume_off" : "volume_up"}
            </span>
          </button>
          <button
            type="button"
            onClick={handleCopyText}
            className="px-space-md py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? "check" : "content_copy"}
            </span>
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-space-md py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">
              {shareCopied ? "check" : "share"}
            </span>
            <span>{shareCopied ? "Link Copied!" : "Share Link"}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="px-space-lg py-1.5 rounded-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-body text-body-sm font-bold shadow-[0_0_16px_rgba(0,245,160,0.3)] transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>{downloading ? "Exporting..." : "Download PNG"}</span>
          </button>
        </div>
      </div>

      {/* Main Roast Card Container */}
      <div
        ref={cardRef}
        id="roast-capture-card"
        className="relative rounded-3xl bg-surface-container/95 backdrop-blur-3xl p-space-lg sm:p-space-xl border border-white/10 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {cardTheme === "dossier" ? (
          /* FORENSIC DOSSIER THEME */
          <div className="space-y-space-lg">
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-lg border-b border-white/10">
              <div className="flex items-center gap-space-md">
                <div className="relative">
                  <img
                    src={roast.avatarUrl}
                    alt={roast.username}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-primary-container/60 shadow-[0_0_24px_rgba(0,245,160,0.2)] bg-surface-container-highest"
                    crossOrigin="anonymous"
                  />
                  <span className="absolute -bottom-1 -right-1 font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-surface-container-lowest text-primary-container border border-primary-container/40">
                    TARGET
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
                      {roast.name || roast.username}
                    </h2>
                    <span className="text-on-surface-variant font-mono text-sm">
                      @{roast.username}
                    </span>
                  </div>
                  <p className="font-mono text-body-sm text-primary font-semibold mt-1">
                    {roast.title}
                  </p>
                  <p className="font-mono text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-tertiary-container">
                      psychology
                    </span>
                    Archetype: {roast.devPersonality}
                  </p>
                </div>
              </div>

              {/* Shame Gauge Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between bg-surface-container-lowest p-space-md rounded-2xl border border-white/5 sm:min-w-[130px]">
                <span className="font-mono text-label-code-sm text-outline uppercase tracking-wider">
                  SHAME INDEX
                </span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`font-display text-4xl sm:text-5xl font-black ${getScoreColor(
                      roast.shameScore
                    )}`}
                  >
                    {roast.shameScore}
                  </span>
                  <span className="font-mono text-body-sm text-on-surface-variant/60">/100</span>
                </div>
              </div>
            </div>

            {/* Sarcastic Roast Paragraphs */}
            <div className="space-y-space-md p-space-lg rounded-2xl bg-surface-container-lowest/80 border border-white/5">
              <div className="flex items-center gap-space-xs text-primary-container font-mono text-label-code-sm font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">gavel</span>
                <span>Prosecution Findings</span>
              </div>
              <div className="font-body text-on-surface leading-relaxed whitespace-pre-line text-sm sm:text-base space-y-3">
                {roast.roastParagraph}
              </div>
            </div>

            {/* Diagnostic Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
              {roast.statDiagnoses.map((d, idx) => (
                <div
                  key={idx}
                  className="p-space-md rounded-2xl bg-surface-container-lowest border border-white/5 space-y-1"
                >
                  <span className="font-mono text-[11px] uppercase tracking-wide text-on-surface-variant block">
                    {d.label}
                  </span>
                  <p className="font-mono text-body-md font-bold text-primary-container">
                    {d.value}
                  </p>
                  <p className="font-body text-[11px] text-on-surface-variant leading-snug">
                    {d.critique}
                  </p>
                </div>
              ))}
            </div>

            {/* Worst Habits Checklist */}
            <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-white/5 space-y-space-xs">
              <span className="font-mono text-label-code-sm uppercase tracking-wide text-error font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Documented Codebase Sins:
              </span>
              <ul className="space-y-1.5 pt-1">
                {roast.worstHabits.map((habit, idx) => (
                  <li
                    key={idx}
                    className="font-mono text-body-sm text-on-surface flex items-start gap-2"
                  >
                    <span className="text-error font-bold">✖</span>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cursed Commits Table */}
            {roast.cursedCommits && roast.cursedCommits.length > 0 && (
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-white/5 space-y-space-xs">
                <span className="font-mono text-label-code-sm uppercase tracking-wide text-tertiary-container font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">history_edu</span>
                  Flagged Commit Transmissions:
                </span>
                <div className="space-y-2 pt-1 font-mono text-xs">
                  {roast.cursedCommits.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-outline">$ git commit -m</span>
                        <span className="text-error font-bold">&quot;{c.message}&quot;</span>
                      </div>
                      <span className="text-on-surface-variant italic">{c.verdict}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Closing Verdict Banner */}
            <div className="p-space-md rounded-2xl bg-gradient-to-r from-primary-container/15 via-secondary/10 to-primary-fixed/15 border border-primary-container/30 flex items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary-container text-[24px]">
                  verified
                </span>
                <span className="font-display font-bold text-on-surface text-sm sm:text-base">
                  {roast.verdict}
                </span>
              </div>
              <span className="hidden sm:inline-block font-mono text-[11px] text-outline uppercase tracking-wider shrink-0">
                CASE CLOSED • NO APPEAL
              </span>
            </div>
          </div>
        ) : (
          /* THERMAL DEBT RECEIPT THEME */
          <div className="max-w-md mx-auto bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-2xl border border-white/10 font-mono text-xs text-on-surface space-y-space-md shadow-2xl">
            <div className="text-center space-y-1 pb-space-sm border-b border-dashed border-outline-variant">
              <h3 className="font-display text-xl font-black text-on-surface tracking-wider uppercase">
                GITSHAME DEBT RECEIPT
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                STORE #0418 • TERMINAL OF RECKONING
              </p>
              <p className="text-[10px] text-outline">
                TIMESTAMP: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="space-y-1.5 pb-space-sm border-b border-dashed border-outline-variant text-[11px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">OFFENDER:</span>
                <span className="font-bold text-primary-container">@{roast.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">TITLE:</span>
                <span className="font-bold text-right text-on-surface truncate max-w-[200px]">
                  {roast.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">ARCHETYPE:</span>
                <span className="text-on-surface truncate">{roast.devPersonality}</span>
              </div>
            </div>

            {/* Line item crimes */}
            <div className="space-y-2 pb-space-sm border-b border-dashed border-outline-variant text-[11px]">
              <div className="flex justify-between text-outline text-[10px]">
                <span>CRIME DESCRIPTION</span>
                <span>SEVERITY</span>
              </div>
              {roast.statDiagnoses.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span className="truncate max-w-[180px]">{d.label}</span>
                  <span className="font-bold text-primary-container">{d.value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Copy-Pasted StackOverflow</span>
                <span className="text-error font-bold">68.2%</span>
              </div>
              <div className="flex justify-between">
                <span>Test Coverage</span>
                <span className="text-error font-bold">0.00%</span>
              </div>
            </div>

            {/* Total Shame Calculation */}
            <div className="space-y-1.5 pb-space-sm border-b border-dashed border-outline-variant">
              <div className="flex justify-between text-sm font-bold">
                <span>SHAME SUB-TOTAL:</span>
                <span>{roast.shameScore}%</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-error">
                <span>NET REPUTATIONAL LOSS:</span>
                <span suppressHydrationWarning>-${(roast.shameScore * 1420).toLocaleString("en-US")}</span>
              </div>
            </div>

            {/* Verdict footer */}
            <div className="text-center space-y-2 pt-space-xs">
              <p className="font-bold text-primary-container text-xs leading-snug">
                &ldquo;{roast.verdict}&rdquo;
              </p>
              <div className="font-mono text-[9px] text-outline tracking-widest uppercase">
                ||| | ||||| || |||||| | ||| ||||||| ||||
              </div>
              <p className="text-[10px] text-on-surface-variant">
                NO REFUNDS • NO APPEALS • GO WRITE SOME TESTS
              </p>
            </div>
          </div>
        )}

        {/* Footer Watermark */}
        <div className="pt-space-md mt-space-lg flex items-center justify-between border-t border-white/5 text-on-surface-variant font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary-container">
              terminal
            </span>
            <span>Prosecuted by gitshame.dev</span>
          </span>
          <button
            type="button"
            onClick={() => setShowBadgeModal(true)}
            className="text-primary-container hover:underline cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">badge</span>
            <span>Get README Badge</span>
          </button>
        </div>
      </div>

      {/* Challenge / 1v1 Battle Banner */}
      {onChallengeFriend && (
        <div className="p-space-lg rounded-2xl bg-surface-container/80 backdrop-blur-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div>
            <h4 className="font-display font-bold text-on-surface text-base">
              Think your coworker writes worse code?
            </h4>
            <p className="font-body text-sm text-on-surface-variant">
              Drop them into the Repo Fight 1v1 Deathmatch arena and find out who ships more garbage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChallengeFriend(roast.username)}
            className="px-space-lg py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">swords</span>
            <span>Challenge in 1v1 Fight</span>
          </button>
        </div>
      )}

      {/* README Badge Modal */}
      {showBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-surface-container p-space-lg rounded-3xl max-w-md w-full border border-white/10 shadow-2xl space-y-space-md">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-on-surface text-lg">GitHub README Badge</h4>
              <button
                type="button"
                onClick={() => setShowBadgeModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body text-sm text-on-surface-variant">
              Embed your official GitShame badge in your repository README to warn potential
              collaborators:
            </p>
            <div className="p-3 bg-surface-container-lowest rounded-xl font-mono text-xs text-primary-container break-all border border-white/5">
              {readmeBadgeMarkdown}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCopyBadge}
                className="px-space-lg py-2 rounded-full bg-primary-container text-on-primary-container font-body text-sm font-bold shadow-[0_0_16px_rgba(0,245,160,0.3)]"
              >
                {badgeCopied ? "Copied!" : "Copy Markdown"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
