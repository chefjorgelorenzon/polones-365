import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  createAsaasCustomer,
  createAsaasSubscription,
} from "@/lib/asaas/asaas.service";
import { AsaasApiError } from "@/lib/asaas/client";
import { isPlanType, PLANS } from "@/lib/config/plans";

import type { AsaasBillingType } from "@/lib/asaas/types";

type CreateSubscriptionBody = {
  plan?: string;
  billingType?: string;
  cpf?: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
};

type ExistingSubscription = {
  id: string;
  status: string;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
};

const ALLOWED_BILLING_TYPES: AsaasBillingType[] = [
  "PIX",
  "BOLETO",
  "CREDIT_CARD",
];

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpfLength(cpf: string): boolean {
  return cpf.length === 11;
}

function isBillingType(
  value: string,
): value is AsaasBillingType {
  return ALLOWED_BILLING_TYPES.includes(
    value as AsaasBillingType,
  );
}

function getTodayInBrazil(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date());
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado.";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    /*
     * 1. Valida o usuário autenticado.
     *
     * getUser() consulta o Supabase Auth e é apropriado
     * para decisões de autorização no servidor.
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Você precisa estar logado para assinar.",
        },
        {
          status: 401,
        },
      );
    }

    /*
     * 2. Lê e valida os dados enviados pelo checkout.
     */
    let body: CreateSubscriptionBody;

    try {
      body = (await request.json()) as CreateSubscriptionBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Os dados enviados são inválidos.",
        },
        {
          status: 400,
        },
      );
    }

    const planValue = body.plan?.trim().toLowerCase();
    const billingTypeValue = body.billingType
      ?.trim()
      .toUpperCase();
    const normalizedCpf = normalizeDigits(body.cpf ?? "");

    if (!planValue || !isPlanType(planValue)) {
      return NextResponse.json(
        {
          success: false,
          error: "O plano selecionado é inválido.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !billingTypeValue ||
      !isBillingType(billingTypeValue)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A forma de pagamento selecionada é inválida.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidCpfLength(normalizedCpf)) {
      return NextResponse.json(
        {
          success: false,
          error: "Informe um CPF válido com 11 números.",
        },
        {
          status: 400,
        },
      );
    }

    const plan = PLANS[planValue];

    /*
     * 3. Busca o perfil do aluno.
     */
    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select("id, full_name, phone, cpf")
      .eq("id", user.id)
      .single();

    const profile = profileData as Profile | null;

    if (profileError || !profile) {
      console.error(
        "Erro ao buscar o perfil:",
        profileError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível encontrar o perfil do aluno.",
        },
        {
          status: 404,
        },
      );
    }

    if (!profile.full_name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Complete seu nome antes de realizar a assinatura.",
        },
        {
          status: 400,
        },
      );
    }

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "O usuário autenticado não possui um e-mail válido.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * 4. Verifica se já existe uma assinatura local.
     */
    const {
      data: existingSubscriptionData,
      error: existingSubscriptionError,
    } = await supabase
      .from("subscriptions")
      .select(
        `
          id,
          status,
          asaas_customer_id,
          asaas_subscription_id
        `,
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingSubscriptionError) {
      console.error(
        "Erro ao consultar assinatura:",
        existingSubscriptionError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível verificar sua assinatura.",
        },
        {
          status: 500,
        },
      );
    }

    const existingSubscription =
      existingSubscriptionData as ExistingSubscription | null;

    /*
     * Evita criar duas recorrências para o mesmo usuário.
     */
    if (
      existingSubscription?.asaas_subscription_id &&
      ["pending", "active", "overdue"].includes(
        existingSubscription.status,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Você já possui uma assinatura cadastrada.",
          subscription: {
            status: existingSubscription.status,
            asaasSubscriptionId:
              existingSubscription.asaas_subscription_id,
          },
        },
        {
          status: 409,
        },
      );
    }

    /*
     * 5. Salva o CPF no perfil.
     */
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        cpf: normalizedCpf,
      })
      .eq("id", user.id);

    if (updateProfileError) {
      console.error(
        "Erro ao atualizar CPF:",
        updateProfileError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível salvar os dados do aluno.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * 6. Reutiliza o cliente do Asaas, quando já existir.
     * Caso contrário, cria um novo cliente.
     */
    let asaasCustomerId =
      existingSubscription?.asaas_customer_id ?? null;

    if (!asaasCustomerId) {
      const customer = await createAsaasCustomer({
        name: profile.full_name.trim(),
        email: user.email,
        cpfCnpj: normalizedCpf,
        mobilePhone: profile.phone
          ? normalizeDigits(profile.phone)
          : undefined,
        externalReference: user.id,
      });

      asaasCustomerId = customer.id;
    }

    /*
     * 7. Cria ou atualiza o registro local antes da assinatura.
     *
     * Isso preserva o customerId caso a criação da assinatura
     * falhe depois.
     */
    const localSubscriptionPayload = {
      user_id: user.id,
      plan: plan.id,
      status: "pending",
      billing_type: billingTypeValue,
      amount: plan.amount,
      asaas_customer_id: asaasCustomerId,
      asaas_subscription_id: null,
      asaas_payment_id: null,
      next_due_date: getTodayInBrazil(),
      updated_at: new Date().toISOString(),
    };

    const {
      data: localSubscriptionData,
      error: saveLocalSubscriptionError,
    } = await supabase
      .from("subscriptions")
      .upsert(localSubscriptionPayload, {
        onConflict: "user_id",
      })
      .select("id")
      .single();

    if (
      saveLocalSubscriptionError ||
      !localSubscriptionData
    ) {
      console.error(
        "Erro ao salvar assinatura local:",
        saveLocalSubscriptionError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Não foi possível preparar sua assinatura.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * 8. Cria a assinatura recorrente no Asaas.
     *
     * A primeira cobrança será gerada conforme o nextDueDate.
     */
    const asaasSubscription =
      await createAsaasSubscription({
        customerId: asaasCustomerId,
        billingType: billingTypeValue,
        value: plan.amount,
        cycle: plan.cycle,
        nextDueDate: getTodayInBrazil(),
        description: plan.description,
        externalReference: user.id,
      });

    /*
     * 9. Salva o ID da assinatura criada.
     */
    const { error: updateSubscriptionError } =
      await supabase
        .from("subscriptions")
        .update({
          plan: plan.id,
          status: "pending",
          billing_type: billingTypeValue,
          amount: plan.amount,
          asaas_customer_id: asaasCustomerId,
          asaas_subscription_id: asaasSubscription.id,
          next_due_date: asaasSubscription.nextDueDate,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (updateSubscriptionError) {
      console.error(
        "A assinatura foi criada no Asaas, mas houve erro ao salvá-la:",
        updateSubscriptionError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "A assinatura foi criada, mas não foi possível atualizar o sistema. Entre em contato com o suporte.",
          asaasSubscriptionId: asaasSubscription.id,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Assinatura criada com sucesso.",
        subscription: {
          id: localSubscriptionData.id,
          plan: plan.id,
          planName: plan.name,
          amount: plan.amount,
          billingType: billingTypeValue,
          status: "pending",
          asaasCustomerId,
          asaasSubscriptionId: asaasSubscription.id,
          nextDueDate: asaasSubscription.nextDueDate,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Erro ao criar assinatura no Asaas:",
      error,
    );

    if (error instanceof AsaasApiError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          provider: "asaas",
        },
        {
          status:
            error.status >= 400 && error.status < 500
              ? 400
              : 502,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      {
        status: 500,
      },
    );
  }
}