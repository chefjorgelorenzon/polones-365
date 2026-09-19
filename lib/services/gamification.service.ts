import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  calculateCurrentStreak,
  type ProgressRecord,
} from "@/lib/services/dashboard.service";

const XP_PER_LESSON = 20;
const XP_PER_LEVEL = 500;

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/**
 * Recalcula XP, nível, sequência e aulas concluídas a partir do
 * histórico real de `lesson_progress` e grava o resultado em
 * `gamification`. É idempotente: pode ser chamada várias vezes
 * para o mesmo usuário sem gerar pontuação duplicada, pois sempre
 * recalcula o total a partir da fonte de verdade.
 */
export async function syncGamificationForUser(
  userId: string
): Promise<void> {
  const supabase = createAdminClient();

  const { data: progressData, error: progressError } = await supabase
    .from("lesson_progress")
    .select(
      `
        lesson_id,
        started_at,
        completed_at,
        watch_seconds,
        progress_percentage,
        is_completed,
        last_accessed_at,
        created_at,
        updated_at
      `
    )
    .eq("user_id", userId);

  if (progressError) {
    console.error(
      "Erro ao buscar progresso para gamificação:",
      progressError.message
    );
    return;
  }

  const progressRecords = (progressData as ProgressRecord[] | null) ?? [];

  const lessonsCompleted = progressRecords.filter(
    (record) => record.is_completed
  ).length;

  const xp = lessonsCompleted * XP_PER_LESSON;
  const level = calculateLevel(xp);
  const streakDays = calculateCurrentStreak(progressRecords);

  const { error: upsertError } = await supabase
    .from("gamification")
    .upsert(
      {
        user_id: userId,
        xp,
        level,
        streak_days: streakDays,
        lessons_completed: lessonsCompleted,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (upsertError) {
    console.error(
      "Erro ao atualizar gamificação do usuário:",
      upsertError.message
    );
  }
}
