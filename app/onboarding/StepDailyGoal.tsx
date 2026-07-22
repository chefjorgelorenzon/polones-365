import { Clock3 } from "lucide-react";
import type { DailyGoal } from "./types";

type StepDailyGoalProps = {
  value: DailyGoal | null;
  onChange: (value: DailyGoal) => void;
};

const options = [
  {
    value: 10 as const,
    title: "10 minutos",
    description: "Ideal para quem tem uma rotina corrida.",
  },
  {
    value: 20 as const,
    title: "20 minutos",
    description: "Uma evolução constante sem exigir muito tempo.",
  },
  {
    value: 30 as const,
    title: "30 minutos",
    description: "O equilíbrio perfeito para evoluir rapidamente.",
    recommended: true,
  },
  {
    value: 45 as const,
    title: "45 minutos",
    description: "Para quem deseja acelerar o aprendizado.",
  },
  {
    value: 60 as const,
    title: "1 hora",
    description: "Imersão diária para evoluir ainda mais.",
  },
];

export default function StepDailyGoal({
  value,
  onChange,
}: StepDailyGoalProps) {
  return (
    <div>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
        <Clock3 size={30} />
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-red-700">
        Etapa 3
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
        Quanto tempo você pretende estudar por dia?
      </h2>

      <p className="mt-4 max-w-xl leading-7 text-zinc-600">
        Não existe resposta certa. Escolha um tempo que seja fácil manter todos
        os dias. A consistência é mais importante do que estudar muitas horas.
      </p>

      <div className="mt-10 space-y-4">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`relative w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                selected
                  ? "border-red-700 bg-red-50 shadow-md shadow-red-700/10"
                  : "border-zinc-200 bg-white hover:border-red-300 hover:shadow-md"
              }`}
            >
              {option.recommended && (
                <span className="absolute right-5 top-5 rounded-full bg-red-700 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                  Recomendado
                </span>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-zinc-950">
                    {option.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {option.description}
                  </p>
                </div>

                <div
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected
                      ? "border-red-700 bg-red-700"
                      : "border-zinc-300"
                  }`}
                >
                  {selected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}