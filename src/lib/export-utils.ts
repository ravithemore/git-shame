"use client";

import confetti from "canvas-confetti";
import { toPng } from "html-to-image";

export function fireConfetti(options: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
} = {}) {
  if (typeof window === "undefined") return;
  try {
    const launch: any =
      typeof confetti === "function"
        ? confetti
        : (confetti as any)?.default && typeof (confetti as any).default === "function"
        ? (confetti as any).default
        : null;

    if (typeof launch === "function") {
      launch(options);
    }
  } catch (err) {
    console.warn("Could not fire confetti:", err);
  }
}

export async function captureToPng(element: HTMLElement, options: Record<string, any> = {}): Promise<string> {
  if (typeof window === "undefined") throw new Error("Window not defined");

  return toPng(element, {
    cacheBust: true,
    skipFonts: true,
    pixelRatio: 2,
    ...options,
  });
}

