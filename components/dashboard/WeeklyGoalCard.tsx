import { Check, Target } from "lucide-react";

import type { DashboardWeeklyGoal } from "@/lib/services/dashboard.service";

type WeeklyGoalCardProps = {
  goal: DashboardWeeklyGoal;
};

export default function WeeklyGoalCard({
  goal,
}: WeeklyGoalCardProps) {
  return (
    <article className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
          <Target size={23} />
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-black text-green-700">
          {goal.percentage}% concluída
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-black tracking-tight text-zinc-950">
        Meta da semana
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Complete {goal.target} aulas para manter seu ritmo de estudos.
      </p>

      <div className="mt-6 flex justify-between gap-2">
        {goal.studyDays.map((item) => (
          <div key={item.date} className="text-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black ${
                item.completed
                  ? "bg-red-700 text-white"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {item.completed ? (
                <Check size={18} strokeWidth={3} />
              ) : (
                item.label
              )}
            </div>

            <p className="mt-2 text-xs font-bold text-zinc-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl bg-zinc-100 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-600">
            Aulas concluídas
          </span>

          <span className="font-black text-zinc-950">
            {goal.completed}/{goal.target}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-red-700 transition-all duration-500"
            style={{
              width: `${goal.percentage}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}