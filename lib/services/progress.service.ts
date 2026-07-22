import { createClient } from "@/lib/supabase/client";

export type LessonProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  started_at: string | null;
  completed_at: string | null;
  watch_seconds: number;
  progress_percentage: number;
  is_completed: boolean;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
};

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Erro ao verificar o usuário: ${error.message}`);
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  return user.id;
}

export async function getUserProgress(): Promise<LessonProgress[]> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar progresso: ${error.message}`);
  }

  return data ?? [];
}

export async function getLessonProgress(
  lessonId: string
): Promise<LessonProgress | null> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar progresso da aula: ${error.message}`);
  }

  return data;
}

export async function startLesson(
  lessonId: string
): Promise<LessonProgress> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();
  const now = new Date().toISOString();

  const existingProgress = await getLessonProgress(lessonId);

  if (existingProgress) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .update({
        last_accessed_at: now,
        updated_at: now,
      })
      .eq("id", existingProgress.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar acesso da aula: ${error.message}`);
    }

    return data;
  }

  const { data, error } = await supabase
    .from("lesson_progress")
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      started_at: now,
      last_accessed_at: now,
      watch_seconds: 0,
      progress_percentage: 0,
      is_completed: false,
      completed_at: null,
      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao iniciar aula: ${error.message}`);
  }

  return data;
}

export async function markLessonCompleted(
  lessonId: string
): Promise<LessonProgress> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        started_at: now,
        last_accessed_at: now,
        progress_percentage: 100,
        is_completed: true,
        completed_at: now,
        updated_at: now,
      },
      {
        onConflict: "user_id,lesson_id",
      }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao concluir aula: ${error.message}`);
  }

  return data;
}

export async function getUserProgressMap(): Promise<
  Map<string, LessonProgress>
> {
  const progress = await getUserProgress();

  return new Map(
    progress.map((item) => [item.lesson_id, item])
  );
}