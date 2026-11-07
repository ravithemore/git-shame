"use client";

import React, { useState } from "react";
import { fireConfetti } from "@/lib/export-utils";
import { Navbar } from "@/components/Navbar";
import { SearchHero } from "@/components/SearchHero";
import { RoastCard } from "@/components/RoastCard";
import { VsBattleCard } from "@/components/VsBattleCard";
import { HallOfShame } from "@/components/HallOfShame";
import { Footer } from "@/components/Footer";
import { RoastResult, GitHubStats, VsBattleResult, RoastTone } from "@/types";
import { sounds } from "@/lib/audio";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [activeTone, setActiveTone] = useState<RoastTone>("savage");
  const [mode, setMode] = useState<"solo" | "fight">("solo");
  const [roast, setRoast] = useState<RoastResult | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [battle, setBattle] = useState<VsBattleResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState("");

  const handleRoastSubmit = async (username: string, tone: RoastTone) => {
    try {
      setLoading(true);
      setError(null);
      setBattle(null);

      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, tone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to roast this profile.");
      }

      setRoast(data.roast);
      setStats(data.stats);

      // Trigger celebratory/mocking confetti
      fireConfetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.6 },
      });

      // Smooth scroll to card
      setTimeout(() => {
        const el = document.getElementById("roast-capture-card");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something broke while scanning sins.";
      setError(msg);
      setRoast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBattleSubmit = async (user1: string, user2: string) => {
    try {
      setLoading(true);
      setError(null);
      setRoast(null);

      const res = await fetch("/api/repo-fight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user1, user2 }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to simulate battle.");
      }

      setBattle(data.battle);

      fireConfetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.5 },
      });

      setTimeout(() => {
        const el = document.getElementById("repo-fight-canvas");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to run Repo Fight.";
      setError(msg);
      setBattle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeFriend = (username: string) => {
    setMode("fight");
    setInputUsername(username);
    setRoast(null);
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const handleToneChange = (tone: RoastTone) => {
    setActiveTone(tone);
    if (roast) {
      handleRoastSubmit(roast.username, tone);
    }
  };

  return (
    <div className="min-h-screen bg-background font-body text-on-surface antialiased flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation */}
      <Navbar
        onRoastClick={() => {
          setMode("solo");
          const input = document.getElementById("repo-input");
          if (input) {
            input.focus();
            window.scrollTo({ top: 180, behavior: "smooth" });
          }
        }}
        onFightClick={() => {
          setMode("fight");
          window.scrollTo({ top: 220, behavior: "smooth" });
        }}
        onHallOfShameClick={() => {
          const el = document.getElementById("hall-of-shame");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      <main className="w-full pt-28 sm:pt-32 flex-1">
        <div className="flex flex-col w-full relative overflow-hidden">
          {/* Hero Section */}
          <SearchHero
            onRoastSubmit={handleRoastSubmit}
            onBattleSubmit={handleBattleSubmit}
            loading={loading}
            activeTone={activeTone}
            setActiveTone={handleToneChange}
            initialUsername={inputUsername}
            mode={mode}
            setMode={setMode}
          />

          {/* Error Notification Toast */}
          {error && (
            <div className="max-w-xl mx-auto px-margin-mobile mb-space-lg">
              <div className="p-space-md rounded-2xl bg-error-container/40 border border-error/50 text-error font-mono text-xs sm:text-sm flex items-start justify-between gap-3 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-error hover:text-white"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Solo Roast Result Card */}
          {roast && !loading && (
            <div id="roaster" className="pt-space-md">
              <RoastCard
                roast={roast}
                stats={stats || undefined}
                onChallengeFriend={handleChallengeFriend}
                onRegenerateTone={(tone) => handleRoastSubmit(roast.username, tone)}
              />
            </div>
          )}

          {/* 1v1 Battle Result Card */}
          {battle && !loading && (
            <div id="repo-fight" className="pt-space-md">
              <VsBattleCard
                battle={battle}
                onReset={() => {
                  setBattle(null);
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }}
              />
            </div>
          )}

          {/* Hall of Shame / Recent Public Excoriations */}
          <div id="hall-of-shame">
            <HallOfShame
              onSelectUser={(victimHandle) => {
                setInputUsername(victimHandle);
                setMode("solo");
                handleRoastSubmit(victimHandle, activeTone);
              }}
            />
          </div>

          {/* Clean Call To Action Section */}
          <section className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin py-space-2xl">
            <div className="relative p-space-xl md:p-space-2xl rounded-3xl bg-gradient-to-r from-surface-container-high/90 via-surface-container-highest/90 to-surface-container-high/90 backdrop-blur-2xl text-center space-y-space-md shadow-2xl border border-white/5">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-on-surface">
                Ready for the truth about your codebase?
              </h2>
              <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Join thousands of developers discovering why their PRs take three weeks to approve.
                Zero authentication required.
              </p>
              <div className="pt-space-sm flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playBlip();
                    setMode("solo");
                    const input = document.getElementById("repo-input");
                    if (input) {
                      input.focus();
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-space-xl py-3.5 rounded-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-body text-body-sm font-bold shadow-[0_0_24px_rgba(0,245,160,0.4)] transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  <span>Enter Repository or Username</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}
