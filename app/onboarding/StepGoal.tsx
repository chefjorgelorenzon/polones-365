import {
  BookOpen,
  BriefcaseBusiness,
  Heart,
  Landmark,
  Languages,
  Plane,
  UsersRound,
} from "lucide-react";

import type { Goal } from "./types";

type StepGoalProps = {
  value: Goal | null;
  onChange: (value: Goal) => void;
};

const options = [
  {
    value: "citizenship" as const,
    title: "Cidadania polonesa",
    description:
      "Quero me preparar para processos, documentos e situações relacionadas à cidadania.",
    icon: Landmark,
  },
  {
    value: "travel" as const,
    title: "Viajar para a Polônia",
    description:
      "Quero conseguir me comunicar durante viagens, passeios e situações do dia a dia.",
    icon: Plane,
  },
  {
    value: "family" as const,
    title: "Conversar com familiares",
    description:
      "Quero me aproximar da minha história, das minhas raízes e da minha família.",
    icon: UsersRound,
  },
  {
    value: "work" as const,
    title: "Trabalho e oportunidades",
    description:
      "Quero utilizar o idioma em oportunidades profissionais, estudos ou negócios.",
    icon: BriefcaseBusiness,
  },
  {
    value: "culture" as const,
    title: "Cultura polonesa",
    description:
      "Quero conhecer melhor a cultura, as tradições e a história da Polônia.",
    icon: Heart,
  },
  {
    value: "language" as const,
    title: "Aprender um novo idioma",
    description:
      "Quero desenvolver uma nova habilidade e aprender polonês de forma estruturada.",
    icon: Languages,
  },
];

export default function StepGoal({
  value,
  onChange,
}: StepGoalProps) {
  return (
    <div>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
        <BookOpen size={30} />
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-red-700">
        Etapa 2
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
        Qual é o seu principal objetivo?
      </h2>

      <p className="mt-4 max-w-xl leading-7 text-zinc-600">
        Escolha o motivo que mais representa sua decisão de aprender polonês.
        Você poderá alterar essa informação futuramente.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
              className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${
                selected
                  ? "border-red-700 bg-red-50 shadow-md shadow-red-700/10"
                  : "border-zinc-200 bg-white hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition ${
                    selected
                      ? "bg-red-700 text-white"
                      : "bg-zinc-100 text-zinc-600 group-hover:bg-red-50 group-hover:text-red-700"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <div
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
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

              <h3 className="mt-5 text-lg font-black text-zinc-950">
                {option.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}