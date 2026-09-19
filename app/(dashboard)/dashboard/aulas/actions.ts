"use server";

import { createClient } from "@/lib/supabase/server";
import { syncGamificationForUser } from "@/lib/services/gamification.service";

export async function syncGamificationAction(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  await syncGamificationForUser(user.id);
}
