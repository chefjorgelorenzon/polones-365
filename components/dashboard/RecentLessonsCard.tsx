import Link from "next/link";
import { Check, ChevronRight, Play } from "lucide-react";

import type { DashboardRecentLesson } from "@/lib/services/dashboard.service";

type Props = {
  lessons: DashboardRecentLesson[];
};

export default function RecentLessonsCard({
  lessons,
}: Props) {
  return (
    <article className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">
            Aulas recentes
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Revise os últimos conteúdos estudados.
          </p>
        </div>

        <Link
          href="/dashboard/aulas"
          className="hidden items-center gap-1 text-sm font-black text-red-700 sm:flex"
        >
          Ver biblioteca

          <ChevronRight size={17} />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {lessons.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center">
            <p className="font-semibold text-zinc-500">
              Você ainda não concluiu nenhuma aula.
            </p>
          </div>
        )}

        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/dashboard/aulas/${lesson.number}`}
            className="group flex items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 transition hover:border-red-200 hover:bg-red-50/50"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <Play
                size={19}
                fill="currentColor"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-700">
                Aula {lesson.number} · {lesson.moduleTitle}
              </p>

              <h3 className="mt-1 truncate font-black text-zinc-950">
                {lesson.title}
              </h3>

              <p className="mt-1 text-xs font-semibold text-zinc-400">
                {lesson.durationMinutes} min
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
              <Check
                size={17}
                strokeWidth={3}
              />
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}