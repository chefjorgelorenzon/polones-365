import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  FileText,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";

import CompleteLessonButton from "@/components/lesson/CompleteLessonButton";

import {
  getLessonAccess,
  getLessonByNumber,
  getLessonCompletionStatus,
} from "@/lib/services/lesson.service";

import {
  getLessonMaterialUrl,
  getLessonVideoUrl,
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
    parsedLessonNumber < 1 ||
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
  };

  const [
    videoUrl,
    materialUrl,
    isCompleted,
  ] = await Promise.all([
    getLessonVideoUrl(lesson.video_path),

    getLessonMaterialUrl(
      lesson.exercise_pdf_path
    ),

    getLessonCompletionStatus(lesson.id),
  ]);

  const previousLessonNumber =
    parsedLessonNumber > 1
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
            Aula {lesson.lesson_number}
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

        <div className="p-6 lg:p-8">
          <div className="overflow-hidden rounded-3xl bg-black">
            {videoUrl ? (
              <video
                controls
                preload="metadata"
                className="aspect-video w-full bg-black"
              >
                <source
                  src={videoUrl}
                  type="video/mp4"
                />

                Seu navegador não suporta a reprodução
                deste vídeo.
              </video>
            ) : (
              <div className="flex aspect-video items-center justify-center text-white">
                <div className="text-center">
                  <PlayCircle
                    size={64}
                    className="mx-auto text-zinc-600"
                  />

                  <p className="mt-4 text-lg font-black">
                    Vídeo indisponível
                  </p>

                  <p className="mt-2 text-sm text-zinc-400">
                    Não foi possível carregar o vídeo
                    desta aula.
                  </p>
                </div>
              </div>
            )}
          </div>

          {lesson.content && (
            <div className="mt-8">
              <h2 className="text-xl font-black text-zinc-950">
                Conteúdo da aula
              </h2>

              <div className="mt-4 whitespace-pre-line leading-7 text-zinc-600">
                {lesson.content}
              </div>
            </div>
          )}

          {lesson.exercise_pdf_path && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-zinc-950">
                    Exercícios da aula
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Abra o material para praticar o
                    conteúdo.
                  </p>
                </div>

                {materialUrl ? (
                  <a
                    href={materialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-800 hover:shadow-md"
                  >
                    <FileText size={18} />

                    Abrir PDF
                  </a>
                ) : (
                  <span className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-zinc-300 px-5 py-3 text-sm font-black text-zinc-500">
                    <FileText size={18} />

                    PDF indisponível
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-3 sm:items-center">
            <div className="flex justify-center sm:justify-start">
              {previousLessonNumber ? (
                <Link
                  href={`/dashboard/aulas/${previousLessonNumber}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-black text-zinc-700 transition hover:border-red-300 hover:text-red-700"
                >
                  <ArrowLeft size={18} />

                  Aula anterior
                </Link>
              ) : (
                <div />
              )}
            </div>

            <div className="flex justify-center">
              <CompleteLessonButton
                lessonId={lesson.id}
                initialCompleted={isCompleted}
              />
            </div>

            <div className="flex justify-center sm:justify-end">
              {nextLessonNumber ? (
                isCompleted ? (
                  <Link
                    href={`/dashboard/aulas/${nextLessonNumber}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800"
                  >
                    Próxima aula

                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <div className="flex max-w-[260px] items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-center text-sm font-bold text-zinc-500">
                    <LockKeyhole
                      size={18}
                      className="shrink-0"
                    />

                    Conclua esta aula para liberar a próxima
                  </div>
                )
              ) : isCompleted ? (
                <div className="inline-flex items-center justify-center rounded-xl bg-green-100 px-5 py-3 text-sm font-black text-green-800">
                  Curso concluído
                </div>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}