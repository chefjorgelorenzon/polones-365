import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  Check,
  Crown,
  LockKeyhole,
  Medal,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

const plans = [
  {
    id: "mensal",
    name: "Plano Mensal",
    description:
      "Ideal para começar sua jornada com liberdade e sem compromisso de longo prazo.",
    price: "79,90",
    priceDescription: "por mês",
    totalDescription: "Cobrança mensal recorrente",
    highlighted: false,
    badge: null,
    icon: CalendarDays,
    benefits: [
      "Acesso às 365 aulas do programa",
      "Uma aula recomendada por dia",
      "Controle individual de progresso",
      "Exercícios e materiais complementares",
      "Acesso pelo celular, tablet e computador",
      "Cancelamento quando desejar",
    ],
  },
  {
    id: "anual",
    name: "Plano Anual",
    description:
      "A melhor opção para quem quer concluir toda a jornada com o menor investimento.",
    price: "59,90",
    priceDescription: "por mês",
    totalDescription: "R$ 718,80 cobrados anualmente",
    highlighted: true,
    badge: "Melhor escolha",
    icon: Crown,
    benefits: [
      "Tudo que está incluso no plano mensal",
      "365 dias completos de acesso",
      "Economia de aproximadamente 28%",
      "Jornada contínua durante todo o curso",
      "Certificado de conclusão",
      "Prioridade em novidades e conteúdos extras",
    ],
  },
  {
    id: "trimestral",
    name: "Plano Trimestral",
    description:
      "Mais economia para quem deseja criar uma rotina consistente de estudos.",
    price: "69,90",
    priceDescription: "por mês",
    totalDescription: "R$ 209,70 cobrados a cada 3 meses",
    highlighted: false,
    badge: null,
    icon: Medal,
    benefits: [
      "Tudo que está incluso no plano mensal",
      "Três meses de acesso contínuo",
      "Economia em comparação ao plano mensal",
      "Acompanhamento do seu progresso",
      "Aulas organizadas em sequência",
      "Renovação automática trimestral",
    ],
  },
];

const platformBenefits = [
  {
    icon: BookOpenCheck,
    title: "365 aulas organizadas",
    description:
      "Uma sequência completa para você avançar do básico até uma comunicação mais segura.",
  },
  {
    icon: Trophy,
    title: "Progresso acompanhado",
    description:
      "Veja suas aulas concluídas, mantenha sua sequência e acompanhe sua evolução.",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento seguro",
    description:
      "Seus dados e pagamentos são processados em um ambiente seguro e protegido.",
  },
];

const questions = [
  {
    question: "Preciso estudar todos os dias?",
    answer:
      "A plataforma recomenda uma aula por dia, mas você pode adaptar o ritmo à sua rotina e continuar de onde parou.",
  },
  {
    question: "Posso acessar pelo celular?",
    answer:
      "Sim. A plataforma será totalmente responsiva e poderá ser utilizada pelo celular, tablet ou computador.",
  },
  {
    question: "O plano é renovado automaticamente?",
    answer:
      "Sim. Os planos são recorrentes e renovados automaticamente conforme o período escolhido.",
  },
  {
    question: "Posso cancelar minha assinatura?",
    answer:
      "Sim. O cancelamento poderá ser solicitado a qualquer momento. O acesso permanece ativo até o fim do período já pago.",
  },
  {
    question: "Já comprei o curso anteriormente. Preciso pagar novamente?",
    answer:
      "Os alunos de versões anteriores poderão ter condições específicas de migração, que serão analisadas separadamente.",
  },
];

