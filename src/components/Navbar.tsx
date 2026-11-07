"use client";

import React from "react";

interface NavbarProps {
  onRoastClick?: () => void;
}

export function Navbar({ onRoastClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/75 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high/60">
      <div className="h-20 max-w-[1440px] mx-auto px-margin-mobile md:px-margin flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <div className="flex items-center gap-space-md">
          <a className="flex items-center gap-space-sm group" href="/">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-high shadow-[0_0_16px_rgba(0,245,160,0.15)] group-hover:shadow-[0_0_24px_rgba(0,245,160,0.3)] transition-all duration-300">
              <span className="material-symbols-outlined text-primary-container text-[22px]">terminal</span>
            </div>
            <span className="font-display text-xl text-on-surface tracking-tight font-extrabold">
              Git<span className="text-primary-container">Shame</span>
            </span>
          </a>

          {/* Live Sins Pulse Badge */}
          <div className="hidden sm:inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-high border border-outline-variant/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
            </span>
            <span className="font-mono text-[11px] text-primary uppercase tracking-wider font-semibold">
              LIVE SINS
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-space-lg text-sm">
          <a
            href="#roaster"
            className="transition-colors duration-200 text-primary-container font-semibold"
          >
            Roaster
          </a>
          <a
            href="#excoriations"
            className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
          >
            Debt Receipts
          </a>
          <a
            href="#hall-of-shame"
            className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
          >
            Hall of Shame
          </a>
          <a
            href="#repo-fight"
            className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
          >
            Repo Fight
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant hover:text-on-surface transition-colors duration-200"
          >
            Docs
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-space-md">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-space-xs px-space-md py-2.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface text-xs font-mono transition-all duration-200 border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>GitHub Star</span>
          </a>

          <button
            type="button"
            onClick={onRoastClick || (() => {
              const input = document.getElementById("repo-input");
              if (input) {
                input.focus();
                window.scrollTo({ top: 180, behavior: "smooth" });
              }
            })}
            className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-full bg-primary-container hover:bg-secondary-container text-on-primary-container text-xs font-bold tracking-tight shadow-[0_0_16px_rgba(0,245,160,0.3)] hover:shadow-[0_0_24px_rgba(0,245,160,0.5)] transition-all duration-200 active:scale-95"
          >
            Roast My Repo
          </button>

          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 border border-outline-variant/40">
            <span className="material-symbols-outlined text-primary-container text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
