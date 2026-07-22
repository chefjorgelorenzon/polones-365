import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type AsaasWebhookPayload = {
  id: string;
  event: string;
  payment?: {
    id: string;
    subscription?: string;
    dueDate?: string;
  };
  subscription?: {
    id: string;
    nextDueDate?: string;
  };
};

type SubscriptionStatus =
  | "pending"
  | "active"
  | "overdue"
  | "cancelled"
  | "expired";

function getStatusFromEvent(
  event: string
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
    case "SUBSCRIPTION_DELETED":
      return "cancelled";

    case "SUBSCRIPTION_INACTIVATED":
      return "expired";

    default:
      return null;
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook Asaas ativo.",
  });
}

export async function POST(request: Request) {
  const receivedToken = request.headers.get(
    "asaas-access-token"
  );

  const expectedToken =
    process.env.ASAAS_WEBHOOK_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      {
        success: false,
        error: "ASAAS_WEBHOOK_TOKEN não configurado.",
      },
      { status: 500 }
    );
  }

  if (receivedToken !== expectedToken) {
    return NextResponse.json(
      {
        success: false,
        error: "Token inválido.",
      },
      { status: 401 }
    );
  }

  let payload: AsaasWebhookPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Payload inválido.",
      },
      { status: 400 }
    );
  }

  if (!payload.id || !payload.event) {
    return NextResponse.json(
      {
        success: false,
        error: "Evento inválido.",
      },
      { status: 400 }
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

  const { data: savedEvent, error: saveEventError } =
    await supabase
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
        }
      )
      .select("id")
      .single();

  if (saveEventError || !savedEvent) {
    console.error(saveEventError);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao registrar evento.",
      },
      { status: 500 }
    );
  }

  try {
    const status = getStatusFromEvent(payload.event);

    if (!status) {
      await supabase
        .from("asaas_webhook_events")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
        })
        .eq("id", savedEvent.id);

      return NextResponse.json({
        success: true,
        ignored: true,
      });
    }

    const asaasSubscriptionId =
      payload.payment?.subscription ??
      payload.subscription?.id;

    if (!asaasSubscriptionId) {
      throw new Error(
        "ID da assinatura não encontrado no evento."
      );
    }

    const {
      data: localSubscription,
      error: localSubscriptionError,
    } = await supabase
      .from("subscriptions")
      .select("id")
      .eq(
        "asaas_subscription_id",
        asaasSubscriptionId
      )
      .maybeSingle();

    if (localSubscriptionError) {
      throw new Error(
        localSubscriptionError.message
      );
    }

    if (!localSubscription) {
      throw new Error(
        "Assinatura local não encontrada."
      );
    }

    const updateData: Record<string, string> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (payload.payment?.id) {
      updateData.asaas_payment_id =
        payload.payment.id;
    }

    const nextDueDate =
      payload.subscription?.nextDueDate ??
      payload.payment?.dueDate;

    if (nextDueDate) {
      updateData.next_due_date = nextDueDate;
    }

    if (status === "active") {
      updateData.activated_at =
        new Date().toISOString();
    }

    if (status === "cancelled") {
      updateData.cancelled_at =
        new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", localSubscription.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

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
      event: payload.event,
      status,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido.";

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
      { status: 500 }
    );
  }
}