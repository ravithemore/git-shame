"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { SearchHero } from "@/components/SearchHero";
import { RoastCard } from "@/components/RoastCard";
import { VsBattleCard } from "@/components/VsBattleCard";
import { HallOfShame } from "@/components/HallOfShame";
import { Footer } from "@/components/Footer";
import { RoastResult, GitHubStats, VsBattleResult, RoastTone } from "@/types";
import { AlertCircle, X } from "lucide-react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [activeTone, setActiveTone] = useState<RoastTone>("savage");
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
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Smooth scroll to card
      setTimeout(() => {
        const el = document.getElementById("gitshame-card");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
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

      confetti({
        particleCount: 60,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to run Repo Fight.";
      setError(msg);
      setBattle(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeFriend = (username: string) => {
    setInputUsername(username);
    setRoast(null);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white bg-grid-pattern selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        <SearchHero
          onRoastSubmit={handleRoastSubmit}
          onBattleSubmit={handleBattleSubmit}
          loading={loading}
          activeTone={activeTone}
          setActiveTone={(tone) => {
            setActiveTone(tone);
            // If already roasted someone, re-roast with new tone
            if (roast) {
              handleRoastSubmit(roast.username, tone);
            }
          }}
          initialUsername={inputUsername}
        />

        {/* Error Notification */}
        {error && (
          <div className="max-w-xl mx-auto px-4 mb-8">
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Solo Roast Result Card */}
        {roast && !loading && (
          <RoastCard
            roast={roast}
            stats={stats || undefined}
            onChallengeFriend={handleChallengeFriend}
            onRegenerateTone={(tone) => handleRoastSubmit(roast.username, tone)}
          />
        )}

        {/* 1v1 Battle Result Card */}
        {battle && !loading && (
          <VsBattleCard
            battle={battle}
            onReset={() => {
              setBattle(null);
              window.scrollTo({ top: 100, behavior: "smooth" });
            }}
          />
        )}

        {/* Hall of Fame / Popular Victims */}
        <HallOfShame
          onSelectVictim={(victimHandle) => {
            handleRoastSubmit(victimHandle, activeTone);
          }}
        />
      </div>

      <Footer />
    </div>
  );
}

