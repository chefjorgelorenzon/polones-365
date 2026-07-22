import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Languages,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type Subscription = {
  status: string | null;
  plan_id: string | null;
  created_at: string | null;
};

function isActiveSubscription(status: string | null | undefined) {
  return status === "active";
}

export default async function CheckoutSuccessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        "/checkout/sucesso",
      )}`,
    );
  }

  const { data: subscriptionData } = await supabase
    .from("subscriptions")
    .select("status, plan_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  const subscription =
    subscriptionData as Subscription | null;

  const subscriptionIsActive = isActiveSubscription(
    subscription?.status,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-8 sm:px-6 sm:py-12">
        <header className="flex items-center justify-center">
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-slate-950"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
              <Languages className="h-6 w-6" />
            </div>

            <span className="text-lg">
              Polonês 365
            </span>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            <div
              className={
                subscriptionIsActive
                  ? "bg-emerald-600 px-6 py-9 text-center text-white sm:px-10"
                  : "bg-amber-500 px-6 py-9 text-center text-white sm:px-10"
              }
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                {subscriptionIsActive ? (
                  <CheckCircle2 className="h-9 w-9" />
                ) : (
                  <Clock3 className="h-9 w-9" />
                )}
              </div>

              <h1 className="mt-5 text-3xl font-black sm:text-4xl">
                {subscriptionIsActive
                  ? "Assinatura confirmada!"
                  : "Pagamento recebido"}
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/90 sm:text-base">
                {subscriptionIsActive
                  ? "Seu acesso ao Polonês 365 já está liberado. Você pode começar seus estudos agora."
                  : "O Asaas está processando a confirmação da sua assinatura. Normalmente isso acontece em poucos instantes."}
              </p>
            </div>

            <div className="space-y-7 px-6 py-8 sm:px-10">
              {subscriptionIsActive ? (
                <>
                  <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />

                      <div>
                        <h2 className="font-bold text-slate-950">
                          Seu acesso premium está ativo
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          As aulas e funcionalidades exclusivas do plano já
                          estão disponíveis na sua conta.
                        </p>
                      </div>
                    </div>
                  </section>

                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700"
                  >
                    Ir para meu painel
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />

                      <div>
                        <h2 className="font-bold text-slate-950">
                          Aguardando confirmação
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Assim que o Asaas confirmar o pagamento, o acesso
                          premium será liberado automaticamente pelo sistema.
                        </p>
                      </div>
                    </div>
                  </section>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/checkout/sucesso"
                      className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Verificar novamente
                    </Link>

                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-4 font-bold text-white transition hover:bg-red-700"
                    >
                      Ir para o painel
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </>
              )}

              <p className="text-center text-xs leading-5 text-slate-400">
                Você pode fechar esta página com segurança. A confirmação
                continuará sendo processada automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}