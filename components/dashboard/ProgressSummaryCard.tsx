import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";

import type { DashboardData } from "@/lib/services/dashboard.service";

type ProgressSummaryCardProps = {
  dashboard: DashboardData;
};

export default function ProgressSummaryCard({
  dashboard,
}: ProgressSummaryCardProps) {
  const progress = Math.min(
    100,
    Math.max(0, dashboard.progressPercentage)
  );

  const hours = Math.floor(
  dashboard.studyTimeMinutes / 60
);

const minutes =
  dashboard.studyTimeMinutes % 60;

const formattedStudyTime =
  hours > 0
    ? `${hours}h ${minutes}min`
    : `${minutes}min`;

  return (
    <article className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">
            Seu progresso
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Resumo da sua jornada.
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
          <Award size={23} />
        </div>
      </div>

      <div className="mt-7 flex flex-col items-center gap-6 sm:flex-row">
        <div
          className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(#D71920 0% ${progress}%, #F4F4F5 ${progress}% 100%)`,
          }}
        >
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
            <p className="text-3xl font-black text-zinc-950">
              {progress}%
            </p>

            <p className="text-xs font-bold text-zinc-400">
              concluído
            </p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <ProgressItem
            value={String(dashboard.completedLessons)}
            label="Aulas concluídas"
          />

          <ProgressItem
            value={String(dashboard.remainingLessons)}
            label="Aulas restantes"
          />

          <ProgressItem
  value={formattedStudyTime}
  label="Tempo estudado"
/>
        </div>
      </div>

  <Link
  href="/dashboard/progresso"
  className="mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 !text-white text-lg font-black shadow-lg hover:bg-red-800"
>
  <span className="!text-white">
    Ver progresso completo
  </span>

  <ArrowRight
    size={20}
    className="!text-white"
  />
</Link>
    </article>
  );
}

type ProgressItemProps = {
  value: string;
  label: string;
};

function ProgressItem({
  value,
  label,
}: ProgressItemProps) {

    
  return (
    <div>
      <p className="font-black text-zinc-950">{value}</p>

      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}