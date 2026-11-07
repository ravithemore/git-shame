"use client";

import React, { useRef, useState } from "react";
import { Swords, Trophy, Skull, Flame, Share2, ArrowRight, Download, Zap, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import * as htmlToImage from "html-to-image";
import { VsBattleResult } from "@/types";

interface VsBattleCardProps {
  battle: VsBattleResult;
  onReset: () => void;
}

export function VsBattleCard({ battle, onReset }: VsBattleCardProps) {
  const { player1, player2, winner, battleSummary, categoryWinners } = battle;
  const battleRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Health/Dignity remaining (lower shame = higher dignity)
  const p1Dignity = Math.max(5, 100 - player1.shameScore);
  const p2Dignity = Math.max(5, 100 - player2.shameScore);

  const handleShare = () => {
    const text = `⚔️ REPO FIGHT RESULTS:\n@${player1.username} (${player1.shameScore}/100 Shame) VS @${player2.username} (${player2.shameScore}/100 Shame)\n\nCrown of Shame goes to: @${winner} 👑\n\nBattle your coworker at gitshame.dev #GitShame #DevHumor`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleDownload = async () => {
    if (!battleRef.current || downloading) return;
    try {
      setDownloading(true);
      const dataUrl = await htmlToImage.toPng(battleRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `repo-fight-${player1.username}-vs-${player2.username}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
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
    <div className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
      {/* Arcade Match Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400 text-zinc-950 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]">
          <Zap className="w-3.5 h-3.5 fill-zinc-950" />
          <span>ARCADE DEATHMATCH • ROUND 1</span>
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase italic">
          BATTLE OF TECHNICAL DEBT
        </h2>
        <p className="text-zinc-300 text-xs sm:text-sm font-mono max-w-xl mx-auto bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
          ⚖️ {battleSummary}
        </p>
      </div>

      {/* Main Battle Arena Card (Exportable as PNG) */}
      <div
        ref={battleRef}
        id="repo-battle-arena"
        className="p-5 sm:p-8 rounded-3xl bg-zinc-950 border-2 border-zinc-800 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle retro scanlines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-0" />

        {/* Top Arcade Health / Dignity Bars */}
        <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-8 mb-8 pb-6 border-b border-zinc-800">
          {/* Player 1 Health */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-black">
              <span className="text-rose-400 uppercase truncate">@{player1.username}</span>
              <span className="text-zinc-400 text-[10px]">DIGNITY: {p1Dignity}%</span>
            </div>
            <div className="h-4 sm:h-5 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 rounded transition-all duration-1000"
                style={{ width: `${p1Dignity}%` }}
              />
            </div>
          </div>

          {/* Player 2 Health */}
          <div className="space-y-1.5 text-right">
            <div className="flex items-center justify-between text-xs font-mono font-black">
              <span className="text-zinc-400 text-[10px]">DIGNITY: {p2Dignity}%</span>
              <span className="text-purple-400 uppercase truncate">@{player2.username}</span>
            </div>
            <div className="h-4 sm:h-5 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-emerald-500 via-amber-500 to-purple-600 rounded transition-all duration-1000 ml-auto"
                style={{ width: `${p2Dignity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Side-by-Side Contenders Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Contender 1 */}
          <div
            className={`p-6 rounded-2xl relative transition-all flex flex-col justify-between ${
              winner === player1.username
                ? "bg-rose-950/30 border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.15)]"
                : "bg-zinc-900/60 border border-zinc-800"
            }`}
          >
            {winner === player1.username && (
              <div className="absolute -top-3.5 right-4 px-3 py-1 bg-rose-600 text-white font-mono text-[11px] font-black uppercase rounded shadow-lg transform rotate-2 flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" />
                <span>👑 SHAME CHAMPION</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative">
                  <img
                    src={player1.avatarUrl}
                    alt={player1.username}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500/50 bg-zinc-900"
                    crossOrigin="anonymous"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-rose-400 font-mono font-black">
                    P1
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{player1.name}</h3>
                  <span className="text-xs font-mono text-zinc-400">@{player1.username}</span>
                  <div className="mt-1 text-[11px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 inline-block">
                    {player1.title}
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold">Shame Rating</span>
                <span className="text-3xl font-black font-mono text-rose-400">
                  {player1.shameScore}<span className="text-xs text-zinc-600 font-normal">/100</span>
                </span>
              </div>

              {/* Sarcastic Quote */}
              <p className="text-xs text-zinc-300 italic bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                &ldquo;{player1.verdict}&rdquo;
              </p>
            </div>

            {/* Offense Tags */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Archetype: {player1.devPersonality}
              </span>
            </div>
          </div>

          {/* Contender 2 */}
          <div
            className={`p-6 rounded-2xl relative transition-all flex flex-col justify-between ${
              winner === player2.username
                ? "bg-purple-950/30 border-2 border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.15)]"
                : "bg-zinc-900/60 border border-zinc-800"
            }`}
          >
            {winner === player2.username && (
              <div className="absolute -top-3.5 right-4 px-3 py-1 bg-purple-600 text-white font-mono text-[11px] font-black uppercase rounded shadow-lg transform rotate-2 flex items-center gap-1">
                <Skull className="w-3.5 h-3.5" />
                <span>👑 SHAME CHAMPION</span>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative">
                  <img
                    src={player2.avatarUrl}
                    alt={player2.username}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/50 bg-zinc-900"
                    crossOrigin="anonymous"
                  />
                  <span className="absolute -bottom-1 -right-1 text-xs px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-purple-400 font-mono font-black">
                    P2
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{player2.name}</h3>
                  <span className="text-xs font-mono text-zinc-400">@{player2.username}</span>
                  <div className="mt-1 text-[11px] font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 inline-block">
                    {player2.title}
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold">Shame Rating</span>
                <span className="text-3xl font-black font-mono text-purple-400">
                  {player2.shameScore}<span className="text-xs text-zinc-600 font-normal">/100</span>
                </span>
              </div>

              {/* Sarcastic Quote */}
              <p className="text-xs text-zinc-300 italic bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/60 leading-relaxed">
                &ldquo;{player2.verdict}&rdquo;
              </p>
            </div>

            {/* Offense Tags */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                Archetype: {player2.devPersonality}
              </span>
            </div>
          </div>
        </div>

        {/* Category Round-By-Round Breakdown */}
        <div className="relative z-10 mt-8 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-black text-zinc-300 uppercase tracking-widest font-mono flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <span>Tale of the Tape: Category Head-to-Head</span>
            </h4>
            <span className="text-[10px] font-mono text-zinc-500">Judged by AI</span>
          </div>

          <div className="space-y-2.5">
            {categoryWinners.map((cat, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-zinc-500 font-mono text-[10px]">#{i + 1}</span>
                    <span>{cat.category}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">{cat.reason}</div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-950 text-xs font-mono text-rose-400 font-black border border-zinc-800 self-start sm:self-auto flex-shrink-0">
                  <span>Guilty:</span>
                  <span>@{cat.winner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watermark */}
        <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5 font-bold text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>GitShame.dev • Repo Fight</span>
          </div>
          <span>Share the damage</span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {downloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Exporting Arena...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download Battle Card</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4 text-sky-400" />
          <span>Post Verdict on X</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Rematch / New Fight</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
