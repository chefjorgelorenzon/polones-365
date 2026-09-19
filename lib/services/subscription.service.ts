import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function hasActiveSubscription(
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar assinatura:", error.message);
    return false;
  }

  return subscription?.status === "active";
}
