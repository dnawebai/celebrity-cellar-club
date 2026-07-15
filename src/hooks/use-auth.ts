import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
};

/**
 * Client-side auth subscription. Session bootstrap runs in useEffect only
 * (Supabase reads localStorage, which is unavailable during SSR).
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    user: null,
  });

  useEffect(() => {
    let cancelled = false;

    // Subscribe first, then read current session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setState({ loading: false, session, user: session?.user ?? null });
    });

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setState({
        loading: false,
        session: data.session,
        user: data.session?.user ?? null,
      });
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
