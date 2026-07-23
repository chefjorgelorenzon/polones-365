import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

type AsaasWebhookPayload = {
  id: string;
  event: string;

  payment?: {
  id: string;
  customer?: string;
  subscription?: string;
  externalReference?: string;
  checkoutSession?: string;
  billingType?: string;
  value?: number;
  dueDate?: string;
  paymentDate?: string;
  confirmedDate?: string;
};

  subscription?: {
    id: string;
    customer?: string;
    externalReference?: string;
    value?: number;
    cycle?: string;
    nextDueDate?: string;
  };
};

type SubscriptionStatus =
  | "pending"
  | "active"
  | "overdue"
  | "canceled"
  | "expired";

function getStatusFromEvent(
  event: string,
): SubscriptionStatus | null {
  switch (event) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED":
      return "active";

    case "PAYMENT_OVERDUE":
      return "overdue";

    case "PAYMENT_REFUNDED":
    case "PAYMENT_CHARGEBACK_REQUESTED":
    case "PAYMENT_CHARGEBACK_DISPUTE":
    case "PAYMENT_DELETED":
    case "SUBSCRIPTION_DELETED":
      return "canceled";

    case "SUBSCRIPTION_INACTIVATED":
      return "expired";

    default:
      return null;
  }
}

function parseExternalReference(
  externalReference: string | undefined,
) {
  if (!externalReference) {
    return {
      userId: null,
      planReference: null,
    };
  }

  const [userId, planReference] =
    externalReference.split(":");

  return {
    userId: userId || null,
    planReference: planReference || null,
  };
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook Asaas ativo.",
  });
}

export async function POST(request: Request) {
  const receivedToken = request.headers.get(
    "asaas-access-token",
  );

  const expectedToken =
    process.env.ASAAS_WEBHOOK_TOKEN;

  if (!expectedToken) {
    console.error(
      "ASAAS_WEBHOOK_TOKEN não configurado.",
    );

    return NextResponse.json(
      {
        success: false,
        error: "Webhook não configurado.",
      },
      {
        status: 500,
      },
    );
  }

  if (receivedToken !== expectedToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Token inválido.",
      },
      {
        status: 401,
      },
    );
  }

  let payload: AsaasWebhookPayload;

  try {
    payload =
      (await request.json()) as AsaasWebhookPayload;
        console.log("========== WEBHOOK ASAAS ==========");
    console.log("EVENTO:", payload.event);
    console.log("EVENT ID:", payload.id);
    console.log(
      "CHECKOUT:",
      payload.payment?.checkoutSession
    );
    console.log(
      "SUBSCRIPTION:",
      payload.payment?.subscription
    );
    console.log(
      "PAYMENT:",
      payload.payment?.id
    );
    console.log(
      "EXTERNAL REFERENCE:",
      payload.payment?.externalReference
    );
    console.log(
      "PAYLOAD:",
      JSON.stringify(payload, null, 2)
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Payload inválido.",
      },
      {
        status: 400,
      },
    );
  }

  if (!payload.id || !payload.event) {
    return NextResponse.json(
      {
        success: false,
        error: "Evento inválido.",
      },
      {
        status: 400,
      },
    );
  }

  const supabase = createAdminClient();

  const { data: existingEvent } = await supabase
    .from("asaas_webhook_events")
    .select("id, processed")
    .eq("asaas_event_id", payload.id)
    .maybeSingle();

  if (existingEvent?.processed) {
    return NextResponse.json({
      success: true,
      duplicate: true,
    });
  }

  const {
    data: savedEvent,
    error: saveEventError,
  } = await supabase
    .from("asaas_webhook_events")
    .upsert(
      {
        asaas_event_id: payload.id,
        event_type: payload.event,
        payload,
        processed: false,
        error_message: null,
      },
      {
        onConflict: "asaas_event_id",
      },
    )
    .select("id")
    .single();

  if (saveEventError || !savedEvent) {
    console.error(
      "Erro ao registrar evento Asaas:",
      saveEventError,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao registrar evento.",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const status = getStatusFromEvent(
      payload.event,
    );

    if (!status) {
      await supabase
        .from("asaas_webhook_events")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", savedEvent.id);

      return NextResponse.json({
        success: true,
        ignored: true,
        event: payload.event,
      });
    }

    const asaasSubscriptionId =
      payload.payment?.subscription ??
      payload.subscription?.id ??
      null;

    const externalReference =
      payload.payment?.externalReference ??
      payload.subscription?.externalReference;

    const { userId, planReference } =
      parseExternalReference(externalReference);

    let localSubscription: {
      id: string;
      user_id: string;
    } | null = null;

    const checkoutSession =
  payload.payment?.checkoutSession ?? null;

// 1º Procura pelo checkout
if (checkoutSession) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("asaas_checkout_id", checkoutSession)
    .maybeSingle();

  if (error) throw new Error(error.message);

  localSubscription = data;
}

