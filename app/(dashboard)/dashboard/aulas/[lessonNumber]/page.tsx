import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  ArrowLeft,
  Clock3,
  FileText,
} from "lucide-react";

import LessonContent from "@/components/lesson/LessonContent";

import {
  getLessonAccess,
  getLessonByNumber,
  getLessonCompletionStatus,
} from "@/lib/services/lesson.service";

import {
  getLessonMaterialUrl,
} from "@/lib/services/storage.service";

const COURSE_ID =
  "8b5ac23c-cdec-4c3f-954d-30f68c009777";

type LessonPageProps = {
  params: Promise<{
    lessonNumber: string;
  }>;
};

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const { lessonNumber } = await params;

  const parsedLessonNumber = Number(lessonNumber);

  if (
    Number.isNaN(parsedLessonNumber) ||
    parsedLessonNumber < 0 ||
    parsedLessonNumber > 365
  ) {
    notFound();
  }

  const lessonAccess = await getLessonAccess(
    COURSE_ID,
    parsedLessonNumber
  );

  if (!lessonAccess.isAllowed) {
    redirect(
      `/dashboard/aulas/${lessonAccess.unlockedLessonNumber}`
    );
  }

  const lesson = await getLessonByNumber(
    COURSE_ID,
    parsedLessonNumber
  );

  if (!lesson) {
    notFound();
  }

  const [
    materialUrl,
    isCompleted,
  ] = await Promise.all([
    getLessonMaterialUrl(
      lesson.exercise_pdf_path
    ),
    getLessonCompletionStatus(
      lesson.id
    ),
  ]);

  const previousLessonNumber =
    parsedLessonNumber > 0
      ? parsedLessonNumber - 1
      : null;

  const nextLessonNumber =
    parsedLessonNumber < 365
      ? parsedLessonNumber + 1
      : null;

  return (
    <main className="pb-12">
      <div className="mb-6">
        <Link
          href="/dashboard/aulas"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 transition hover:text-red-700"
        >
          <ArrowLeft size={18} />

          Voltar para a biblioteca
        </Link>
      </div>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-6 lg:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">
            {lesson.lesson_number === 0
              ? "Introdução"
              : `Aula ${lesson.lesson_number}`}
          </p>

          <h1 className="mt-3 text-3xl font-black text-zinc-950 lg:text-4xl">
            {lesson.title}
          </h1>

          {lesson.short_description && (
            <p className="mt-4 max-w-3xl text-zinc-600">
              {lesson.short_description}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <Clock3 size={16} />
              {lesson.duration_minutes ?? 0} minutos
            </span>

            {lesson.exercise_pdf_path && (
              <span className="inline-flex items-center gap-2">
                <FileText size={16} />
                Material de exercícios
              </span>
            )}
          </div>
        </div>

        <LessonContent
          lesson={lesson}
          materialUrl={materialUrl}
          initialCompleted={isCompleted}
          previousLessonNumber={previousLessonNumber}
          nextLessonNumber={nextLessonNumber}
        />
      </section>
    </main>
  );
}