// Stands in for a network round-trip so the UI's busy states are visible in the demo.
export function simulateRequest(ms: number = 650): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Deterministic pseudo-random generator (mulberry32) so the mock data looks the
// same on every load instead of reshuffling.
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

let idCounter = 0;
export function mockId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}