// 2º Procura pela assinatura Asaas
if (!localSubscription && asaasSubscriptionId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("asaas_subscription_id", asaasSubscriptionId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  localSubscription = data;
}

// 3º Procura pela externalReference
if (!localSubscription && externalReference) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("checkout_external_reference", externalReference)
    .maybeSingle();

  if (error) throw new Error(error.message);

  localSubscription = data;
}

// 4º Último recurso
if (!localSubscription && userId) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  localSubscription = data;
}

    const now = new Date().toISOString();

    const nextDueDate =
      payload.subscription?.nextDueDate ??
      payload.payment?.dueDate ??
      null;

    const updateData: Record<
      string,
      string | number | null
    > = {
      status,
      provider: "asaas",
      updated_at: now,
    };

    if (asaasSubscriptionId) {
      updateData.asaas_subscription_id =
        asaasSubscriptionId;

      updateData.external_subscription_id =
        asaasSubscriptionId;
    }

    if (payload.payment?.id) {
      updateData.asaas_payment_id =
        payload.payment.id;
    }

    const asaasCustomerId =
      payload.payment?.customer ??
      payload.subscription?.customer;

    if (asaasCustomerId) {
      updateData.asaas_customer_id =
        asaasCustomerId;

      updateData.external_customer_id =
        asaasCustomerId;
    }

    if (payload.payment?.billingType) {
      updateData.billing_type =
        payload.payment.billingType;
    }

    if (
      typeof payload.payment?.value === "number"
    ) {
      updateData.amount = payload.payment.value;
    } else if (
      typeof payload.subscription?.value ===
      "number"
    ) {
      updateData.amount =
        payload.subscription.value;
    }

    if (nextDueDate) {
      updateData.next_due_date = nextDueDate;
      updateData.current_period_start = now;
    }

    if (status === "active") {
      updateData.activated_at = now;

      console.log(
  "LOCAL SUBSCRIPTION:",
  localSubscription
);

      if (!localSubscription) {
        updateData.started_at = now;
      }
    }

    if (status === "canceled") {
      updateData.canceled_at = now;
      updateData.access_until = now;
    }

    if (status === "expired") {
      updateData.access_until = now;
    }

   console.log("========== RESULTADO DA BUSCA ==========");
console.log("EVENTO:", payload.event);
console.log(
  "CHECKOUT SESSION:",
  payload.payment?.checkoutSession,
);
console.log(
  "ASAAS SUBSCRIPTION ID:",
  payload.payment?.subscription,
);
console.log(
  "ASAAS PAYMENT ID:",
  payload.payment?.id,
);
console.log(
  "EXTERNAL REFERENCE:",
  payload.payment?.externalReference,
);
console.log("USER ID EXTRAÍDO:", userId);
console.log(
  "ASSINATURA LOCAL ENCONTRADA:",
  localSubscription,
);

if (localSubscription) {
  console.log(
    "Atualizando assinatura existente:",
    localSubscription.id,
  );

  const { error: updateError } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("id", localSubscription.id);

  if (updateError) {
    throw new Error(updateError.message);
  }
} else {
  console.log(
    "Nenhuma assinatura local encontrada.",
  );

  if (!userId) {
    const message =
      "Evento ignorado: nenhuma assinatura local corresponde ao checkout recebido.";

    console.warn(message, {
      event: payload.event,
      checkoutSession,
      asaasSubscriptionId,
      paymentId: payload.payment?.id,
    });

    await supabase
      .from("asaas_webhook_events")
      .update({
        processed: true,
        processed_at: now,
        error_message: message,
      })
      .eq("id", savedEvent.id);

    return NextResponse.json(
      {
        success: true,
        ignored: true,
        message,
        event: payload.event,
        checkoutSession,
      },
      {
        status: 200,
      },
    );
  }

  const insertData = {
    ...updateData,
    user_id: userId,
    plan:
      planReference &&
      planReference.length < 100
        ? planReference
        : null,
    asaas_checkout_id: checkoutSession,
    checkout_external_reference:
      externalReference ?? null,
  };

  console.log(
    "Criando nova assinatura:",
    insertData,
  );

  const { error: insertError } = await supabase
    .from("subscriptions")
    .insert(insertData);

  if (insertError) {
    throw new Error(insertError.message);
  }

  console.log(
    "Nova assinatura criada com sucesso.",
  );
}

await supabase
  .from("asaas_webhook_events")
  .update({
    processed: true,
    processed_at: now,
    error_message: null,
  })
  .eq("id", savedEvent.id);

return NextResponse.json({
  success: true,
  event: payload.event,
  status,
});
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Erro desconhecido.";

  console.error(
    "========== ERRO WEBHOOK ASAAS =========="
  );

  console.error({
    event: payload?.event,
    checkoutSession:
      payload?.payment?.checkoutSession,
    subscriptionId:
      payload?.payment?.subscription,
    paymentId:
      payload?.payment?.id,
    externalReference:
      payload?.payment?.externalReference,
    message,
  });

  await supabase
    .from("asaas_webhook_events")
    .update({
      processed: false,
      error_message: message,
    })
    .eq("id", savedEvent.id);

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status: 500,
    },
  );
}
}