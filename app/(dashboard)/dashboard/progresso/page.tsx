import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  Play,
  Target,
  Trophy,
} from "lucide-react";

import { getDashboard } from "@/lib/services/dashboard.service";

const COURSE_ID =
  "8b5ac23c-cdec-4c3f-954d-30f68c009777";

function formatStudyTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

export default async function ProgressoPage() {
  const dashboard = await getDashboard(COURSE_ID);

  const safeProgressPercentage = Math.max(
    0,
    Math.min(100, dashboard.progressPercentage)
  );

  return (
    <main className="space-y-8 pb-12">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition hover:text-red-700"
        >
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <div className="mt-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Minha evolução
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Meu progresso
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Acompanhe sua evolução no curso e mantenha a
            constância nos estudos.
          </p>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[32px] bg-zinc-950 px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-700/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 text-white">
                <Trophy size={23} />
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-400">
                Jornada completa
              </p>

              <h2 className="mt-2 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
                Cada aula concluída aproxima você da comunicação
                segura em polonês.
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                Você concluiu{" "}
                <strong className="text-white">
                  {dashboard.completedLessons}
                </strong>{" "}
                de{" "}
                <strong className="text-white">
                  {dashboard.totalLessons}
                </strong>{" "}
                aulas.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                {dashboard.progressPercentage}%
              </p>

              <p className="mt-2 text-sm font-semibold text-zinc-400">
                do curso concluído
              </p>
            </div>
          </div>

          <div className="mt-8 h-4 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-700"
              style={{
                width: `${safeProgressPercentage}%`,
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-zinc-400">
            <span>
              {dashboard.completedLessons}{" "}
              {dashboard.completedLessons === 1
                ? "aula concluída"
                : "aulas concluídas"}
            </span>

            <span>
              {dashboard.remainingLessons}{" "}
              {dashboard.remainingLessons === 1
                ? "aula restante"
                : "aulas restantes"}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Aulas concluídas"
          value={String(dashboard.completedLessons)}
          description={`de ${dashboard.totalLessons} aulas`}
        />

        <StatCard
          icon={Clock3}
          label="Tempo estudado"
          value={formatStudyTime(
            dashboard.studyTimeMinutes
          )}
          description="tempo total assistido"
        />

        <StatCard
          icon={Flame}
          label="Sequência atual"
          value={`${dashboard.streak.current}`}
          description={
            dashboard.streak.current === 1
              ? "dia consecutivo"
              : "dias consecutivos"
          }
        />

        <StatCard
          icon={Target}
          label="Meta semanal"
          value={`${dashboard.weeklyGoal.completed}/${dashboard.weeklyGoal.target}`}
          description="aulas nesta semana"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">
                Evolução do curso
              </p>

              <h2 className="mt-2 text-2xl font-black text-zinc-950">
                Sua jornada no Polonês 3.0
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Continue avançando uma aula por dia para manter
                seu ritmo de aprendizagem.
              </p>
            </div>

            <div className="rounded-2xl bg-red-50 px-4 py-3 text-center">
              <p className="text-2xl font-black text-red-700">
                {dashboard.completedLessons}
              </p>

              <p className="text-xs font-bold text-red-700/70">
                concluídas
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4 text-sm font-bold">
              <span className="text-zinc-700">
                Progresso geral
              </span>

              <span className="text-zinc-950">
                {dashboard.completedLessons}/
                {dashboard.totalLessons}
              </span>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-red-700 transition-all duration-700"
                style={{
                  width: `${safeProgressPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-500">
                Já concluído
              </p>

              <p className="mt-2 text-3xl font-black text-zinc-950">
                {dashboard.completedLessons}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                aulas finalizadas
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-sm font-semibold text-zinc-500">
                Próximo objetivo
              </p>

              <p className="mt-2 text-3xl font-black text-zinc-950">
                {Math.min(
                  dashboard.totalLessons,
                  dashboard.completedLessons + 10
                )}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                aulas concluídas
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">
                Meta semanal
              </p>

              <h2 className="mt-2 text-2xl font-black text-zinc-950">
                Mantenha a constância
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <Target size={22} />
            </div>
          </div>

          <div className="mt-8 flex items-end gap-2">
            <span className="text-5xl font-black tracking-tight text-zinc-950">
              {dashboard.weeklyGoal.completed}
            </span>

            <span className="pb-1 text-lg font-bold text-zinc-500">
              de {dashboard.weeklyGoal.target} aulas
            </span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-red-700 transition-all duration-700"
              style={{
                width: `${dashboard.weeklyGoal.percentage}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm font-semibold">
            <span className="text-zinc-500">
              Progresso desta semana
            </span>

            <span className="text-zinc-950">
              {dashboard.weeklyGoal.percentage}%
            </span>
          </div>

          <div className="mt-8 grid grid-cols-7 gap-2">
            {dashboard.weeklyGoal.studyDays.map(
              (day) => (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-xs font-bold text-zinc-500">
                    {day.label}
                  </span>

                  <div
                    title={day.date}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      day.completed
                        ? "border-red-700 bg-red-700 text-white"
                        : "border-zinc-200 bg-zinc-50 text-zinc-300"
                    }`}
                  >
                    {day.completed ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">
              Histórico recente
            </p>

            <h2 className="mt-2 text-2xl font-black text-zinc-950">
              Últimas aulas concluídas
            </h2>
          </div>

          {dashboard.recentLessons.length > 0 ? (
            <div className="mt-6 space-y-3">
              {dashboard.recentLessons.map(
                (lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/dashboard/aulas/${lesson.number}`}
                    className="group flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 transition hover:border-red-200 hover:bg-red-50/50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={21} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-zinc-400">
                        Aula {lesson.number} ·{" "}
                        {lesson.moduleTitle}
                      </p>

                      <h3 className="mt-1 truncate font-black text-zinc-950">
                        {lesson.title}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {lesson.durationMinutes} minutos
                      </p>
                    </div>

                    <ArrowRight
                      size={19}
                      className="shrink-0 text-zinc-300 transition group-hover:translate-x-1 group-hover:text-red-700"
                    />
                  </Link>
                )
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl bg-zinc-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-400 shadow-sm">
                <BookOpen size={22} />
              </div>

              <h3 className="mt-4 font-black text-zinc-950">
                Nenhuma aula concluída
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Conclua sua primeira aula para começar a
                registrar sua evolução.
              </p>
            </div>
          )}
        </article>

        <article className="relative overflow-hidden rounded-[28px] bg-red-700 p-6 text-white shadow-sm sm:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex h-full flex-col">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Play size={22} fill="currentColor" />
            </div>

            {dashboard.nextLesson ? (
              <>
                <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-red-100">
                  Próxima aula
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Aula {dashboard.nextLesson.number}
                </h2>

                <h3 className="mt-2 text-xl font-bold text-red-50">
                  {dashboard.nextLesson.title}
                </h3>

                <p className="mt-2 text-sm font-semibold text-red-100">
                  {dashboard.nextLesson.moduleTitle} ·{" "}
                  {dashboard.nextLesson.durationMinutes} minutos
                </p>

                {dashboard.nextLesson.description && (
                  <p className="mt-5 line-clamp-3 text-sm leading-7 text-red-50/90">
                    {dashboard.nextLesson.description}
                  </p>
                )}

               <Link
  href={`/dashboard/aulas/${dashboard.nextLesson.number}`}
  className="mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black !text-red-700 transition hover:bg-red-50 hover:!text-red-800 sm:mt-auto"
>
  <span className="!text-red-700">
    Continuar estudando
  </span>

  <ArrowRight
    size={18}
    className="!text-red-700"
  />
</Link>
              </>
            ) : (
              <>
                <p className="mt-7 text-sm font-black uppercase tracking-[0.18em] text-red-100">
                  Curso concluído
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Parabéns pela conquista!
                </h2>

                <p className="mt-4 text-sm leading-7 text-red-50/90">
                  Você concluiu todas as aulas disponíveis no
                  curso.
                </p>

                <Link
                  href="/dashboard/aulas"
                  className="mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-red-700 transition hover:bg-red-50 sm:mt-auto"
                >
                  Rever minhas aulas
                  <ArrowRight size={18} />
                </Link>
              </>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
};

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
        <Icon size={21} />
      </div>

      <p className="mt-5 text-sm font-bold text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black tracking-tight text-zinc-950">
        {value}
      </p>

      <p className="mt-1 text-sm text-zinc-500">
        {description}
      </p>
    </article>
  );
}