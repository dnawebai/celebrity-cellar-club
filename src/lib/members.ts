// Deterministic weekly member counter.
// Baseline: 29,205 active members on Friday 2026-07-03 (UTC).
// Every Friday the count increases by a seeded pseudo-random amount
// between 10 and 23 (inclusive) so all visitors see the same number.

export const DEFAULT_BASE_COUNT = 29205;
export const BASE_FRIDAY_UTC = Date.UTC(2026, 6, 3); // July 3, 2026 (month is 0-indexed)
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const OVERRIDE_KEY = "opus.members.baseOverride";

export function weeklyIncrement(weekIndex: number): number {
  // Deterministic hash → 10..23
  let h = weekIndex * 2654435761;
  h = (h ^ (h >>> 16)) >>> 0;
  return 10 + (h % 14); // 0..13 → 10..23
}

export function getBaseCount(): number {
  if (typeof window === "undefined") return DEFAULT_BASE_COUNT;
  const raw = window.localStorage.getItem(OVERRIDE_KEY);
  if (!raw) return DEFAULT_BASE_COUNT;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_BASE_COUNT;
}

export function setBaseCount(n: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OVERRIDE_KEY, String(Math.max(0, Math.floor(n))));
}

export function clearBaseCount(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(OVERRIDE_KEY);
}

export function weeksSinceBase(now: Date = new Date()): number {
  const nowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const day = new Date(nowUtc).getUTCDay(); // 0=Sun … 5=Fri
  const daysSinceFriday = (day - 5 + 7) % 7;
  const lastFridayUtc = nowUtc - daysSinceFriday * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.round((lastFridayUtc - BASE_FRIDAY_UTC) / WEEK_MS));
}

export function getActiveMembers(now: Date = new Date(), baseOverride?: number): number {
  const base = baseOverride ?? getBaseCount();
  const weeks = weeksSinceBase(now);
  let total = base;
  for (let i = 1; i <= weeks; i++) total += weeklyIncrement(i);
  return total;
}

export function formatMembers(n: number): string {
  return n.toLocaleString("en-US");
}

// ---- Validation suite for the deterministic increment logic. ----
export type ValidationResult = { name: string; passed: boolean; detail: string };

export function runValidation(): ValidationResult[] {
  const results: ValidationResult[] = [];

  // 1. Every weekly increment is within [10, 23].
  let minInc = Infinity;
  let maxInc = -Infinity;
  for (let i = 1; i <= 520; i++) {
    const inc = weeklyIncrement(i);
    if (inc < minInc) minInc = inc;
    if (inc > maxInc) maxInc = inc;
  }
  results.push({
    name: "Increment range 10–23 (520 weeks)",
    passed: minInc >= 10 && maxInc <= 23,
    detail: `observed min=${minInc}, max=${maxInc}`,
  });

  // 2. Deterministic: same input → same output.
  const a = weeklyIncrement(42);
  const b = weeklyIncrement(42);
  results.push({
    name: "Deterministic reproducibility",
    passed: a === b,
    detail: `weeklyIncrement(42) = ${a} on both calls`,
  });

  // 3. Monotonic growth week over week.
  const base = 1000;
  let prev = getActiveMembers(new Date(BASE_FRIDAY_UTC), base);
  let monotonic = true;
  for (let w = 1; w <= 52; w++) {
    const curr = getActiveMembers(new Date(BASE_FRIDAY_UTC + w * WEEK_MS), base);
    if (curr <= prev) {
      monotonic = false;
      break;
    }
    prev = curr;
  }
  results.push({
    name: "Monotonic growth over 52 weeks",
    passed: monotonic,
    detail: monotonic ? "strictly increasing each Friday" : "found a non-increasing week",
  });

  // 4. Baseline exactly on base Friday.
  const baseline = getActiveMembers(new Date(BASE_FRIDAY_UTC), 29205);
  results.push({
    name: "Baseline equals configured value on base Friday",
    passed: baseline === 29205,
    detail: `got ${baseline}`,
  });

  // 5. No jump mid-week (Sat–Thu equal to prior Friday).
  const wed = getActiveMembers(new Date(BASE_FRIDAY_UTC + 5 * 24 * 60 * 60 * 1000), 29205);
  results.push({
    name: "Value stable between Fridays",
    passed: wed === 29205,
    detail: `Wednesday after base Friday = ${wed}`,
  });

  // 6. Average increment near (10+23)/2 = 16.5.
  let sum = 0;
  const N = 1000;
  for (let i = 1; i <= N; i++) sum += weeklyIncrement(i);
  const avg = sum / N;
  results.push({
    name: "Average increment near 16.5",
    passed: avg > 15 && avg < 18,
    detail: `avg over ${N} weeks = ${avg.toFixed(2)}`,
  });

  return results;
}
