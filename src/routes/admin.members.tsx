import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import {
  DEFAULT_BASE_COUNT,
  clearBaseCount,
  formatMembers,
  getActiveMembers,
  getBaseCount,
  runValidation,
  setBaseCount,
  weeklyIncrement,
  weeksSinceBase,
} from "@/lib/members";

export const Route = createFileRoute("/admin/members")({
  head: () => ({
    meta: [
      { title: "Admin — Weekly Members Counter" },
      { name: "description", content: "Configure the weekly starting active-members baseline and validate the deterministic increment logic." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminMembersPage,
});

function AdminMembersPage() {
  const [base, setBase] = useState<number>(DEFAULT_BASE_COUNT);
  const [input, setInput] = useState<string>("");
  const [saved, setSaved] = useState<string>("");

  useEffect(() => {
    const b = getBaseCount();
    setBase(b);
    setInput(String(b));
  }, []);

  const current = useMemo(() => getActiveMembers(new Date(), base), [base]);
  const weeks = useMemo(() => weeksSinceBase(new Date()), []);
  const results = useMemo(() => runValidation(), []);
  const passedAll = results.every((r) => r.passed);

  const upcoming = useMemo(() => {
    const rows: { week: number; increment: number; total: number }[] = [];
    let total = base;
    for (let i = 1; i <= 8; i++) {
      const inc = weeklyIncrement(weeks + i);
      total += inc;
      rows.push({ week: weeks + i, increment: inc, total });
    }
    return rows;
  }, [base, weeks]);

  function save() {
    const n = Number.parseInt(input, 10);
    if (!Number.isFinite(n) || n < 0) {
      setSaved("Enter a non-negative integer.");
      return;
    }
    setBaseCount(n);
    setBase(n);
    setSaved(`Saved baseline: ${formatMembers(n)}`);
  }

  function reset() {
    clearBaseCount();
    setBase(DEFAULT_BASE_COUNT);
    setInput(String(DEFAULT_BASE_COUNT));
    setSaved(`Reset to default: ${formatMembers(DEFAULT_BASE_COUNT)}`);
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-serif text-4xl">Admin · Members Counter</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set the weekly starting active-members value and validate the deterministic increment logic.
          Changes are stored locally in your browser.
        </p>

        <section className="mt-10 rounded-lg border border-border p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Current display value</div>
              <div className="mt-1 font-serif text-3xl">{formatMembers(current)}+</div>
            </div>
            <div className="text-sm text-muted-foreground">Weeks since base Friday: {weeks}</div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              type="number"
              min={0}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Baseline value"
            />
            <button onClick={save} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
              Save baseline
            </button>
            <button onClick={reset} className="rounded-md border border-border px-4 py-2 text-sm">
              Reset to default
            </button>
          </div>
          {saved && <p className="mt-3 text-sm text-muted-foreground">{saved}</p>}
        </section>

        <section className="mt-8 rounded-lg border border-border p-6">
          <h2 className="font-serif text-2xl">Next 8 weekly updates</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr>
                  <th className="py-2">Week index</th>
                  <th className="py-2">Increment</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((r) => (
                  <tr key={r.week} className="border-t border-border">
                    <td className="py-2">{r.week}</td>
                    <td className="py-2">+{r.increment}</td>
                    <td className="py-2">{formatMembers(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-border p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Validation</h2>
            <span className={passedAll ? "text-sm text-green-600" : "text-sm text-red-600"}>
              {passedAll ? "All checks passed" : "Some checks failed"}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {results.map((r) => (
              <li key={r.name} className="flex items-start gap-3">
                <span className={r.passed ? "mt-1 h-2 w-2 rounded-full bg-green-500" : "mt-1 h-2 w-2 rounded-full bg-red-500"} />
                <div>
                  <div className="text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </SiteShell>
  );
}
