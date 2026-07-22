"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import ProgressBar from "./ProgressBar";
import StepDailyGoal from "./StepDailyGoal";
import StepGoal from "./StepGoal";
import StepLevel from "./StepLevel";
import StepPlan from "./StepPlan";

import type {
  DailyGoal,
  Goal,
  Level,
  PlanType,
} from "./types";

interface OnboardingWizardProps {
  selectedPlan: string | null;
}

export default function OnboardingWizard({
  selectedPlan,
}: OnboardingWizardProps) {
  const router = useRouter();

  const initialPlan: PlanType =
    selectedPlan === "mensal" ||
    selectedPlan === "trimestral" ||
    selectedPlan === "anual"
      ? selectedPlan
      : "anual";

  const [step, setStep] = useState<number>(1);

  const [level, setLevel] = useState<Level | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [plan, setPlan] = useState<PlanType>(initialPlan);

  const canContinue =
    (step === 1 && level !== null) ||
    (step === 2 && goal !== null) ||
    (step === 3 && dailyGoal !== null);

  function handleNext() {
    if (!canContinue) {
      return;
    }

    if (step < 4) {
      setStep((currentStep) => currentStep + 1);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((currentStep) => currentStep - 1);
    }
  }

  function handleFinish() {
    router.push(`/checkout?plano=${plan}`);
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-5 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <ProgressBar currentStep={step} totalSteps={4} />

        <div className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xl sm:p-10">
          {step === 1 && (
            <StepLevel
              value={level}
              onChange={setLevel}
            />
          )}

          {step === 2 && (
            <StepGoal
              value={goal}
              onChange={setGoal}
            />
          )}

          {step === 3 && (
            <StepDailyGoal
              value={dailyGoal}
              onChange={setDailyGoal}
            />
          )}

          {step === 4 && (
            <StepPlan
              selectedPlan={plan}
              onSelectPlan={setPlan}
              onFinish={handleFinish}
              onBack={handleBack}
            />
          )}

          {step < 4 && (
            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 font-black text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
                >
                  <ArrowLeft size={19} />
                  Voltar
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={!canContinue}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-7 font-black text-white shadow-lg shadow-red-700/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
              >
                Continuar
                <ArrowRight size={19} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}