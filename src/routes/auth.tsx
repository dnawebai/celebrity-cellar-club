import { useEffect, useState } from "react";
import { Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteShell } from "@/components/site-shell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Opus Drinks" },
      {
        name: "description",
        content: "Sign in or create your Opus Drinks account to access members-only auctions, drops, and portfolio tools.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "sign_in" | "sign_up" | "forgot";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [loading, user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.invalidate();
        navigate({ to: "/dashboard" });
      } else if (mode === "sign_up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Check your inbox to confirm your email." });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMsg({ kind: "ok", text: "Password reset email sent." });
      }
    } catch (err: unknown) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }




  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-6 py-24">
        <div className="w-full rounded-sm border border-border bg-surface/40 p-8">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">Members Access</span>
          <h1 className="mt-2 font-display text-4xl">
            {mode === "sign_up" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "sign_up"
              ? "Start your Opus Drinks application. You must be 21 or older."
              : mode === "forgot"
              ? "We'll email you a link to set a new password."
              : "Sign in to access auctions, watchlist, and your portfolio."}
          </p>

          <div className="mt-6" />


          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
              />
            </label>
            {mode !== "forgot" && (
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Password
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                />
              </label>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full rounded-sm gold-gradient px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground disabled:opacity-60"
            >
              {busy
                ? "..."
                : mode === "sign_up"
                ? "Create account"
                : mode === "forgot"
                ? "Send reset link"
                : "Sign in"}
            </button>
          </form>

          {msg && (
            <p
              className={`mt-4 text-sm ${msg.kind === "err" ? "text-red-400" : "text-emerald-400"}`}
            >
              {msg.text}
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
            {mode !== "sign_in" && (
              <button className="hover:text-gold" onClick={() => setMode("sign_in")}>
                Have an account? Sign in
              </button>
            )}
            {mode !== "sign_up" && (
              <button className="hover:text-gold" onClick={() => setMode("sign_up")}>
                Create account
              </button>
            )}
            {mode !== "forgot" && (
              <button className="hover:text-gold" onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
            )}
          </div>

          <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Not ready? <Link to="/membership" className="text-gold">Learn about membership</Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
