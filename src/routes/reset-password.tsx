import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Reset password — Opus Drinks" }],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  }

  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-6 py-24">
        <form
          onSubmit={onSubmit}
          className="w-full rounded-sm border border-border bg-surface/40 p-8"
        >
          <h1 className="font-display text-3xl">Set a new password</h1>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="mt-6 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
          />
          <button
            disabled={busy}
            className="mt-4 w-full rounded-sm gold-gradient px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground disabled:opacity-60"
          >
            {busy ? "..." : "Update password"}
          </button>
          {msg && <p className="mt-4 text-sm text-red-400">{msg}</p>}
        </form>
      </section>
    </SiteShell>
  );
}
