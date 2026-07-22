"use server";

import { redirect } from "next/navigation";

import { getPlanById } from "@/lib/config/plans";
import { createAsaasCheckout } from "@/lib/services/asaas.service";
import { createClient } from "@/lib/supabase/server";

type Profile = {
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
  postal_code: string | null;
  address: string | null;
  address_number: string | null;
  province: string | null;
};

function normalizeDigits(
  value: string | null | undefined,
): string {
  return value?.replace(/\D/g, "") ?? "";
}

function getFormValue(
  formData: FormData,
  field: string,
): string {
  const value = formData.get(field);

  return typeof value === "string" ? value.trim() : "";
}

function getTodayInBrazil(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getApplicationUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function redirectToCheckoutError(
  planId: string,
  message: string,
): never {
  const params = new URLSearchParams({
    plano: planId,
    erro: message,
  });

  redirect(`/checkout?${params.toString()}`);
}

export async function startAsaasCheckout(
  formData: FormData,
): Promise<void> {
  const rawPlanId = getFormValue(formData, "plan");

  if (!rawPlanId) {
    redirect("/planos?erro=plano-invalido");
  }

  const plan = getPlanById(rawPlanId);

  if (!plan) {
    redirect("/planos?erro=plano-invalido");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    const returnUrl = `/checkout?plano=${plan.id}`;

    redirect(
      `/login?redirect=${encodeURIComponent(returnUrl)}`,
    );
  }

  if (!user.email) {
    redirectToCheckoutError(
      plan.id,
      "Não foi possível identificar o e-mail da sua conta.",
    );
  }

  const { data: profileData, error: profileError } =
    await supabase
      .from("profiles")
      .select(`
        full_name,
        phone,
        cpf,
        postal_code,
        address,
        address_number,
        province
      `)
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      "Erro ao buscar perfil para o checkout:",
      profileError,
    );

    redirectToCheckoutError(
      plan.id,
      "Não foi possível carregar seus dados. Tente novamente.",
    );
  }

  const profile = profileData as Profile | null;

  const formName = getFormValue(formData, "name");
  const formEmail = getFormValue(formData, "email");
  const formCpf = getFormValue(formData, "cpfCnpj");
  const formPostalCode = getFormValue(
    formData,
    "postalCode",
  );
  const formAddress = getFormValue(formData, "address");
  const formAddressNumber = getFormValue(
    formData,
    "addressNumber",
  );
  const formProvince = getFormValue(formData, "province");

  const customerName =
    formName ||
    profile?.full_name?.trim() ||
    user.user_metadata?.full_name?.trim() ||
    user.user_metadata?.name?.trim() ||
    "";

  const customerEmail = formEmail || user.email;

  const formPhone = getFormValue(formData, "phone");


  const customerCpf = normalizeDigits(
    formCpf || profile?.cpf,
  );

  const customerPostalCode = normalizeDigits(
    formPostalCode || profile?.postal_code,
  );

  const customerAddress =
    formAddress || profile?.address?.trim() || "";

  const customerAddressNumber =
    formAddressNumber ||
    profile?.address_number?.trim() ||
    "";

  const customerProvince =
    formProvince || profile?.province?.trim() || "";

const customerPhone = normalizeDigits(
  formPhone || profile?.phone,
);

  if (customerName.length < 3) {
    redirectToCheckoutError(
      plan.id,
      "Informe seu nome completo.",
    );
  }

  if (
    !customerEmail ||
    !customerEmail.includes("@") ||
    !customerEmail.includes(".")
  ) {
    redirectToCheckoutError(
      plan.id,
      "Informe um e-mail válido.",
    );
  }

  if (
  customerPhone.length < 10 ||
  customerPhone.length > 11
) {
  redirectToCheckoutError(
    plan.id,
    "Informe um telefone válido.",
  );
}

  if (
    customerCpf.length !== 11 &&
    customerCpf.length !== 14
  ) {
    redirectToCheckoutError(
      plan.id,
      "Informe um CPF ou CNPJ válido.",
    );
  }

  if (customerPostalCode.length !== 8) {
    redirectToCheckoutError(
      plan.id,
      "Informe um CEP válido com 8 números.",
    );
  }

  if (customerAddress.length < 3) {
    redirectToCheckoutError(
      plan.id,
      "Informe o nome da rua ou avenida.",
    );
  }

  if (!customerAddressNumber) {
    redirectToCheckoutError(
      plan.id,
      "Informe o número do endereço.",
    );
  }

  if (customerProvince.length < 2) {
    redirectToCheckoutError(
      plan.id,
      "Informe o bairro.",
    );
  }

  const { error: updateProfileError } = await supabase
    .from("profiles")
    .update({
  full_name: customerName,
  phone: customerPhone,
  cpf: customerCpf,
  postal_code: customerPostalCode,
  address: customerAddress,
  address_number: customerAddressNumber,
  province: customerProvince,
})
    .eq("id", user.id);

  if (updateProfileError) {
    console.error(
      "Erro ao atualizar dados do perfil:",
      updateProfileError,
    );

    redirectToCheckoutError(
      plan.id,
      "Não foi possível salvar seus dados. Tente novamente.",
    );
  }

  const appUrl = getApplicationUrl();

  const externalReference = [
    user.id,
    plan.id,
    Date.now(),
  ].join(":");

  let checkout;

  try {
   checkout = await createAsaasCheckout({
  billingTypes: ["CREDIT_CARD"],
  chargeTypes: ["RECURRENT"],
  minutesToExpire: 60,

  externalReference,

  callback: {
    successUrl: `${appUrl}/checkout/sucesso`,
    cancelUrl: `${appUrl}/checkout?plano=${plan.id}&status=cancelado`,
    expiredUrl: `${appUrl}/checkout?plano=${plan.id}&status=expirado`,
  },

  items: [
    {
      externalReference: plan.id,
      name: plan.name,
      description: plan.description,
      quantity: 1,
      value: plan.price,
    },
  ],

  customerData: {
    name: customerName,
    email: customerEmail,
    cpfCnpj: customerCpf,

    phone:
      customerPhone.length >= 10
        ? customerPhone
        : undefined,

    postalCode: customerPostalCode,
    address: customerAddress,
    addressNumber: customerAddressNumber,
    province: customerProvince,
  },

  subscription: {
    cycle: plan.billingCycle,
    nextDueDate: getTodayInBrazil(),
  },
});
} catch (error) {
  console.error("Erro ao criar checkout Asaas:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Não foi possível iniciar o pagamento.";

  redirectToCheckoutError(plan.id, message);
}

if (!checkout.link) {
  redirectToCheckoutError(
    plan.id,
    "O Asaas não retornou o endereço do checkout.",
  );
}

const { error: subscriptionError } = await supabase
  .from("subscriptions")
  .insert({
    user_id: user.id,
    provider: "asaas",
    status: "pending",

    plan: plan.id,
    amount: plan.price,
    billing_type: "CREDIT_CARD",

    asaas_checkout_id: checkout.id,
    checkout_external_reference: externalReference,
  });

if (subscriptionError) {
  console.error(
    "Erro ao registrar assinatura pendente:",
    subscriptionError,
  );

  redirectToCheckoutError(
    plan.id,
    "O checkout foi criado, mas não foi possível registrar a assinatura.",
  );
}

redirect(checkout.link);
}