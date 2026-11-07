"use client";

import React, { useRef, useState } from "react";
import { fireConfetti, captureToPng } from "@/lib/export-utils";
import { VsBattleResult } from "@/types";
import { sounds } from "@/lib/audio";

interface VsBattleCardProps {
  battle: VsBattleResult;
  onReset: () => void;
}

export function VsBattleCard({ battle, onReset }: VsBattleCardProps) {
  const { player1, player2, winner, battleSummary, categoryWinners } = battle;
  const battleRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Dignity remaining (lower shame = higher dignity)
  const p1Dignity = Math.max(5, 100 - player1.shameScore);
  const p2Dignity = Math.max(5, 100 - player2.shameScore);

  const handleShare = () => {
    sounds.playBlip();
    const text = `⚔️ REPO FIGHT 1v1 RESULTS:\n@${player1.username} (${player1.shameScore}/100 Shame) VS @${player2.username} (${player2.shameScore}/100 Shame)\n\nCrown of Shame awarded to: @${winner} 👑\n\nBattle your coworker at gitshame.dev #GitShame #DevHumor`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleDownload = async () => {
    if (!battleRef.current || downloading) return;
    try {
      setDownloading(true);
      const dataUrl = await captureToPng(battleRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
      });

      const link = document.createElement("a");
      link.download = `repo-fight-${player1.username}-vs-${player2.username}.png`;
      link.href = dataUrl;
      link.click();

      fireConfetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Failed to export image:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin pb-space-2xl space-y-space-lg">
      {/* Top Arena Header */}
      <div className="text-center space-y-space-xs max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/15 text-secondary font-mono text-xs uppercase font-semibold">
          <span className="material-symbols-outlined text-[16px]">swords</span>
          <span>Head to Head Showdown</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-black text-on-surface tracking-tight">
          Repo Fight Arena: Who Ships More Garbage?
        </h2>
        <p className="font-body text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto">
          {battleSummary}
        </p>
      </div>

      {/* Main Battle Arena Card (Exportable to PNG) */}
      <div
        ref={battleRef}
        id="repo-fight-canvas"
        className="rounded-3xl bg-surface-container/90 backdrop-blur-3xl p-space-lg sm:p-space-xl relative overflow-hidden shadow-2xl border border-white/10 space-y-space-lg"
      >
        {/* Ambient glow */}
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Health / Dignity Bars */}
        <div className="grid grid-cols-2 gap-space-md sm:gap-space-xl pb-space-md border-b border-white/10">
          {/* Player 1 Health */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-primary-container uppercase truncate">@{player1.username}</span>
              <span className="text-on-surface-variant text-[11px]">Dignity: {p1Dignity}%</span>
            </div>
            <div className="h-3 sm:h-4 bg-surface-container-lowest rounded-full p-0.5 border border-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-secondary to-primary-container rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(0,245,160,0.5)]"
                style={{ width: `${p1Dignity}%` }}
              />
            </div>
          </div>

          {/* Player 2 Health */}
          <div className="space-y-1 text-right">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-on-surface-variant text-[11px]">Dignity: {p2Dignity}%</span>
              <span className="text-tertiary-container uppercase truncate">@{player2.username}</span>
            </div>
            <div className="h-3 sm:h-4 bg-surface-container-lowest rounded-full p-0.5 border border-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-tertiary to-tertiary-container rounded-full transition-all duration-1000 ml-auto shadow-[0_0_12px_rgba(95,233,255,0.5)]"
                style={{ width: `${p2Dignity}%` }}
              />
            </div>
          </div>
        </div>

        {/* 1v1 Contenders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-space-md items-stretch">
          {/* Fighter 1 (Corner A) */}
          <div
            className={`md:col-span-5 p-space-lg rounded-2xl relative transition-all flex flex-col justify-between border ${
              winner === player1.username
                ? "bg-surface-container-high/90 border-primary-container/80 shadow-[0_0_30px_rgba(0,245,160,0.2)]"
                : "bg-surface-container-lowest border-white/5"
            }`}
          >
            {winner === player1.username && (
              <div className="absolute -top-3 right-4 px-3 py-1 bg-primary-container text-on-primary-container font-mono text-[10px] font-black uppercase rounded-full shadow-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">military_tech</span>
                <span>SHAME CHAMPION</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-mono text-label-code-sm text-primary-container font-semibold">
                  CORNER A
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[11px] text-outline">
                  {winner === player1.username ? "Supreme Sinner" : "Contender"}
                </span>
              </div>

              <div className="flex items-center gap-space-sm mb-space-md">
                <img
                  src={player1.avatarUrl}
                  alt={player1.username}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary-container/50 bg-surface-container"
                  crossOrigin="anonymous"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">{player1.name}</h3>
                  <span className="font-mono text-xs text-on-surface-variant">
                    @{player1.username}
                  </span>
                  <div className="font-mono text-[11px] text-primary truncate max-w-[200px]">
                    {player1.title}
                  </div>
                </div>
              </div>

              {/* Score Box */}
              <div className="p-space-md rounded-xl bg-surface-container-highest/60 border border-white/5 flex items-center justify-between mb-space-sm">
                <span className="font-mono text-xs uppercase text-on-surface-variant font-bold">
                  Shame Index
                </span>
                <span className="font-display text-3xl font-black text-primary-container">
                  {player1.shameScore}
                  <span className="text-xs text-on-surface-variant font-normal">/100</span>
                </span>
              </div>

              <p className="font-body text-xs text-on-surface-variant italic bg-surface-container-highest/40 p-space-sm rounded-xl border border-white/5">
                &ldquo;{player1.verdict}&rdquo;
              </p>
            </div>

            <div className="mt-space-md pt-space-xs border-t border-white/5 flex flex-wrap gap-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                {player1.devPersonality}
              </span>
            </div>
          </div>

          {/* VS Badge */}
          <div className="md:col-span-1 flex items-center justify-center my-2 md:my-0">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest shadow-xl flex items-center justify-center font-display text-headline-sm font-black text-primary-container border border-white/10">
              VS
            </div>
          </div>

          {/* Fighter 2 (Corner B) */}
          <div
            className={`md:col-span-5 p-space-lg rounded-2xl relative transition-all flex flex-col justify-between border ${
              winner === player2.username
                ? "bg-surface-container-high/90 border-tertiary-container/80 shadow-[0_0_30px_rgba(95,233,255,0.2)]"
                : "bg-surface-container-lowest border-white/5"
            }`}
          >
            {winner === player2.username && (
              <div className="absolute -top-3 right-4 px-3 py-1 bg-tertiary-container text-on-tertiary-container font-mono text-[10px] font-black uppercase rounded-full shadow-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">military_tech</span>
                <span>SHAME CHAMPION</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-mono text-label-code-sm text-tertiary-container font-semibold">
                  CORNER B
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container font-mono text-[11px] text-outline">
                  {winner === player2.username ? "Supreme Sinner" : "Challenger"}
                </span>
              </div>

              <div className="flex items-center gap-space-sm mb-space-md">
                <img
                  src={player2.avatarUrl}
                  alt={player2.username}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-tertiary-container/50 bg-surface-container"
                  crossOrigin="anonymous"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">{player2.name}</h3>
                  <span className="font-mono text-xs text-on-surface-variant">
                    @{player2.username}
                  </span>
                  <div className="font-mono text-[11px] text-tertiary truncate max-w-[200px]">
                    {player2.title}
                  </div>
                </div>
              </div>

              {/* Score Box */}
              <div className="p-space-md rounded-xl bg-surface-container-highest/60 border border-white/5 flex items-center justify-between mb-space-sm">
                <span className="font-mono text-xs uppercase text-on-surface-variant font-bold">
                  Shame Index
                </span>
                <span className="font-display text-3xl font-black text-tertiary-container">
                  {player2.shameScore}
                  <span className="text-xs text-on-surface-variant font-normal">/100</span>
                </span>
              </div>

              <p className="font-body text-xs text-on-surface-variant italic bg-surface-container-highest/40 p-space-sm rounded-xl border border-white/5">
                &ldquo;{player2.verdict}&rdquo;
              </p>
            </div>

            <div className="mt-space-md pt-space-xs border-t border-white/5 flex flex-wrap gap-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                {player2.devPersonality}
              </span>
            </div>
          </div>
        </div>

        {/* Category Faceoffs Grid */}
        <div className="space-y-space-xs pt-space-md border-t border-white/10">
          <h4 className="font-mono text-xs uppercase text-outline tracking-wider font-bold mb-space-sm">
            Tale of the Tape • Offense Breakdown
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {categoryWinners.map((cat, i) => (
              <div
                key={i}
                className="p-space-md rounded-2xl bg-surface-container-lowest border border-white/5 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-on-surface">{cat.category}</span>
                  <span className="text-primary-container font-semibold">
                    Winner: @{cat.winner}
                  </span>
                </div>
                <p className="font-body text-xs text-on-surface-variant">{cat.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Arena Footer Badges */}
        <div className="pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-body text-xs border-t border-white/5">
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                done_all
              </span>
              Real Git Blame Metrics
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                done_all
              </span>
              Hall of Shame Rank
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary-container">
                done_all
              </span>
              Shareable VS Card
            </span>
          </div>

          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={handleShare}
              className="px-space-md py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              <span>Share to X</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="px-space-lg py-2 rounded-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-body text-body-sm font-bold shadow-[0_0_16px_rgba(0,245,160,0.3)] transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>{downloading ? "Exporting..." : "Download Match Card"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playBlip();
                onReset();
              }}
              className="px-space-md py-2 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>New Battle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
