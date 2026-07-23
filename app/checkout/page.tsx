import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import { redirect } from "next/navigation";

import CheckoutCard from "@/components/checkout/CheckoutCard";
import { getPlanById } from "@/lib/config/plans";
import { createClient } from "@/lib/supabase/server";

import { startAsaasCheckout } from "./actions";

type CheckoutPageProps = {
  searchParams: Promise<{
    plano?: string;
    erro?: string;
    status?: string;
  }>;
};

type Profile = {
  full_name: string | null;
  phone: string | null;
  cpf: string | null;
  postal_code: string | null;
  address: string | null;
  address_number: string | null;
  province: string | null;
};

const statusMessages: Record<string, string> = {
  cancelado:
    "O pagamento foi cancelado. Você pode tentar novamente quando desejar.",

  expirado:
    "O checkout expirou. Clique novamente para gerar uma nova sessão.",
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams;
  const plan = getPlanById(params.plano);

  if (!plan) {
    redirect("/planos");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/checkout?plano=${plan.id}`,
      )}`,
    );
  }

  const { data: profileData } = await supabase
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

  const profile = profileData as Profile | null;

  const customerName =
    profile?.full_name?.trim() ||
    user.user_metadata?.full_name?.trim() ||
    user.user_metadata?.name?.trim() ||
    "Aluno Polonês 365";

  const customerEmail = user.email?.trim() ?? "";

  const customerPhone =
    profile?.phone?.trim() ||
    user.user_metadata?.phone?.trim() ||
    "";

  const customerCpf =
    profile?.cpf?.trim() ||
    user.user_metadata?.cpf?.trim() ||
    "";

  const customerPostalCode =
    profile?.postal_code?.trim() ||
    user.user_metadata?.postal_code?.trim() ||
    "";

  const customerAddress =
    profile?.address?.trim() ||
    user.user_metadata?.address?.trim() ||
    "";

  const customerAddressNumber =
    profile?.address_number?.trim() ||
    user.user_metadata?.address_number?.trim() ||
    "";

  const customerProvince =
    profile?.province?.trim() ||
    user.user_metadata?.province?.trim() ||
    "";

  const errorMessage = params.erro
    ? decodeURIComponent(params.erro)
    : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-center justify-between">
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos planos
          </Link>

          <div className="flex items-center gap-2 font-bold text-slate-950">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
              <Languages className="h-5 w-5" />
            </div>

            <span className="hidden sm:inline">
              Polonês 365
            </span>
          </div>
        </header>

        {params.status && statusMessages[params.status] && (
          <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-900">
            {statusMessages[params.status]}
          </div>
        )}

        {errorMessage && (
          <div className="mx-auto mb-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
            {errorMessage}
          </div>
        )}

        <div className="mx-auto max-w-3xl">
          <CheckoutCard
            plan={plan}
            customer={{
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              cpfCnpj: customerCpf,
              postalCode: customerPostalCode,
              address: customerAddress,
              addressNumber: customerAddressNumber,
              province: customerProvince,
            }}
            action={startAsaasCheckout}
          />

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Ao continuar, você concorda com os termos de uso e com a renovação
            recorrente do plano escolhido.
          </p>
        </div>
      </div>
    </main>
  );
}