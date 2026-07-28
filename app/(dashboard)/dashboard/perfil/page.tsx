import { redirect } from "next/navigation";
import {
  CircleUserRound,
  Settings2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import ProfileSections from "./ProfileSections";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      phone,
      role,
      avatar_url,
      study_goal,
      current_level,
      daily_goal_minutes,
      current_lesson_number
    `)
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Erro ao carregar perfil:", profileError);
  }

  const profileData = {
    id: user.id,
    email: user.email ?? "",
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    role: profile?.role ?? "student",
    avatar_url: profile?.avatar_url ?? null,
    study_goal: profile?.study_goal ?? "",
    current_level: profile?.current_level ?? "iniciante",
    daily_goal_minutes: profile?.daily_goal_minutes ?? 15,
    current_lesson_number:
      profile?.current_lesson_number ?? 1,
  };

  return (
    <main className="mx-auto w-full max-w-4xl">
      <header className="mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <CircleUserRound size={28} />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">
              Minha conta
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
              Meu perfil
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Gerencie seus dados pessoais, sua foto, suas
              preferências de aprendizado e a segurança da sua
              conta.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
            <Settings2 size={20} />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-black text-zinc-900">
              Configurações da conta
            </p>

            <p className="truncate text-xs text-zinc-500">
              {profileData.email}
            </p>
          </div>
        </div>
      </header>

      <ProfileSections profile={profileData} />
    </main>
  );
}