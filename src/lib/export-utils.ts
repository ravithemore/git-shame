// Safe client-side dynamic wrappers for canvas-confetti and html-to-image
// Prevents SSR crashes, Webpack ESM module interop issues, and "a[d] is not a function" errors

export async function fireConfetti(options: {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
} = {}) {
  if (typeof window === "undefined") return;
  try {
    const confettiMod = await import("canvas-confetti");
    const confettiFn = (confettiMod as any).default || confettiMod;
    if (typeof confettiFn === "function") {
      confettiFn(options);
    }
  } catch (err) {
    console.warn("Could not fire confetti:", err);
  }
}

export async function captureToPng(element: HTMLElement, options: Record<string, any> = {}): Promise<string> {
  if (typeof window === "undefined") throw new Error("Window not defined");
  const htiMod = await import("html-to-image");
  const toPngFn = htiMod.toPng || (htiMod as any).default?.toPng || (htiMod as any).toPng;
  if (typeof toPngFn !== "function") {
    throw new Error("toPng function not available in html-to-image module");
  }
  return toPngFn(element, options);
}

