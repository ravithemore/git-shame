import React from "react";
import { Flame, Heart, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950/60 py-8 px-4 text-center text-xs text-zinc-500 font-mono">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <span className="text-zinc-300 font-bold">GitShame</span>
          <span>— For satirical and entertainment purposes only.</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <span>Engineered with zero mercy & zero API cost</span>
        </div>
      </div>
    </footer>
  );
}
