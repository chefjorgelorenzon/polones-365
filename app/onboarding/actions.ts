"use server";

import { redirect } from "next/navigation";

import { completeOnboarding } from "@/lib/services/profile.service";

import type { DailyGoal, Goal, Level, PlanType } from "./types";

const LEVEL_TO_PROFILE_VALUE: Record<Level, string> = {
  beginner: "iniciante",
  basic: "basico",
  intermediate: "intermediario",
  advanced: "avancado",
};

const GOAL_TO_PROFILE_VALUE: Record<Goal, string> = {
  citizenship: "cidadania",
  travel: "viagem",
  family: "familia",
  work: "trabalho",
  culture: "cultura",
  language: "outro",
};

export async function finishOnboardingAction(
  level: Level,
  goal: Goal,
  dailyGoal: DailyGoal,
  plan: PlanType
) {
  try {
    await completeOnboarding({
      study_goal: GOAL_TO_PROFILE_VALUE[goal],
      current_level: LEVEL_TO_PROFILE_VALUE[level],
      daily_goal_minutes: dailyGoal,
    });
  } catch (error) {
    console.error(
      "Erro ao salvar respostas do onboarding:",
      error
    );
  }

  redirect(`/checkout?plano=${plan}`);
}
