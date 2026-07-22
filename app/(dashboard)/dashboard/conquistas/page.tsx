import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Clock3,
  Flame,
  GraduationCap,
  Lock,
  Medal,
  Star,
  Target,
  Trophy,
} from "lucide-react";

import {
  AchievementIconName,
  getAchievements,
} from "@/lib/services/achievements.service";

const COURSE_ID =
  "8b5ac23c-cdec-4c3f-954d-30f68c009777";

const icons: Record<AchievementIconName, any> = {
  award: Award,
  book: BookOpen,
  clock: Clock3,
  flame: Flame,
  graduation: GraduationCap,
  medal: Medal,
  star: Star,
  target: Target,
  trophy: Trophy,
};

export default async function ConquistasPage() {
  const data = await getAchievements(COURSE_ID);

  return (
    <main className="space-y-8 pb-10">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-red-700"
        >
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <h1 className="mt-6 text-4xl font-black text-zinc-950">
          Conquistas
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-600">
          Continue estudando para desbloquear medalhas,
          acompanhar sua evolução e manter a motivação.
        </p>
      </header>

      <section className="rounded-3xl bg-zinc-950 p-8 text-white">
        <p className="text-sm font-black uppercase tracking-widest text-red-400">
          PROGRESSO
        </p>

        <h2 className="mt-3 text-4xl font-black">
          {data.unlocked} de {data.total}
        </h2>

        <p className="mt-2 text-zinc-300">
          conquistas desbloqueadas
        </p>

        <div className="mt-8 h-4 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-red-600 transition-all"
            style={{
              width: `${data.progressPercentage}%`,
            }}
          />
        </div>

        <p className="mt-3 text-sm text-zinc-400">
          {data.progressPercentage}% concluído
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.achievements.map((achievement) => {
          const Icon = icons[achievement.icon];

          return (
            <article
              key={achievement.id}
              className={`rounded-3xl border p-6 transition ${
                achievement.unlocked
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    achievement.unlocked
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  <Icon size={26} />
                </div>

                {achievement.unlocked ? (
                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                    Desbloqueada
                  </span>
                ) : (
                  <Lock
                    size={18}
                    className="text-zinc-400"
                  />
                )}
              </div>

              <h3 className="mt-6 text-xl font-black text-zinc-950">
                {achievement.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {achievement.description}
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Progresso</span>

                  <span>
                    {achievement.currentValue}/
                    {achievement.requirement}
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      achievement.unlocked
                        ? "bg-emerald-600"
                        : "bg-red-600"
                    }`}
                    style={{
                      width: `${achievement.progressPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}