export default async function PlansPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-700 font-black text-white">
              MP
            </div>

            <div>
              <p className="font-black leading-none text-zinc-950">
                Márcio Polonês
              </p>

              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-red-700">
                Polonês 3.0
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-black text-zinc-700 transition hover:bg-zinc-100 hover:text-red-700 sm:inline-flex"
            >
              Entrar
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-black text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">Voltar ao início</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#C8101E] px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-28">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full border-[90px] border-white/5" />
        <div className="absolute -bottom-48 -right-36 h-[560px] w-[560px] rounded-full border-[110px] border-white/5" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black backdrop-blur-sm">
            <Sparkles size={17} />
            Escolha o melhor plano para sua jornada
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Aprenda polonês durante todo o ano.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Tenha acesso a uma jornada estruturada com 365 aulas, progresso
            individual e uma recomendação clara do que estudar todos os dias.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold text-white/80">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={18} />
              Acesso imediato
            </span>

            <span className="inline-flex items-center gap-2">
              <LockKeyhole size={18} />
              Ambiente protegido
            </span>

            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={18} />
              Cancelamento simples
            </span>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-stretch gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;

              const planHref = user
                ? `/checkout?plano=${plan.id}`
                : `/cadastro?plano=${plan.id}`;

              return (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-[32px] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                    plan.highlighted
                      ? "border-red-700 bg-zinc-950 text-white shadow-xl shadow-red-950/10 lg:-translate-y-5 lg:hover:-translate-y-6"
                      : "border-zinc-200 bg-white text-zinc-950"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-red-700 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-lg">
                      {plan.badge}
                    </div>
                  )}

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      plan.highlighted
                        ? "bg-red-700 text-white"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <Icon size={25} />
                  </div>

                  <h2 className="mt-6 text-2xl font-black">{plan.name}</h2>

                  <p
                    className={`mt-3 min-h-20 leading-7 ${
                      plan.highlighted
                        ? "text-zinc-200"
                        : "text-zinc-600"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div className="mt-7">
                    <div className="flex items-end gap-2">
                      <span
                        className={`pb-1 text-lg font-black ${
                          plan.highlighted
                            ? "text-white"
                            : "text-zinc-500"
                        }`}
                      >
                        R$
                      </span>

                      <span className="text-5xl font-black tracking-[-0.06em]">
                        {plan.price}
                      </span>
                    </div>

                    <p
                      className={`mt-2 text-sm font-bold ${
                        plan.highlighted
                          ? "text-zinc-200"
                          : "text-zinc-500"
                      }`}
                    >
                      {plan.priceDescription}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        plan.highlighted
                          ? "text-zinc-300"
                          : "text-zinc-400"
                      }`}
                    >
                      {plan.totalDescription}
                    </p>
                  </div>

                  <div
                    className={`my-7 h-px ${
                      plan.highlighted ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  />

                  <ul className="flex-1 space-y-4">
                    {plan.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className={`flex items-start gap-3 text-sm font-semibold leading-6 ${
                          plan.highlighted
                            ? "text-white"
                            : "text-zinc-700"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            plan.highlighted
                              ? "bg-red-700 text-white"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <Check size={13} strokeWidth={3} />
                        </span>

                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={planHref}
                    className={`mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl px-5 text-center font-black transition ${
                      plan.highlighted
                        ? "bg-red-700 text-white shadow-xl shadow-red-900/40 hover:scale-[1.02] hover:bg-red-600"
                        : plan.id === "mensal"
                          ? "border-2 border-red-700 bg-white text-red-700 hover:bg-red-50"
                          : "bg-red-700 text-white shadow-lg shadow-red-700/20 hover:bg-red-600"
                    }`}
                  >
                    Escolher {plan.name.toLowerCase()}
                    <ArrowRight size={19} />
                  </Link>
                </article>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm leading-6 text-zinc-500">
            Ao assinar, você concorda com os{" "}
            <Link
              href="/termos"
              className="font-bold text-red-700 hover:underline"
            >
              Termos de Uso
            </Link>{" "}
            e com a{" "}
            <Link
              href="/privacidade"
              className="font-bold text-red-700 hover:underline"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">
              Incluso em todos os planos
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Tudo o que você precisa para manter uma rotina de estudos.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {platformBenefits.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-xl font-black">{title}</h3>

                <p className="mt-3 leading-7 text-zinc-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">
              Perguntas frequentes
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Antes de começar sua jornada.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-zinc-600">
              Confira as principais informações sobre acesso, assinatura,
              renovação e utilização da plataforma.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map(({ question, answer }) => (
              <details
                key={question}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm open:border-red-200"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-black text-zinc-950">
                  {question}

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xl text-zinc-500 transition group-open:rotate-45 group-open:bg-red-50 group-open:text-red-700">
                    +
                  </span>
                </summary>

                <p className="mt-4 max-w-2xl pr-10 leading-7 text-zinc-600">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-zinc-950 px-6 py-12 text-center text-white sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-700">
            <Sparkles size={25} />
          </div>

          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Seu próximo passo no polonês pode começar hoje.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/65">
            Escolha seu plano, crie sua conta e comece uma jornada organizada
            para aprender polonês um dia de cada vez.
          </p>

          <Link
            href={user ? "/checkout?plano=anual" : "/cadastro?plano=anual"}
            className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-7 font-black text-white transition hover:bg-red-600"
          >
            Começar com o plano anual
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center text-sm text-zinc-500 sm:flex-row sm:text-left">
          <p>© 2026 Márcio Polonês. Todos os direitos reservados.</p>

          <div className="flex items-center gap-5">
            <Link href="/termos" className="transition hover:text-red-700">
              Termos
            </Link>

            <Link href="/privacidade" className="transition hover:text-red-700">
              Privacidade
            </Link>

            <Link href="/login" className="transition hover:text-red-700">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}