"use client";

import React from "react";

export function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface-container-lowest mt-auto border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl mb-space-xl">
          {/* Col 1: Brand */}
          <div className="space-y-space-sm md:col-span-1">
            <div className="flex items-center gap-space-sm">
              <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center border border-white/5 shadow-[0_0_12px_rgba(0,245,160,0.15)]">
                <span className="material-symbols-outlined text-primary-container text-[16px]">
                  terminal
                </span>
              </div>
              <span className="font-display text-body-lg text-on-surface font-bold">
                GitShame
              </span>
            </div>
            <p className="font-body text-body-sm text-on-surface-variant max-w-xs leading-relaxed">
              The ruthless, confidential telemetry engine benchmarking architectural hubris, todo
              debt, and midnight commits.
            </p>
          </div>

          {/* Col 2: Live Sin Telemetry */}
          <div className="space-y-space-sm md:col-span-1">
            <h4 className="font-mono text-label-code-sm uppercase tracking-wider text-primary font-semibold">
              Live Sin Telemetry
            </h4>
            <div className="space-y-space-xs font-mono text-label-code-sm text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span className="text-outline">Force Pushes (24h)</span>
                <span className="text-primary-container font-semibold">14,289</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">Ignored TODOs</span>
                <span className="text-secondary font-semibold">1,842,910</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">Hardcoded Secrets</span>
                <span className="text-error font-semibold">319 leaked</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">Broken Pipelines</span>
                <span className="text-tertiary-container font-semibold">89.4%</span>
              </div>
            </div>
          </div>

          {/* Col 3: Engine Features */}
          <div className="space-y-space-sm md:col-span-1">
            <h4 className="font-mono text-label-code-sm uppercase tracking-wider text-primary font-semibold">
              Engine Capabilities
            </h4>
            <ul className="space-y-space-xs font-mono text-xs text-on-surface-variant">
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  check_circle
                </span>
                <span>Gemini Flash Neural Roast</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  check_circle
                </span>
                <span>Repo Fight 1v1 Deathmatch</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  check_circle
                </span>
                <span>Thermal Debt Receipt Export</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary-container">
                  check_circle
                </span>
                <span>4 AI Prosecutorial Voices</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div className="space-y-space-sm md:col-span-1">
            <h4 className="font-mono text-label-code-sm uppercase tracking-wider text-primary font-semibold">
              Navigation
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleScrollToTop}
                className="w-full text-left font-body text-xs text-on-surface-variant hover:text-primary-container transition-colors flex items-center justify-between p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-white/5"
              >
                <span>Back to Top</span>
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg text-on-surface-variant font-mono text-[12px] border-t border-white/5">
          <div className="flex items-center gap-space-xs text-outline">
            <span>© 2025 GitShame. Crafted for developers with 0% test coverage.</span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              All repos judged impartially
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
