import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/sommelier")({
  head: () => ({
    meta: [
      { title: "Opus Sommelier — Luxury Beverage Advisor" },
      {
        name: "description",
        content:
          "A luxury sommelier concierge for wine recommendations, food pairings, investment guidance, and cellaring advice.",
      },
    ],
  }),
  component: SommelierPage,
});

type Msg = { role: "user" | "assistant"; text: string };

const sampleQuestions = [
  "Pair a 2010 Brunello with a six-course tasting menu",
  "What should I drink with venison and black truffle?",
  "Which 2020 Bordeaux should I cellar for 20 years?",
  "Is now the right time to sell my 1996 DRC Grands Échezeaux?",
];

function SommelierPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Welcome. I'm the Opus Sommelier — at your service for pairings, cellaring, investments, and rare allocations. What would you like to explore tonight?",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text:
          "An excellent question. Activate a membership to unlock live recommendations from the Opus Sommelier, with real-time market data and personalized cellaring guidance.",
      },
    ]);
    setInput("");
  };

  return (
    <SiteShell>
      <section className="border-b border-border px-6 pt-32 pb-16 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <span className="mb-6 block text-[10px] uppercase tracking-[0.4em] text-gold">
            Opus Sommelier
          </span>
          <h1 className="max-w-[20ch] font-display text-5xl text-balance md:text-7xl">
            Your private <span className="italic text-gold-gradient">cellar concierge</span>.
          </h1>
          <p className="mt-8 max-w-[60ch] text-lg text-muted-foreground">
            Ask anything about wine, spirits, collecting, investing, and pairings. The Opus
            Sommelier draws on five decades of auction data, 12,000 tasting notes, and the
            Committee's private library.
          </p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex h-[600px] flex-col rounded-sm border border-border bg-surface/40">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-sm px-5 py-4 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-gold/15 text-foreground ring-1 ring-gold/30"
                          : "bg-background ring-1 ring-border text-foreground"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="mb-1 text-[9px] uppercase tracking-[0.3em] text-gold">
                          Opus Sommelier
                        </div>
                      ) : null}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2 border-t border-border bg-background/60 p-4"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a pairing, a vintage, an investment…"
                className="flex-1 rounded-sm bg-surface px-4 py-3 text-sm ring-1 ring-border focus:outline-none focus:ring-gold/50"
              />
              <button className="rounded-sm gold-gradient px-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-primary-foreground">
                Send
              </button>
            </form>
          </div>

          <aside>
            <div className="rounded-sm border border-border bg-surface/40 p-6">
              <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">
                Start with
              </div>
              <ul className="space-y-2">
                {sampleQuestions.map((q) => (
                  <li key={q}>
                    <button
                      onClick={() => send(q)}
                      className="w-full rounded-sm border border-border bg-background/60 p-3 text-left text-xs text-muted-foreground transition hover:border-gold/40 hover:text-foreground"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-border pt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Capabilities
              </div>
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {[
                  "Wine recommendations",
                  "Food pairings",
                  "Investment analysis",
                  "Cellaring advice",
                  "Portfolio review",
                  "Auction recommendations",
                  "Gift suggestions",
                  "Travel & winery itineraries",
                ].map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-gold" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
