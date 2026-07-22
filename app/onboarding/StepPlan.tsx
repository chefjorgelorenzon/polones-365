import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Crown,
  Medal,
} from "lucide-react";

type PlanType = "mensal" | "trimestral" | "anual";

interface StepPlanProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onFinish: () => void;
  onBack: () => void;
}

const plans = [
  {
    id: "mensal" as const,
    name: "Plano Mensal",
    price: "R$ 79,90",
    period: "por mês",
    description: "Mais liberdade para começar.",
    icon: CalendarDays,
  },
  {
    id: "trimestral" as const,
    name: "Plano Trimestral",
    price: "R$ 69,90",
    period: "por mês",
    description: "R$ 209,70 cobrados a cada 3 meses.",
    icon: Medal,
  },
  {
    id: "anual" as const,
    name: "Plano Anual",
    price: "R$ 59,90",
    period: "por mês",
    description: "R$ 718,80 cobrados anualmente.",
    icon: Crown,
    badge: "Melhor escolha",
  },
];

export default function StepPlan({
  selectedPlan,
  onSelectPlan,
  onFinish,
  onBack,
}: StepPlanProps) {
  const currentPlan = plans.find((plan) => plan.id === selectedPlan);

  return (
    <section>
      <div className="text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
          Etapa 4 de 4
        </p>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
          Confirme seu plano
        </h1>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-zinc-600">
          O plano escolhido anteriormente já está selecionado, mas você pode
          alterá-lo antes de continuar.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={`relative rounded-[24px] border-2 p-5 text-left transition ${
                isSelected
                  ? "border-red-700 bg-red-50 shadow-lg shadow-red-700/10"
                  : "border-zinc-200 bg-white hover:border-red-300 hover:bg-red-50/40"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 right-4 rounded-full bg-red-700 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                  {plan.badge}
                </span>
              )}

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                  isSelected
                    ? "bg-red-700 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                <Icon size={21} />
              </div>

              <h2 className="mt-5 text-lg font-black text-zinc-950">
                {plan.name}
              </h2>

              <div className="mt-3">
                <span className="text-2xl font-black text-zinc-950">
                  {plan.price}
                </span>

                <p className="mt-1 text-sm font-bold text-zinc-500">
                  {plan.period}
                </p>
              </div>

              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-600">
                {plan.description}
              </p>

              <div
                className={`mt-5 flex items-center gap-2 text-sm font-black ${
                  isSelected ? "text-red-700" : "text-zinc-500"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    isSelected
                      ? "bg-red-700 text-white"
                      : "border border-zinc-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </span>

                {isSelected ? "Plano selecionado" : "Selecionar plano"}
              </div>
            </button>
          );
        })}
      </div>

      {currentPlan && (
        <div className="mt-8 rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-zinc-500">
                Você está escolhendo:
              </p>

              <p className="mt-1 text-xl font-black text-zinc-950">
                {currentPlan.name}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-2xl font-black text-red-700">
                {currentPlan.price}
              </p>

              <p className="text-sm font-bold text-zinc-500">
                {currentPlan.period}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-6 font-black text-zinc-700 transition hover:bg-zinc-100"
        >
          <ArrowLeft size={19} />
          Voltar
        </button>

        <button
          type="button"
          onClick={onFinish}
          className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-7 font-black text-white shadow-lg shadow-red-700/20 transition hover:bg-red-600"
        >
          Continuar para pagamento
          <ArrowRight size={19} />
        </button>
      </div>
    </section>
  );
}