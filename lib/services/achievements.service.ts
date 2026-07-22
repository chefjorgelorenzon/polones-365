import "server-only";

import { getDashboard } from "@/lib/services/dashboard.service";

export type AchievementCategory =
  | "lessons"
  | "streak"
  | "study_time"
  | "weekly_goal"
  | "course";

export type AchievementIconName =
  | "award"
  | "book"
  | "clock"
  | "flame"
  | "graduation"
  | "medal"
  | "star"
  | "target"
  | "trophy";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: AchievementIconName;
  requirement: number;
  currentValue: number;
  progressPercentage: number;
  unlocked: boolean;
};

export type AchievementsData = {
  total: number;
  unlocked: number;
  locked: number;
  progressPercentage: number;
  achievements: Achievement[];
};

type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: AchievementIconName;
  requirement: number;
};

const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "first-step",
    title: "Primeiro passo",
    description: "Conclua sua primeira aula.",
    category: "lessons",
    icon: "star",
    requirement: 1,
  },
  {
    id: "five-lessons",
    title: "Começando bem",
    description: "Conclua 5 aulas do curso.",
    category: "lessons",
    icon: "book",
    requirement: 5,
  },
  {
    id: "ten-lessons",
    title: "Dez dias de Polônia",
    description: "Conclua 10 aulas do curso.",
    category: "lessons",
    icon: "medal",
    requirement: 10,
  },
  {
    id: "thirty-lessons",
    title: "Estudante dedicado",
    description: "Conclua 30 aulas do curso.",
    category: "lessons",
    icon: "award",
    requirement: 30,
  },
  {
    id: "one-hundred-lessons",
    title: "Rumo à fluência",
    description: "Conclua 100 aulas do curso.",
    category: "lessons",
    icon: "graduation",
    requirement: 100,
  },
  {
    id: "course-completed",
    title: "Mestre do polonês",
    description: "Conclua todas as 365 aulas.",
    category: "course",
    icon: "trophy",
    requirement: 365,
  },
  {
    id: "two-day-streak",
    title: "Dois dias seguidos",
    description: "Estude por 2 dias consecutivos.",
    category: "streak",
    icon: "flame",
    requirement: 2,
  },
  {
    id: "seven-day-streak",
    title: "Semana perfeita",
    description: "Mantenha uma sequência de 7 dias.",
    category: "streak",
    icon: "flame",
    requirement: 7,
  },
  {
    id: "thirty-day-streak",
    title: "Hábito criado",
    description: "Mantenha uma sequência de 30 dias.",
    category: "streak",
    icon: "target",
    requirement: 30,
  },
  {
    id: "one-hundred-day-streak",
    title: "Constância absoluta",
    description: "Mantenha uma sequência de 100 dias.",
    category: "streak",
    icon: "trophy",
    requirement: 100,
  },
  {
    id: "one-hour-study",
    title: "Primeira hora",
    description: "Acumule 60 minutos de estudo.",
    category: "study_time",
    icon: "clock",
    requirement: 60,
  },
  {
    id: "five-hours-study",
    title: "Cinco horas de estudo",
    description: "Acumule 300 minutos de estudo.",
    category: "study_time",
    icon: "clock",
    requirement: 300,
  },
  {
    id: "study-marathon",
    title: "Maratona polonesa",
    description: "Acumule 1.000 minutos de estudo.",
    category: "study_time",
    icon: "medal",
    requirement: 1000,
  },
  {
    id: "weekly-goal",
    title: "Meta cumprida",
    description: "Conclua a meta semanal de estudos.",
    category: "weekly_goal",
    icon: "target",
    requirement: 5,
  },
];

function getCurrentValue(
  category: AchievementCategory,
  dashboard: Awaited<ReturnType<typeof getDashboard>>
): number {
  switch (category) {
    case "lessons":
    case "course":
      return dashboard.completedLessons;

    case "streak":
      return dashboard.streak.current;

    case "study_time":
      return dashboard.studyTimeMinutes;

    case "weekly_goal":
      return dashboard.weeklyGoal.completed;

    default:
      return 0;
  }
}

function calculateProgressPercentage(
  currentValue: number,
  requirement: number
): number {
  if (requirement <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((currentValue / requirement) * 100)
  );
}

export async function getAchievements(
  courseId: string
): Promise<AchievementsData> {
  const dashboard = await getDashboard(courseId);

  const achievements = achievementDefinitions.map(
    (definition): Achievement => {
      const currentValue = getCurrentValue(
        definition.category,
        dashboard
      );

      const unlocked =
        currentValue >= definition.requirement;

      return {
        ...definition,
        currentValue,
        unlocked,
        progressPercentage:
          calculateProgressPercentage(
            currentValue,
            definition.requirement
          ),
      };
    }
  );

  const unlocked = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  const total = achievements.length;
  const locked = total - unlocked;

  const progressPercentage =
    total > 0
      ? Math.round((unlocked / total) * 100)
      : 0;

  return {
    total,
    unlocked,
    locked,
    progressPercentage,
    achievements,
  };
}