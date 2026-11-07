"use client";

import React from "react";
import { sounds } from "@/lib/audio";

interface HallOfShameProps {
  onSelectUser: (username: string) => void;
}

const PUBLIC_EXCORIATIONS = [
  {
    repo: "mega-frontend-app",
    handle: "enterprise-fintech",
    badge: "JS",
    badgeColor: "text-primary-container",
    grade: "Grade: F-",
    gradeColor: "bg-error-container/30 text-error",
    snippetFile: "// src/utils/helpers.ts line 8421",
    snippet: [
      { text: "export const doMagic = (x: any): any => {", color: "text-error" },
      { text: "  // don't touch this it breaks payments", color: "text-on-surface-variant" },
      { text: "  return eval(atob(x)) as any;", color: "text-on-surface" },
      { text: "};", color: "text-error" },
    ],
    critique:
      '"You wrote 9,400 lines of Redux boilerplate to toggle a single modal. Even your bundler throws memory warnings out of sheer pity."',
    metricIcon: "fire_extinguisher",
    metricText: "84 Panic Pushes",
    metricColor: "text-error",
    receiptId: "#8901",
    targetUser: "torvalds",
  },
  {
    repo: "ai-autonomous-agent",
    handle: "stealth-ai-corp",
    badge: "PY",
    badgeColor: "text-tertiary-container",
    grade: "Grade: D",
    gradeColor: "bg-error-container/30 text-error",
    snippetFile: "// agent/decision_loop.py",
    snippet: [
      { text: "while True:", color: "text-tertiary" },
      { text: "  try:", color: "text-on-surface-variant" },
      { text: "    take_autonomous_action()", color: "text-on-surface" },
      { text: "  except Exception: pass # yolo", color: "text-error" },
    ],
    critique:
      '"Your \'Agentic Artificial General Intelligence\' is just 47 nested while-true loops and an OpenAI API key wrapped in bare except blocks."',
    metricIcon: "visibility_off",
    metricText: "0 Unit Tests",
    metricColor: "text-secondary",
    receiptId: "#8902",
    targetUser: "gaearon",
  },
  {
    repo: "ultra-fast-kv-store",
    handle: "systems-guru",
    badge: "RS",
    badgeColor: "text-secondary",
    grade: "Grade: C-",
    gradeColor: "bg-secondary-container/20 text-secondary",
    snippetFile: "// src/memory_manager.rs",
    snippet: [
      { text: "pub unsafe fn allocate_block() {", color: "text-primary-container" },
      { text: "  // compiler was screaming, had to hush it", color: "text-on-surface-variant" },
      { text: "  std::mem::transmute(0x0 as *mut ());", color: "text-error" },
      { text: "}", color: "text-primary-container" },
    ],
    critique:
      '"Claims memory safety in the README; uses 312 `unsafe` blocks to dodge the borrow checker because \'lifetimes are for the weak\'."',
    metricIcon: "memory",
    metricText: "312 Unsafe Blocks",
    metricColor: "text-error",
    receiptId: "#8903",
    targetUser: "shadcn",
  },
];

export function HallOfShame({ onSelectUser }: HallOfShameProps) {
  return (
    <section className="w-full bg-surface-container-lowest py-space-2xl border-t border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary-container font-mono text-label-code-sm uppercase font-semibold mb-space-sm border border-white/5">
              <span className="material-symbols-outlined text-[16px]">gavel</span>
              <span>Hall of Infamy</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-on-surface font-extrabold tracking-tight">
              Recent Public Excoriations
            </h2>
            <p className="font-body text-body-md text-on-surface-variant max-w-xl mt-1">
              Real repos, genuine crimes against clean architecture, dissected by the Savage Linter.
            </p>
          </div>

          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={() => {
                sounds.playBlip();
                onSelectUser("torvalds");
              }}
              className="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-body text-body-sm font-semibold transition-all border border-white/5"
            >
              <span>Explore All 24,000+ Receipts</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Bento Grid of Detailed Dossiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {PUBLIC_EXCORIATIONS.map((item, idx) => (
            <div
              key={idx}
              className="p-space-lg rounded-3xl bg-surface-container/70 backdrop-blur-2xl shadow-xl flex flex-col justify-between hover:bg-surface-container/90 transition-all duration-300 border border-white/5"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div
                      className={`w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center font-mono font-bold ${item.badgeColor} border border-white/5`}
                    >
                      {item.badge}
                    </div>
                    <div>
                      <h3 className="font-display text-body-lg font-bold text-on-surface">
                        {item.repo}
                      </h3>
                      <span className="font-mono text-label-code-sm text-outline">
                        @{item.handle}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-mono text-[12px] font-bold ${item.gradeColor}`}
                  >
                    {item.grade}
                  </span>
                </div>

                {/* Terminal Snippet */}
                <div className="p-space-md rounded-2xl bg-surface-container-lowest font-mono text-label-code-sm text-on-surface space-y-1 mb-space-md shadow-inner border border-white/5 overflow-x-auto">
                  <div className="text-outline text-[11px]">{item.snippetFile}</div>
                  {item.snippet.map((line, lIdx) => (
                    <div key={lIdx} className={line.color}>
                      {line.text}
                    </div>
                  ))}
                </div>

                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                  {item.critique}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-space-md mt-space-md flex items-center justify-between font-mono text-[12px] text-outline border-t border-white/5">
                <span className="flex items-center gap-1">
                  <span className={`material-symbols-outlined text-[16px] ${item.metricColor}`}>
                    {item.metricIcon}
                  </span>
                  <span>{item.metricText}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBlip();
                    onSelectUser(item.targetUser);
                  }}
                  className="text-primary-container font-semibold hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View Receipt {item.receiptId}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
