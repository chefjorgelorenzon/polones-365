import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "student" | "admin";
  onboarding_completed: boolean;
  study_goal: string | null;
  current_level: string | null;
  daily_goal_minutes: number | null;
  native_language: string | null;
  timezone: string | null;
  journey_started_at: string | null;
  current_lesson_number: number;
  created_at: string;
  updated_at: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      phone,
      avatar_url,
      role,
      onboarding_completed,
      study_goal,
      current_level,
      daily_goal_minutes,
      native_language,
      timezone,
      journey_started_at,
      current_lesson_number,
      created_at,
      updated_at
    `)
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar perfil:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return data as Profile;
}

export type UpdateProfileSettingsInput = {
  study_goal: string | null;
  current_level: string | null;
  daily_goal_minutes: number;
  native_language: string | null;
  timezone: string | null;
};

export async function updateProfileSettings(
  input: UpdateProfileSettingsInput
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const dailyGoalMinutes = Math.max(
    5,
    Math.min(120, input.daily_goal_minutes)
  );

  const { error } = await supabase
    .from("profiles")
    .update({
      study_goal: input.study_goal,
      current_level: input.current_level,
      daily_goal_minutes: dailyGoalMinutes,
      native_language: input.native_language,
      timezone: input.timezone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(
      `Erro ao atualizar as configurações: ${error.message}`
    );
  }
}