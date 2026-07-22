export type PlanType =
  | "mensal"
  | "trimestral"
  | "anual";

export type PlanConfig = {
  id: PlanType;
  name: string;
  amount: number;
  cycle: "MONTHLY" | "QUARTERLY" | "YEARLY";
  description: string;
};

export const PLANS: Record<PlanType, PlanConfig> = {
  mensal: {
    id: "mensal",
    name: "Plano Mensal",
    amount: 99.9,
    cycle: "MONTHLY",
    description:
      "Assinatura mensal da plataforma Polonês 365.",
  },

  trimestral: {
    id: "trimestral",
    name: "Plano Trimestral",
    amount: 269.7,
    cycle: "QUARTERLY",
    description:
      "Assinatura trimestral da plataforma Polonês 365.",
  },

  anual: {
    id: "anual",
    name: "Plano Anual",
    amount: 797,
    cycle: "YEARLY",
    description:
      "Assinatura anual da plataforma Polonês 365.",
  },
};

export function isPlanType(
  value: string,
): value is PlanType {
  return (
    value === "mensal" ||
    value === "trimestral" ||
    value === "anual"
  );
}