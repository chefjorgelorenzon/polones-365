import "server-only";

import { getCourseModules } from "@/lib/services/lesson.service";
import { createClient } from "@/lib/supabase/server";

import type {
  StudentCourse,
  StudentLesson,
  StudentModule,
} from "@/types/student-course";

type ProgressRow = {
  lesson_id: string;
  progress_percentage: number | null;
  is_completed: boolean;
};

function normalizePercentage(value: number | null | undefined) {
  const percentage = value ?? 0;

  return Math.min(100, Math.max(0, Math.round(percentage)));
}

export async function getStudentCourse(
  courseId: string
): Promise<StudentCourse> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `Erro ao verificar o usuário: ${userError.message}`
    );
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const modules = await getCourseModules(courseId);

  const lessonIds = modules.flatMap((module) =>
    module.lessons.map((lesson) => lesson.id)
  );

  let progressRows: ProgressRow[] = [];

  if (lessonIds.length > 0) {
    const { data, error } = await supabase
      .from("lesson_progress")
      .select(
        "lesson_id, progress_percentage, is_completed"
      )
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);

    if (error) {
      throw new Error(
        `Erro ao buscar o progresso do curso: ${error.message}`
      );
    }

    progressRows = data ?? [];
  }

  const progressMap = new Map(
    progressRows.map((progress) => [
      progress.lesson_id,
      progress,
    ])
  );

  let totalLessons = 0;
  let completedLessons = 0;

  let nextLessonId: string | null = null;
  let nextLessonNumber: number | null = null;

  const studentModules: StudentModule[] = modules.map(
    (module) => {
      let moduleCompletedLessons = 0;

      const lessons: StudentLesson[] = module.lessons.map(
        (lesson) => {
          totalLessons += 1;

          const progress = progressMap.get(lesson.id);

          const completed =
            progress?.is_completed ?? false;

          const progressPercentage = completed
            ? 100
            : normalizePercentage(
                progress?.progress_percentage
              );

          if (completed) {
            completedLessons += 1;
            moduleCompletedLessons += 1;
          }

          const isNextLesson =
            !completed && nextLessonId === null;

          if (isNextLesson) {
            nextLessonId = lesson.id;
            nextLessonNumber = lesson.lesson_number;
          }

          return {
            ...lesson,
            completed,
            progressPercentage,

            // No MVP, todas as aulas continuam liberadas.
            unlocked: true,

            // A primeira aula não concluída é recomendada.
            recommended: isNextLesson,
          };
        }
      );

      const moduleProgressPercentage =
        lessons.length > 0
          ? Math.round(
              (moduleCompletedLessons / lessons.length) *
                100
            )
          : 0;

      return {
        ...module,
        lessons,
        totalLessons: lessons.length,
        completedLessons: moduleCompletedLessons,
        progressPercentage: moduleProgressPercentage,
      };
    }
  );

  const courseProgressPercentage =
    totalLessons > 0
      ? Math.round(
          (completedLessons / totalLessons) * 100
        )
      : 0;

  return {
    modules: studentModules,

    totalLessons,
    completedLessons,
    progressPercentage: courseProgressPercentage,

    nextLessonId,
    nextLessonNumber,
  };
}