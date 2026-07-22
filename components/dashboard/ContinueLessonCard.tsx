import Link from "next/link";
import { ArrowRight, CalendarCheck2, Clock3, Play } from "lucide-react";

import type { DashboardData } from "@/lib/services/dashboard.service";

type Props = {
  dashboard: DashboardData;
};

export default function ContinueLessonCard({
  dashboard,
}: Props) {
  if (!dashboard.nextLesson) {
    return (
      <article className="rounded-[32px] bg-zinc-950 p-8 text-white">
        <h2 className="text-3xl font-black">
          🎉 Parabéns!
        </h2>

        <p className="mt-4 text-zinc-300">
          Você concluiu todas as aulas do curso.
        </p>
      </article>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-[32px] bg-zinc-950 p-6 text-white shadow-xl sm:p-8">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-700/25 blur-3xl" />

      <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-red-700/20 blur-3xl" />

      <div className="relative">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-zinc-200">
              <CalendarCheck2 size={15} />
              Continue estudando
            </div>

            <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-red-400">
              Aula {dashboard.nextLesson.number} de{" "}
              {dashboard.totalLessons}
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              {dashboard.nextLesson.title}
            </h2>

            {dashboard.nextLesson.description && (
              <p className="mt-4 max-w-xl leading-7 text-zinc-400">
                {dashboard.nextLesson.description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Clock3
              size={18}
              className="text-red-400"
            />

            <span className="text-sm font-bold">
              {dashboard.nextLesson.durationMinutes} min
            </span>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-400">
              Progresso do curso
            </span>

            <span className="font-black text-white">
              {dashboard.completedLessons} de{" "}
              {dashboard.totalLessons}
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500"
              style={{
                width: `${dashboard.progressPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/dashboard/aulas/${dashboard.nextLesson.number}`}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-7 font-black text-white transition hover:bg-red-600"
          >
            <Play
              size={20}
              fill="currentColor"
            />

            Continuar aula
          </Link>

          <Link
            href="/dashboard/aulas"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 font-bold text-white transition hover:bg-white/10"
          >
            Ver biblioteca

            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}