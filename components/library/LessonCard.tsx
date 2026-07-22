"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Play,
  Sparkles,
} from "lucide-react";

import type { StudentLesson } from "@/types/student-course";

type LessonCardProps = {
  lesson: StudentLesson;
};

export default function LessonCard({
  lesson,
}: LessonCardProps) {
  const isCompleted = lesson.completed;
  const isLocked = !lesson.unlocked;
  const isRecommended = lesson.recommended;

  const progressPercentage = Math.min(
    100,
    Math.max(0, lesson.progressPercentage ?? 0)
  );

  const durationMinutes = Math.max(
    0,
    lesson.duration_minutes ?? 0
  );

  const href = `/dashboard/aulas/${lesson.lesson_number}`;

  const cardClass = isLocked
    ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-70"
    : isCompleted
      ? "border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-50/80"
      : isRecommended
        ? "border-red-300 bg-red-50 shadow-sm hover:border-red-400 hover:bg-red-50/80"
        : "border-zinc-200 bg-white hover:border-red-200 hover:bg-red-50/40";

  const iconClass = isLocked
    ? "bg-zinc-200 text-zinc-500"
    : isCompleted
      ? "bg-green-100 text-green-700"
      : isRecommended
        ? "bg-red-700 text-white"
        : "bg-red-100 text-red-700";

  const Icon = isLocked
    ? LockKeyhole
    : isCompleted
      ? CheckCircle2
      : Play;

  const actionText = isLocked
    ? "Bloqueada"
    : isCompleted
      ? "Revisar"
      : isRecommended
        ? "Continuar"
        : "Assistir";

  const actionClass = isLocked
    ? "text-zinc-400"
    : isCompleted
      ? "text-green-700"
      : "text-red-700";

  const content = (
    <>
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${iconClass}`}
      >
        <Icon size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-xs font-black uppercase tracking-[0.16em] ${
              isCompleted
                ? "text-green-700"
                : isLocked
                  ? "text-zinc-500"
                  : "text-red-700"
            }`}
          >
            Aula {lesson.lesson_number}
          </p>

          {isRecommended &&
            !isCompleted &&
            !isLocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-700 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                <Sparkles size={11} />
                Recomendada
              </span>
            )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-700">
              <CheckCircle2 size={11} />
              Concluída
            </span>
          )}

          {isLocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
              <LockKeyhole size={11} />
              Bloqueada
            </span>
          )}
        </div>

        <h3 className="mt-1 font-black text-zinc-950">
          {lesson.title}
        </h3>

        {lesson.short_description && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500">
            {lesson.short_description}
          </p>
        )}

        {!isCompleted &&
          !isLocked &&
          progressPercentage > 0 && (
            <div className="mt-3 max-w-sm">
              <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-bold text-zinc-500">
                <span>Progresso da aula</span>
                <span>{progressPercentage}%</span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-red-700 transition-all duration-500"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          )}
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
        <p className="flex items-center justify-end gap-1 text-xs text-zinc-500">
          <Clock3 size={14} />
          {durationMinutes} min
        </p>

        <p
          className={`mt-3 text-xs font-black ${actionClass}`}
        >
          {actionText}
        </p>
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div
        aria-disabled="true"
        className={`flex items-start gap-3 rounded-2xl border p-4 sm:items-center sm:gap-4 ${cardClass}`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${actionText}: aula ${lesson.lesson_number}, ${lesson.title}`}
      className={`flex items-start gap-3 rounded-2xl border p-4 transition sm:items-center sm:gap-4 ${cardClass}`}
    >
      {content}
    </Link>
  );
}