"use client";

import React from "react";
import { Flame, Star, GitBranch, ArrowUpRight } from "lucide-react";
import { RoastTone } from "@/types";

interface HallOfShameProps {
  onSelectVictim: (username: string) => void;
}

const CELEBRITY_VICTIMS = [
  {
    name: "Linus Torvalds",
    handle: "torvalds",
    avatar: "https://avatars.githubusercontent.com/u/1024025?v=4",
    title: "Godfather of Git & C Rants",
    tag: "Invincible Veteran",
    score: 62,
    preview: "Invented Git out of pure spite. Still doesn't understand your 400MB node_modules folder.",
  },
  {
    name: "Dan Abramov",
    handle: "gaearon",
    avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
    title: "Redux & React Alchemist",
    tag: "State Machine Sinner",
    score: 84,
    preview: "Convinced millions of developers to write 47 files just to toggle a modal window.",
  },
  {
    name: "shadcn",
    handle: "shadcn",
    avatar: "https://avatars.githubusercontent.com/u/124599?v=4",
    title: "Chief Copy-Paste Officer",
    tag: "Modern Tailwind Legend",
    score: 79,
    preview: "Made copy-pasting code into your own project cool again. We salute the anti-npm rebellion.",
  },
];

export function HallOfShame({ onSelectVictim }: HallOfShameProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 border-t border-zinc-800/80">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
          <Star className="w-3.5 h-3.5" />
          <span>Hall of Fame & Shame</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Celebrity Code Sinners
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          Click to instantly roast famous open-source legends
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CELEBRITY_VICTIMS.map((victim) => (
          <div
            key={victim.handle}
            onClick={() => onSelectVictim(victim.handle)}
            className="group cursor-pointer p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-rose-500/60 hover:bg-zinc-900/40 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={victim.avatar}
                    alt={victim.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-800 group-hover:ring-rose-500/50 transition-all"
                    crossOrigin="anonymous"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                      {victim.name}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-500">@{victim.handle}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-rose-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="inline-block px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 font-semibold mb-2">
                {victim.title}
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {victim.preview}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-500">Estimated Shame</span>
              <span className="text-rose-400 font-bold">{victim.score}/100</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

