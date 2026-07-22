import { GraduationCap } from "lucide-react";
import type { Level } from "./types";

type Props = {
  value: Level | null;
  onChange: (value: Level) => void;
};

const options = [
  {
    value: "beginner" as const,
    title: "Nunca estudei",
    description:
      "Vou começar do absoluto zero.",
  },
  {
    value: "basic" as const,
    title: "Básico",
    description:
      "Conheço algumas palavras e expressões.",
  },
  {
    value: "intermediate" as const,
    title: "Intermediário",
    description:
      "Consigo compreender parte das conversas.",
  },
  {
    value: "advanced" as const,
    title: "Avançado",
    description:
      "Quero aperfeiçoar minha comunicação.",
  },
];

export default function StepLevel({
  value,
  onChange,
}: Props) {
  return (
    <div>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-700">
        <GraduationCap size={30} />
      </div>

      <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-red-700">
        Etapa 1
      </p>

      <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950">
        Qual é o seu nível de polonês?
      </h2>

      <p className="mt-4 max-w-xl leading-7 text-zinc-600">
        Isso nos ajuda a adaptar sua experiência dentro da
        plataforma.
      </p>

      <div className="mt-10 space-y-4">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                selected
                  ? "border-red-700 bg-red-50 shadow-md"
                  : "border-zinc-200 bg-white hover:border-red-300 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">
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