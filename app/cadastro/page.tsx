import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import RegisterForm from "@/components/auth/RegisterForm";

const benefits = [
  {
    icon: CalendarCheck2,
    title: "Uma aula por dia",
    description: "Uma jornada organizada para você saber o que estudar.",
  },
  {
    icon: CheckCircle2,
    title: "Progresso individual",
    description: "Acompanhe suas aulas concluídas e sua evolução.",
  },
  {
    icon: ShieldCheck,
    title: "Ambiente exclusivo",
    description: "Seu aprendizado salvo em uma conta protegida.",
  },
];

const plans = {
  mensal: {
    name: "Plano Mensal",
    price: "R$ 79,90/mês",
  },
  trimestral: {
    name: "Plano Trimestral",
    price: "R$ 209,70 a cada 3 meses",
  },
  anual: {
    name: "Plano Anual",
    price: "R$ 718,80 por ano",
  },
} as const;

type PlanId = keyof typeof plans;

type RegisterPageProps = {
  searchParams: Promise<{
    plano?: string;
  }>;
};

function isValidPlan(plan?: string): plan is PlanId {
  return Boolean(plan && plan in plans);
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  const selectedPlan = isValidPlan(params.plano)
    ? params.plano
    : null;

  const plan = selectedPlan ? plans[selectedPlan] : null;

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-lg">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 font-black text-white">
              MP
            </div>

            <div>
              <p className="text-lg font-black leading-none text-zinc-950">
                Márcio Polonês
              </p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-red-700">
                Polonês 3.0
              </p>
            </div>
          </Link>

          <div className="mt-10">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">
              Comece sua jornada
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-zinc-950 sm:text-5xl">
              Crie sua conta.
            </h1>

            <p className="mt-5 leading-7 text-zinc-600">
              Cadastre-se para acessar a plataforma e iniciar sua jornada no
              aprendizado do polonês.
            </p>
          </div>

          {plan ? (
            <div className="mt-8 flex items-center justify-between gap-5 rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-700 text-white">
                  <CreditCard size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-red-700">
                    Plano selecionado
                  </p>

                  <p className="mt-1 font-black text-zinc-950">
                    {plan.name}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-600">
                    {plan.price}
                  </p>
                </div>
              </div>

              <Link
                href="/planos"
                className="shrink-0 text-sm font-black text-red-700 hover:underline"
              >
                Alterar
              </Link>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="font-black text-amber-900">
                Nenhum plano selecionado
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                Você pode criar sua conta agora e escolher um plano em seguida.
              </p>

              <Link
                href="/planos"
                className="mt-3 inline-flex text-sm font-black text-red-700 hover:underline"
              >
                Ver planos disponíveis
              </Link>
            </div>
          )}

          <RegisterForm selectedPlan={selectedPlan} />
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-[#C8101E] lg:block">
        <div className="absolute -left-44 -top-44 h-[500px] w-[500px] rounded-full border-[100px] border-white/5" />
        <div className="absolute -bottom-48 -right-36 h-[600px] w-[600px] rounded-full border-[120px] border-white/5" />

        <div className="relative flex min-h-screen items-center justify-center px-12 py-16">
          <div className="grid w-full max-w-4xl items-center gap-12 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-8 rounded-full bg-white/15 blur-3xl" />

              <Image
                src="/capa-polones-3.jpg"
                alt="Curso Polonês 3.0"
                width={1024}
                height={1536}
                priority
                className="relative rounded-[28px] border border-white/20 shadow-2xl"
              />
            </div>

            <div className="text-white">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/65">
                Sua jornada começa aqui
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em]">
                Aprenda polonês um dia de cada vez.
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/75">
                Uma experiência organizada para ajudar você a criar uma rotina
                e avançar com consistência.
              </p>

              <div className="mt-9 space-y-5">
                {benefits.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-700">
                      <Icon size={22} />
                    </div>

                    <div>
                      <p className="font-black">{title}</p>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}