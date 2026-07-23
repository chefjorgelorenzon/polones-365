"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  success: boolean;
  message: string;
};

const initialErrorState: ProfileActionState = {
  success: false,
  message: "Não foi possível atualizar o perfil.",
};

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "Sua sessão expirou. Entre novamente.",
      };
    }

    const fullName = String(formData.get("full_name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const studyGoal = String(formData.get("study_goal") ?? "").trim();
    const currentLevel = String(formData.get("current_level") ?? "").trim();
    const dailyGoalValue = String(
      formData.get("daily_goal_minutes") ?? "",
    ).trim();

    const dailyGoalMinutes = Number(dailyGoalValue);

    if (fullName.length < 3) {
      return {
        success: false,
        message: "Informe um nome completo válido.",
      };
    }

    if (
      dailyGoalValue &&
      (!Number.isInteger(dailyGoalMinutes) ||
        dailyGoalMinutes < 5 ||
        dailyGoalMinutes > 180)
    ) {
      return {
        success: false,
        message: "A meta diária deve estar entre 5 e 180 minutos.",
      };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        study_goal: studyGoal || null,
        current_level: currentLevel || null,
        daily_goal_minutes: dailyGoalValue ? dailyGoalMinutes : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
  console.error(error);

  return {
    success: false,
    message: error.message,
  };
}

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/perfil");

    return {
      success: true,
      message: "Perfil atualizado com sucesso.",
    };
  } catch (error) {
    console.error("Erro inesperado ao atualizar perfil:", error);

    return initialErrorState;
  }
}