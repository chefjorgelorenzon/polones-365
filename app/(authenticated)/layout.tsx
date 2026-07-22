import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}