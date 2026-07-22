import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type PremiumLayoutProps = {
  children: React.ReactNode;
};

export default async function PremiumLayout({
  children,
}: PremiumLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: subscription, error: subscriptionError } =
    await supabase
      .from("subscriptions")
      .select("id, status, plan, next_due_date, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (subscriptionError) {
    console.error(
      "Erro ao verificar assinatura:",
      subscriptionError.message
    );
  }

  const hasActiveSubscription =
    subscription?.status === "active";

  if (!hasActiveSubscription) {
    redirect("/dashboard?assinatura=necessaria");
  }

  return <>{children}</>;
}