import { createClient } from "@/lib/supabase/server";
import type { Module, Lesson } from "@/types/course";

export async function getCourseModules(courseId: string): Promise<Module[]> {
  const supabase = await createClient();

  // Busca módulos
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (modulesError) {
    console.error(modulesError);
    return [];
  }

  if (!modules) return [];

  // Busca aulas
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("lesson_number", { ascending: true });

  if (lessonsError) {
    console.error(lessonsError);
    return [];
  }

  return modules.map((module) => ({
    ...module,
    lessons:
  lessons
    ?.filter((lesson) => lesson.module_id === module.id)
    .sort((a, b) => a.lesson_number - b.lesson_number)
    .map((lesson) => ({
      ...lesson,
      status: "available" as const,
    })) ?? [],
  }));
}

export async function getLessonByNumber(
  courseId: string,
  lessonNumber: number
): Promise<Lesson | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", courseId)
    .eq("lesson_number", lessonNumber)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar aula:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    status: "available",
  };
}

export type LessonAccess = {
  isAllowed: boolean;
  unlockedLessonNumber: number;
};

export async function getLessonAccess(
  courseId: string,
  requestedLessonNumber: number
): Promise<LessonAccess> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      isAllowed: false,
      unlockedLessonNumber: 1,
    };
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, lesson_number")
    .eq("course_id", courseId)
    .eq("is_published", true)
    .order("lesson_number", { ascending: true });

  if (lessonsError) {
    console.error(
      "Erro ao buscar aulas para verificar acesso:",
      lessonsError
    );

    return {
      isAllowed: false,
      unlockedLessonNumber: 1,
    };
  }

  if (!lessons || lessons.length === 0) {
    return {
      isAllowed: false,
      unlockedLessonNumber: 1,
    };
  }

  const lessonIds = lessons.map((lesson) => lesson.id);

  const { data: completedProgress, error: progressError } =
    await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("is_completed", true)
      .in("lesson_id", lessonIds);

  if (progressError) {
    console.error(
      "Erro ao verificar progresso das aulas:",
      progressError
    );

    return {
      isAllowed: false,
      unlockedLessonNumber: lessons[0].lesson_number,
    };
  }

  const completedLessonIds = new Set(
    completedProgress?.map((progress) => progress.lesson_id) ?? []
  );

  let unlockedLessonNumber = lessons[0].lesson_number;

  for (const lesson of lessons) {
    if (!completedLessonIds.has(lesson.id)) {
      unlockedLessonNumber = lesson.lesson_number;
      break;
    }

    unlockedLessonNumber = lesson.lesson_number;

    const nextLesson = lessons.find(
      (item) => item.lesson_number > lesson.lesson_number
    );

    if (nextLesson) {
      unlockedLessonNumber = nextLesson.lesson_number;
    }
  }

  return {
    isAllowed:
      requestedLessonNumber <= unlockedLessonNumber,
    unlockedLessonNumber,
  };
}

export async function getLessonCompletionStatus(
  lessonId: string
): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return false;
  }

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("is_completed")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    console.error(
      "Erro ao verificar conclusão da aula:",
      error.message
    );

    return false;
  }

  return data?.is_completed ?? false;
}