"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  LockKeyhole,
} from "lucide-react";

import type { StudentModule } from "@/types/student-course";
import LessonCard from "./LessonCard";

type Props = {
  module: StudentModule;
};

export default function ModuleCard({ module }: Props) {
  const [open, setOpen] = useState(true);

  const isCompleted =
    module.totalLessons > 0 &&
    module.completedLessons === module.totalLessons;

  const isLocked = module.lessons.every(
    (lesson) => !lesson.unlocked
  );

  const progress = Math.min(
    100,
    Math.max(0, module.progressPercentage)
  );

  return (
    <section
      className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
        isCompleted
          ? "border-green-200"
          : isLocked
          ? "border-zinc-200 opacity-80"
          : "border-zinc-200"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="w-full p-5 text-left transition hover:bg-zinc-50 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-black ${
                isCompleted
                  ? "bg-green-100 text-green-700"
                  : isLocked
                  ? "bg-zinc-200 text-zinc-500"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={24} />
              ) : isLocked ? (
                <LockKeyhole size={22} />
              ) : (
                String(module.position).padStart(2, "0")
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-black text-zinc-950 sm:text-xl">
                  {module.title}
                </h2>

                {isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-700">
                    <CheckCircle2 size={11} />
                    Concluído
                  </span>
                )}

                {isLocked && !isCompleted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">
                    <LockKeyhole size={11} />
                    Bloqueado
                  </span>
                )}
              </div>

              {module.description && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {module.description}
                </p>
              )}

              <div className="mt-4 max-w-xl">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-xs font-bold text-zinc-600">
                    {module.completedLessons} de{" "}
                    {module.totalLessons} aulas concluídas
                  </p>

                  <p
                    className={`text-xs font-black ${
                      isCompleted
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {progress}%
                  </p>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-green-700"
                        : "bg-red-700"
                    }`}
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <ChevronDown
            size={22}
            className={`mt-1 shrink-0 text-zinc-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-zinc-100 p-4 sm:p-5">
          {module.lessons.length > 0 ? (
            module.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 px-5 py-8 text-center">
              <p className="text-sm font-bold text-zinc-600">
                Nenhuma aula cadastrada neste módulo.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}