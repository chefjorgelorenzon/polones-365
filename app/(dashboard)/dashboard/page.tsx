import {
  Flame,
} from "lucide-react";

import PolandTipCard from "@/components/dashboard/PolandTipCard";
import WordOfDayCard from "@/components/dashboard/WordOfDayCard";
import AchievementCard from "@/components/dashboard/AchievementCard";
import ContinueLessonCard from "@/components/dashboard/ContinueLessonCard";
import ProgressSummaryCard from "@/components/dashboard/ProgressSummaryCard";
import RecentLessonsCard from "@/components/dashboard/RecentLessonsCard";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";
import { getDashboard } from "@/lib/services/dashboard.service";
import PremiumBanner from "@/components/dashboard/PremiumBanner";
import PremiumLock from "@/components/dashboard/PremiumLock";

const COURSE_ID =
  "8b5ac23c-cdec-4c3f-954d-30f68c009777";

function getFormattedCurrentDate(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
}

export default async function DashboardPage() {
  const dashboard = await getDashboard(COURSE_ID);

  const currentDate = getFormattedCurrentDate();

  return (
    <div>
      <section className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-bold capitalize text-red-700">
            {currentDate}
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-zinc-950 sm:text-4xl">
            {dashboard.greeting}, {dashboard.studentName}! 👋
          </h1>

          <p className="mt-3 text-zinc-600">
            Continue sua jornada. Hoje você está mais perto de
            falar polonês.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Flame size={23} fill="currentColor" />
          </div>

          <div>
            <p className="text-2xl font-black leading-none text-zinc-950">
              {dashboard.streak.current}{" "}
              {dashboard.streak.current === 1
                ? "dia"
                : "dias"}
            </p>

            <p className="mt-1 text-sm font-semibold text-zinc-500">
              de sequência
            </p>
          </div>
        </div>
      </section>

      {!dashboard.hasActiveSubscription && (
  <div className="mt-8">
    <PremiumBanner />
  </div>
)}

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <PremiumLock locked={!dashboard.hasActiveSubscription}>
  <ContinueLessonCard dashboard={dashboard} />
</PremiumLock>

        <WeeklyGoalCard goal={dashboard.weeklyGoal} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <WordOfDayCard />

        <PremiumLock locked={!dashboard.hasActiveSubscription}>
  <AchievementCard dashboard={dashboard} />
</PremiumLock>

        <PolandTipCard />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PremiumLock locked={!dashboard.hasActiveSubscription}>
  <RecentLessonsCard lessons={dashboard.recentLessons} />
</PremiumLock>

        <PremiumLock locked={!dashboard.hasActiveSubscription}>
  <ProgressSummaryCard dashboard={dashboard} />
</PremiumLock>
      </section>
    </div>
  );
}
