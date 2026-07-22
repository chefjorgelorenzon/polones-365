export type PlanId = "mensal" | "trimestral" | "anual";

export type PlanBillingCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";

export type SubscriptionPlan = {
  id: PlanId;
  name: string;
  shortName: string;
  description: string;

  /**
   * Valor realmente cobrado em cada renovação.
   *
   * Mensal: R$ 79,90
   * Trimestral: R$ 209,70
   * Anual: R$ 718,80
   */
  price: number;

  /**
   * Valor mensal equivalente utilizado apenas para apresentação.
   */
  monthlyEquivalent: number;

  billingCycle: PlanBillingCycle;
  billingMonths: number;

  priceDescription: string;
  totalDescription: string;

  highlighted: boolean;
  badge: string | null;

  benefits: string[];
};

export const PLANS: Record<PlanId, SubscriptionPlan> = {
  mensal: {
    id: "mensal",
    name: "Plano Mensal",
    shortName: "Mensal",
    description:
      "Ideal para começar sua jornada com liberdade e sem compromisso de longo prazo.",

    price: 79.9,
    monthlyEquivalent: 79.9,

    billingCycle: "MONTHLY",
    billingMonths: 1,

    priceDescription: "por mês",
    totalDescription: "Cobrança mensal recorrente",

    highlighted: false,
    badge: null,

    benefits: [
      "Acesso às 365 aulas do programa",
      "Uma aula recomendada por dia",
      "Controle individual de progresso",
      "Exercícios e materiais complementares",
      "Acesso pelo celular, tablet e computador",
      "Cancelamento quando desejar",
    ],
  },

  trimestral: {
    id: "trimestral",
    name: "Plano Trimestral",
    shortName: "Trimestral",
    description:
      "Mais economia para quem deseja criar uma rotina consistente de estudos.",

    price: 209.7,
    monthlyEquivalent: 69.9,

    billingCycle: "QUARTERLY",
    billingMonths: 3,

    priceDescription: "por mês",
    totalDescription: "R$ 209,70 cobrados a cada 3 meses",

    highlighted: false,
    badge: null,

    benefits: [
      "Tudo que está incluso no plano mensal",
      "Três meses de acesso contínuo",
      "Economia em comparação ao plano mensal",
      "Acompanhamento do seu progresso",
      "Aulas organizadas em sequência",
      "Renovação automática trimestral",
    ],
  },

  anual: {
    id: "anual",
    name: "Plano Anual",
    shortName: "Anual",
    description:
      "A melhor opção para quem quer concluir toda a jornada com o menor investimento.",

    price: 718.8,
    monthlyEquivalent: 59.9,

    billingCycle: "YEARLY",
    billingMonths: 12,

    priceDescription: "por mês",
    totalDescription: "R$ 718,80 cobrados anualmente",

    highlighted: true,
    badge: "Melhor escolha",

    benefits: [
      "Tudo que está incluso no plano mensal",
      "365 dias completos de acesso",
      "Economia de aproximadamente 25%",
      "Jornada contínua durante todo o curso",
      "Certificado de conclusão",
      "Prioridade em novidades e conteúdos extras",
    ],
  },
};

export const PLAN_IDS = Object.keys(PLANS) as PlanId[];

export function isValidPlanId(value: string | null | undefined): value is PlanId {
  if (!value) {
    return false;
  }

  return PLAN_IDS.includes(value as PlanId);
}

export function getPlanById(
  planId: string | null | undefined,
): SubscriptionPlan | null {
  if (!isValidPlanId(planId)) {
    return null;
  }

  return PLANS[planId];
}

export function getAllPlans(): SubscriptionPlan[] {
  return PLAN_IDS.map((planId) => PLANS[planId]);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPlanPrice(plan: SubscriptionPlan): string {
  return formatCurrency(plan.monthlyEquivalent);
}