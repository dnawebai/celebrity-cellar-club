// Deterministic weekly member counter.
// Baseline: 29,205 active members on Friday 2026-07-03 (UTC).
// Every Friday the count increases by a seeded pseudo-random amount
// between 10 and 23 (inclusive) so all visitors see the same number.

const BASE_COUNT = 29205;
const BASE_FRIDAY_UTC = Date.UTC(2026, 6, 3); // July 3, 2026 (month is 0-indexed)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function weeklyIncrement(weekIndex: number): number {
  // Deterministic hash → 10..23
  let h = weekIndex * 2654435761;
  h = (h ^ (h >>> 16)) >>> 0;
  return 10 + (h % 14); // 0..13 → 10..23
}

export function getActiveMembers(now: Date = new Date()): number {
  // Find most recent Friday <= now (UTC).
  const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const day = new Date(nowUtc).getUTCDay(); // 0=Sun … 5=Fri
  const daysSinceFriday = (day - 5 + 7) % 7;
  const lastFridayUtc = nowUtc - daysSinceFriday * 24 * 60 * 60 * 1000;

  const weeks = Math.max(0, Math.round((lastFridayUtc - BASE_FRIDAY_UTC) / WEEK_MS));
  let total = BASE_COUNT;
  for (let i = 1; i <= weeks; i++) total += weeklyIncrement(i);
  return total;
}

export function formatMembers(n: number): string {
  return n.toLocaleString("en-US");
}
