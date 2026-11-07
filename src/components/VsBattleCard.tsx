"use client";

import React from "react";
import { Swords, Trophy, Skull, Flame, Share2, ArrowRight } from "lucide-react";
import { VsBattleResult } from "@/types";

interface VsBattleCardProps {
  battle: VsBattleResult;
  onReset: () => void;
}

export function VsBattleCard({ battle, onReset }: VsBattleCardProps) {
  const { player1, player2, winner, battleSummary, categoryWinners } = battle;

  const handleShare = () => {
    const text = `⚔️ REPO FIGHT RESULTS:\n@${player1.username} (${player1.shameScore}/100) VS @${player2.username} (${player2.shameScore}/100)\n\nCrown of Shame goes to: @${winner} 👑\n\nBattle your coworker at gitshame.dev #GitShame #DevHumor`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
          <Swords className="w-4 h-4" />
          <span>Repo Fight 1v1 Verdict</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Battle of Technical Debt
        </h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          {battleSummary}
        </p>
      </div>

      {/* Players Faceoff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* VS Badge in Middle for Desktop */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-zinc-900 border-2 border-purple-500 items-center justify-center font-black text-sm text-purple-400 shadow-xl">
          VS
        </div>

        {/* Player 1 Card */}
        <div className={`p-6 rounded-3xl bg-zinc-950 border transition-all ${
          winner === player1.username
            ? "border-rose-500 ring-2 ring-rose-500/20 shadow-2xl shadow-rose-500/10"
            : "border-zinc-800"
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={player1.avatarUrl}
                alt={player1.username}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-zinc-800"
                crossOrigin="anonymous"
              />
              <div>
                <h3 className="font-extrabold text-white text-lg">{player1.name}</h3>
                <span className="text-xs font-mono text-zinc-400">@{player1.username}</span>
              </div>
            </div>
            {winner === player1.username && (
              <div className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold font-mono flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>SHAME CROWN</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-mono">Shame Index</span>
            <span className="text-3xl font-black text-rose-400 font-mono">
              {player1.shameScore}<span className="text-xs text-zinc-500">/100</span>
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 mb-4">
            &quot;{player1.title}&quot; — {player1.verdict}
          </p>
        </div>

        {/* Player 2 Card */}
        <div className={`p-6 rounded-3xl bg-zinc-950 border transition-all ${
          winner === player2.username
            ? "border-purple-500 ring-2 ring-purple-500/20 shadow-2xl shadow-purple-500/10"
            : "border-zinc-800"
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={player2.avatarUrl}
                alt={player2.username}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-zinc-800"
                crossOrigin="anonymous"
              />
              <div>
                <h3 className="font-extrabold text-white text-lg">{player2.name}</h3>
                <span className="text-xs font-mono text-zinc-400">@{player2.username}</span>
              </div>
            </div>
            {winner === player2.username && (
              <div className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>SHAME CROWN</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-mono">Shame Index</span>
            <span className="text-3xl font-black text-purple-400 font-mono">
              {player2.shameScore}<span className="text-xs text-zinc-500">/100</span>
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 mb-4">
            &quot;{player2.title}&quot; — {player2.verdict}
          </p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
        <h4 className="text-sm font-bold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-2">
          <Skull className="w-4 h-4 text-rose-500" />
          <span>Category Round-by-Round Breakdown</span>
        </h4>

        <div className="space-y-3">
          {categoryWinners.map((cat, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-xs font-bold text-zinc-200">{cat.category}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">{cat.reason}</div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-xs font-mono text-rose-400 font-bold self-start sm:self-auto">
                <span>Offender:</span>
                <span>@{cat.winner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleShare}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Battle on X</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Rematch / New Battle</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
