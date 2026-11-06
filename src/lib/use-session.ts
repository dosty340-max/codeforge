"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useCurrentUser() {
  const [state, setState] = useState<{ ready: boolean; user: User | null }>({ ready: false, user: null });

  useEffect(() => {
    const { data } = createClient().auth.onAuthStateChange((_event, session) => {
      setState({ ready: true, user: session?.user ?? null });
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return state;
}
