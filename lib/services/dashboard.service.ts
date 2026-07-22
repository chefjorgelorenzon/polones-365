import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getStudentCourse } from "@/lib/services/student-course.service";

const DASHBOARD_TIME_ZONE = "America/Sao_Paulo";
const WEEKLY_GOAL_TARGET = 5;

export type DashboardNextLesson = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  durationMinutes: number;
  moduleTitle: string;
};

export type DashboardRecentLesson = {
  id: string;
  number: number;
  title: string;
  moduleTitle: string;
  durationMinutes: number;
};

export type DashboardStudyDay = {
  date: string;
  label: string;
  completed: boolean;
};

export type DashboardWeeklyGoal = {
  target: number;
  completed: number;
  percentage: number;
  studyDays: DashboardStudyDay[];
};

export type DashboardStreak = {
  current: number;
};

export type DashboardSubscriptionStatus =
  | "active"
  | "pending"
  | "overdue"
  | "cancelled"
  | "expired"
  | "inactive"
  | null;

export type DashboardData = {
  greeting: string;

  studentName: string;
  studentInitial: string;

  hasActiveSubscription: boolean;
  subscriptionStatus: DashboardSubscriptionStatus;

  completedLessons: number;
  remainingLessons: number;
  totalLessons: number;
  progressPercentage: number;

  studyTimeMinutes: number;

  streak: DashboardStreak;
  weeklyGoal: DashboardWeeklyGoal;

  nextLesson: DashboardNextLesson | null;
  recentLessons: DashboardRecentLesson[];
};

type ProgressRecord = {
  lesson_id: string;
  started_at: string | null;
  completed_at: string | null;
  watch_seconds: number | null;
  progress_percentage: number | null;
  is_completed: boolean | null;
  last_accessed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type SubscriptionRecord = {
  id: string;
  status: string | null;
  created_at: string | null;
};

function getGreeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: DASHBOARD_TIME_ZONE,
      hour: "2-digit",
      hour12: false,
    }).format(new Date())
  );

  if (hour < 12) {
    return "Bom dia";
  }

  if (hour < 18) {
    return "Boa tarde";
  }

  return "Boa noite";
}

function getDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00.000Z`);
}

function addDays(dateKey: string, amount: number): string {
  const date = parseDateKey(dateKey);

  date.setUTCDate(date.getUTCDate() + amount);

  return date.toISOString().slice(0, 10);
}

function getCurrentWeekDateKeys(): string[] {
  const todayKey = getDateKey(new Date());
  const today = parseDateKey(todayKey);

  const weekDay = today.getUTCDay();

  const daysSinceMonday =
    weekDay === 0 ? 6 : weekDay - 1;

  const mondayKey = addDays(
    todayKey,
    -daysSinceMonday
  );

  return Array.from({ length: 7 }, (_, index) =>
    addDays(mondayKey, index)
  );
}

function getActivityDate(
  progress: ProgressRecord
): string | null {
  return (
    progress.last_accessed_at ??
    progress.completed_at ??
    progress.started_at ??
    progress.updated_at ??
    progress.created_at
  );
}

function calculateCurrentStreak(
  progressRecords: ProgressRecord[]
): number {
  const activityDates = new Set(
    progressRecords
      .map(getActivityDate)
      .filter(
        (date): date is string => Boolean(date)
      )
      .map((date) =>
        getDateKey(new Date(date))
      )
  );

  const todayKey = getDateKey(new Date());
  const yesterdayKey = addDays(todayKey, -1);

  let currentDateKey: string;

  if (activityDates.has(todayKey)) {
    currentDateKey = todayKey;
  } else if (activityDates.has(yesterdayKey)) {
    currentDateKey = yesterdayKey;
  } else {
    return 0;
  }

  let streak = 0;

  while (activityDates.has(currentDateKey)) {
    streak += 1;
    currentDateKey = addDays(currentDateKey, -1);
  }

  return streak;
}

function calculateWeeklyGoal(
  progressRecords: ProgressRecord[]
): DashboardWeeklyGoal {
  const weekDateKeys = getCurrentWeekDateKeys();

  const completedDateKeys = new Set(
    progressRecords
      .filter(
        (progress) =>
          progress.is_completed &&
          progress.completed_at
      )
      .map((progress) =>
        getDateKey(
          new Date(progress.completed_at as string)
        )
      )
  );

  const completedLessonsThisWeek =
    progressRecords.filter((progress) => {
      if (
        !progress.is_completed ||
        !progress.completed_at
      ) {
        return false;
      }

      const completedDateKey = getDateKey(
        new Date(progress.completed_at)
      );

      return weekDateKeys.includes(
        completedDateKey
      );
    }).length;

  const labels = [
    "S",
    "T",
    "Q",
    "Q",
    "S",
    "S",
    "D",
  ];

  const studyDays = weekDateKeys.map(
    (date, index) => ({
      date,
      label: labels[index],
      completed: completedDateKeys.has(date),
    })
  );

  const percentage = Math.min(
    100,
    Math.round(
      (completedLessonsThisWeek /
        WEEKLY_GOAL_TARGET) *
        100
    )
  );

  return {
    target: WEEKLY_GOAL_TARGET,
    completed: completedLessonsThisWeek,
    percentage,
    studyDays,
  };
}

function calculateStudyTimeMinutes(
  progressRecords: ProgressRecord[]
): number {
  const totalSeconds = progressRecords.reduce(
    (total, progress) =>
      total +
      Math.max(
        0,
        progress.watch_seconds ?? 0
      ),
    0
  );

  return Math.round(totalSeconds / 60);
}

function getStudentName(
  userMetadata: Record<string, unknown>,
  email?: string
): string {
  const metadataName =
    typeof userMetadata.name === "string"
      ? userMetadata.name.trim()
      : "";

  const metadataFullName =
    typeof userMetadata.full_name === "string"
      ? userMetadata.full_name.trim()
      : "";

  if (metadataName) {
    return metadataName;
  }

  if (metadataFullName) {
    return metadataFullName;
  }

  if (email) {
    const emailName = email.split("@")[0];

    if (emailName) {
      return emailName;
    }
  }

  return "Aluno";
}

function normalizeSubscriptionStatus(
  status: string | null | undefined
): DashboardSubscriptionStatus {
  if (!status) {
    return null;
  }

  const normalizedStatus = status
    .trim()
    .toLowerCase();

  const allowedStatuses: Exclude<
    DashboardSubscriptionStatus,
    null
  >[] = [
    "active",
    "pending",
    "overdue",
    "cancelled",
    "expired",
    "inactive",
  ];

  if (
    allowedStatuses.includes(
      normalizedStatus as Exclude<
        DashboardSubscriptionStatus,
        null
      >
    )
  ) {
    return normalizedStatus as Exclude<
      DashboardSubscriptionStatus,
      null
    >;
  }

  return "inactive";
}

export async function getDashboard(
  courseId: string
): Promise<DashboardData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `Erro ao verificar o usuário: ${userError.message}`
    );
  }

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const studentName = getStudentName(
    user.user_metadata ?? {},
    user.email
  );

  const studentInitial =
    studentName.charAt(0).toUpperCase() || "A";

  const [
    course,
    progressResponse,
    subscriptionResponse,
  ] = await Promise.all([
    getStudentCourse(courseId),

    supabase
      .from("lesson_progress")
      .select(
        `
          lesson_id,
          started_at,
          completed_at,
          watch_seconds,
          progress_percentage,
          is_completed,
          last_accessed_at,
          created_at,
          updated_at
        `
      )
      .eq("user_id", user.id),

    supabase
      .from("subscriptions")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle(),
  ]);

  if (progressResponse.error) {
    throw new Error(
      `Erro ao buscar estatísticas do Dashboard: ${progressResponse.error.message}`
    );
  }

  if (subscriptionResponse.error) {
    console.error(
      "Erro ao buscar assinatura do aluno:",
      subscriptionResponse.error.message
    );
  }

  const progressRecords =
    (progressResponse.data as
      | ProgressRecord[]
      | null) ?? [];

  const subscription =
    subscriptionResponse.data as
      | SubscriptionRecord
      | null;

  const subscriptionStatus =
    normalizeSubscriptionStatus(
      subscription?.status
    );

  const hasActiveSubscription =
    subscriptionStatus === "active";

  const nextLesson = course.nextLessonId
    ? course.modules
        .flatMap((module) =>
          module.lessons.map((lesson) => ({
            lesson,
            moduleTitle: module.title,
          }))
        )
        .find(
          ({ lesson }) =>
            lesson.id === course.nextLessonId
        )
    : null;

  const recentLessons = course.modules
    .flatMap((module) =>
      module.lessons
        .filter((lesson) => lesson.completed)
        .map((lesson) => ({
          id: lesson.id,
          number: lesson.lesson_number,
          title: lesson.title,
          moduleTitle: module.title,
          durationMinutes:
            lesson.duration_minutes ?? 0,
        }))
    )
    .sort((a, b) => b.number - a.number)
    .slice(0, 3);

  return {
    greeting: getGreeting(),

    studentName,
    studentInitial,

    hasActiveSubscription,
    subscriptionStatus,

    completedLessons:
      course.completedLessons,

    remainingLessons:
      course.totalLessons -
      course.completedLessons,

    totalLessons: course.totalLessons,

    progressPercentage:
      course.progressPercentage,

    studyTimeMinutes:
      calculateStudyTimeMinutes(
        progressRecords
      ),

    streak: {
      current:
        calculateCurrentStreak(
          progressRecords
        ),
    },

    weeklyGoal:
      calculateWeeklyGoal(progressRecords),

    nextLesson: nextLesson
      ? {
          id: nextLesson.lesson.id,
          number:
            nextLesson.lesson.lesson_number,
          title: nextLesson.lesson.title,
          description:
            nextLesson.lesson
              .short_description ?? null,
          durationMinutes:
            nextLesson.lesson
              .duration_minutes ?? 0,
          moduleTitle:
            nextLesson.moduleTitle,
        }
      : null,

    recentLessons,
  };
}