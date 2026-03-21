"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Locale } from "@/lib/i18n";

export function SignOutButton({
  lang,
  label,
}: {
  lang: Locale;
  label: string;
}) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push(`/${lang}`);
  }

  return (
    <button type="button" onClick={handleSignOut}>
      {label}
    </button>
  );
}