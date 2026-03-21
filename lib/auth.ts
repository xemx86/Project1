import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProfileRow } from "@/types/store";

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createServerSupabaseClient();
  const { data: auth } = await supabase.auth.getUser();

  const user = auth.user;
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? "",
      role: "customer"
    };
  }

  return profile as ProfileRow;
}
