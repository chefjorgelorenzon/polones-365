import {
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import {
  formatCurrency,
  type SubscriptionPlan,
} from "@/lib/config/plans";

import ConfirmSubscriptionButton from "./ConfirmSubscriptionButton";

type CheckoutCardProps = {
  plan: SubscriptionPlan;

 customer: {
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  postalCode: string;
  address: string;
  addressNumber: string;
  province: string;
};
  action: (formData: FormData) => Promise<void>;
};

export default function CheckoutCard({
  plan,
  customer,
  action,
}: CheckoutCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-6 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          Sua assinatura
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              {plan.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {plan.description}
            </p>
          </div>

          <div className="shrink-0 sm:text-right">
            <div className="text-3xl font-black text-slate-950">
              {formatCurrency(plan.monthlyEquivalent)}
            </div>

            <div className="text-sm text-slate-500">
              equivalente por mês
            </div>
          </div>
        </div>
      </div>

      <form action={action}>
        <div className="space-y-7 px-6 py-7 sm:px-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Dados do aluno
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nome
                </label>

                <input
                  name="name"
                  defaultValue={customer.name}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  E-mail
                </label>

                <input
                  name="email"
                  type="email"
                  defaultValue={customer.email}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
  <label className="mb-1 block text-sm font-medium">
    Telefone
  </label>

  <input
    name="phone"
    type="tel"
    defaultValue={customer.phone}
    required
    placeholder="(54) 99999-9999"
    className="w-full rounded-xl border border-slate-300 px-4 py-3"
  />
</div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  CPF
                </label>

                <input
                  name="cpfCnpj"
                  defaultValue={customer.cpfCnpj}
                  required
                  placeholder="000.000.000-00"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  CEP
                </label>

                <input
                  name="postalCode"
                  defaultValue={customer.postalCode}
                  required
                  placeholder="00000-000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">
                  Rua
                </label>

                <input
                  name="address"
                  defaultValue={customer.address}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Número
                </label>

                <input
                  name="addressNumber"
                  defaultValue={customer.addressNumber}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Bairro
                </label>

                <input
                  name="province"
                  defaultValue={customer.province}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-red-100 bg-red-50/60 p-5">
            <div className="flex items-start gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

              <div>
                <h2 className="font-bold text-slate-950">
                  Pagamento no ambiente seguro do Asaas
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Após clicar abaixo você será redirecionado para concluir sua assinatura.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Ambiente protegido e criptografado
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Renovação automática conforme o plano
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <LockKeyhole className="h-5 w-5 text-emerald-600" />
                Os dados do cartão não passam pelo Polonês 365
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Valor da renovação
              </span>

              <span className="text-xl font-black text-slate-950">
                {formatCurrency(plan.price)}
              </span>
            </div>

            <p className="mb-5 text-right text-xs text-slate-500">
              {plan.totalDescription}
            </p>

            <input type="hidden" name="plan" value={plan.id} />

            <ConfirmSubscriptionButton />
          </section>
        </div>
      </form>
    </div>
  );
}