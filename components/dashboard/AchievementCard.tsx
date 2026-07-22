import { Trophy } from "lucide-react";

import type { DashboardData } from "@/lib/services/dashboard.service";

type AchievementCardProps = {
  dashboard: DashboardData;
};

type Achievement = {
  title: string;
  target: number;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Primeiros Passos",
    target: 5,
  },
  {
    title: "Explorador do Polonês",
    target: 30,
  },
  {
    title: "Estudante Dedicado",
    target: 60,
  },
  {
    title: "Ritmo Consistente",
    target: 100,
  },
  {
    title: "Falante em Formação",
    target: 180,
  },
  {
    title: "Mestre da Jornada",
    target: 365,
  },
];

function getNextAchievement(
  completedLessons: number
): Achievement {
  return (
    ACHIEVEMENTS.find(
      (achievement) =>
        completedLessons < achievement.target
    ) ?? ACHIEVEMENTS[ACHIEVEMENTS.length - 1]
  );
}

export default function AchievementCard({
  dashboard,
}: AchievementCardProps) {
  const achievement = getNextAchievement(
    dashboard.completedLessons
  );

  const completed = Math.min(
    dashboard.completedLessons,
    achievement.target
  );

  const remaining = Math.max(
    achievement.target - dashboard.completedLessons,
    0
  );

  const percentage = Math.min(
    100,
    Math.round(
      (completed / achievement.target) * 100
    )
  );

  const isCourseCompleted =
    dashboard.completedLessons >=
    ACHIEVEMENTS[ACHIEVEMENTS.length - 1].target;

  return (
    <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Trophy size={21} />
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700">
          {isCourseCompleted
            ? "Conquista desbloqueada"
            : remaining === 1
              ? "Falta 1 aula"
              : `Faltam ${remaining} aulas`}
        </span>
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-amber-700">
        {isCourseCompleted
          ? "Conquista alcançada"
          : "Próxima conquista"}
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
        {achievement.title}
      </h3>

      <p className="mt-3 leading-6 text-zinc-500">
        {isCourseCompleted
          ? "Você concluiu todas as aulas da jornada."
          : `Complete ${achievement.target} aulas para desbloquear esta conquista.`}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-zinc-500">
            {completed} de {achievement.target}
          </span>

          <span className="font-black text-zinc-900">
            {percentage}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}