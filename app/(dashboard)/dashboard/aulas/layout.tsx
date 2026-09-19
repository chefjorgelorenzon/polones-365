import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/services/subscription.service";

type AulasLayoutProps = {
  children: React.ReactNode;
};

export default async function AulasLayout({
  children,
}: AulasLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const isSubscriber = await hasActiveSubscription(user.id);

  if (!isSubscriber) {
    redirect("/dashboard?assinatura=necessaria");
  }

  return <>{children}</>;
}
