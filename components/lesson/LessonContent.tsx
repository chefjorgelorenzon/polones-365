"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  FileText,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";

import CompleteLessonButton from "@/components/lesson/CompleteLessonButton";
import LessonQuiz from "@/components/lesson/LessonQuiz";
import VideoPlayer from "@/components/player/VideoPlayer";

type LessonData = {
  id: string;
  lesson_number: number;
  title: string;
  short_description: string | null;
  content: string | null;
  video_path: string | null;
  exercise_pdf_path: string | null;
  duration_minutes: number | null;
};

type LessonContentProps = {
  lesson: LessonData;
  materialUrl: string | null;
  initialCompleted: boolean;
  previousLessonNumber: number | null;
  nextLessonNumber: number | null;
};

export default function LessonContent({
  lesson,
  materialUrl,
  initialCompleted,
  previousLessonNumber,
  nextLessonNumber,
}: LessonContentProps) {
  const hasQuiz = lesson.lesson_number > 0;

  const [quizCompleted, setQuizCompleted] = useState(
    initialCompleted || !hasQuiz
  );

  const canCompleteLesson =
    initialCompleted || !hasQuiz || quizCompleted;

  return (
    <div className="p-6 lg:p-8">
      {lesson.video_path ? (
        <VideoPlayer src={lesson.video_path} />
      ) : (
        <div className="flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-black text-white">
          <div className="text-center">
            <PlayCircle
              size={64}
              className="mx-auto text-zinc-600"
            />

            <p className="mt-4 text-lg font-black">
              Vídeo indisponível
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              O vídeo desta aula ainda não foi cadastrado.
            </p>
          </div>
        </div>
      )}

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
                Abra o material para praticar o conteúdo.
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

      {hasQuiz && (
        <div className="mt-8">
          <LessonQuiz
            lessonId={lesson.id}
            onCompleted={() => {
              setQuizCompleted(true);
            }}
          />
        </div>
      )}

      <div className="mt-8 grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-3 sm:items-center">
        <div className="flex justify-center sm:justify-start">
          {previousLessonNumber !== null ? (
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

        <div className="flex flex-col items-center justify-center gap-2">
          <CompleteLessonButton
            lessonId={lesson.id}
            initialCompleted={initialCompleted}
            disabled={!canCompleteLesson}
          />

          {!canCompleteLesson && (
            <p className="max-w-[240px] text-center text-xs font-semibold text-zinc-500">
              Finalize o quiz para concluir esta aula.
            </p>
          )}
        </div>

        <div className="flex justify-center sm:justify-end">
          {nextLessonNumber !== null ? (
            initialCompleted ? (
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
          ) : initialCompleted ? (
            <div className="inline-flex items-center justify-center rounded-xl bg-green-100 px-5 py-3 text-sm font-black text-green-800">
              Curso concluído
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}