import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crown,
  FileQuestion,
  GraduationCap,
  Trophy,
} from "lucide-react";

const benefits = [
  {
    icon: BookOpen,
    label: "365 aulas progressivas",
  },
  {
    icon: FileQuestion,
    label: "Exercícios e quizzes",
  },
  {
    icon: Trophy,
    label: "Conquistas e progresso",
  },
  {
    icon: GraduationCap,
    label: "Certificado de conclusão",
  },
];

export default function PremiumBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-7 text-white shadow-xl sm:px-8 sm:py-9">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid gap-8 xl:grid-cols-[1fr_auto] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
            <Crown size={15} />
            Curso completo
          </div>

          <h2 className="mt-5 max-w-2xl text-2xl font-black tracking-[-0.04em] sm:text-3xl">
            Sua conta está pronta. Agora libere sua jornada no polonês.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            Ative sua assinatura para acessar o curso completo,
            acompanhar seu progresso e estudar uma nova aula todos
            os dias.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {benefits.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-sm font-semibold text-white/85"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} />
                </span>

                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="xl:min-w-64">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-bold">
              <CheckCircle2
                size={18}
                className="text-green-400"
              />
              Acesso imediato
            </div>

            <p className="mt-3 text-sm leading-6 text-white/65">
              Após a confirmação do pagamento, todo o conteúdo será
              liberado automaticamente.
            </p>

            <Link
              href="/planos"
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
            >
              Ativar assinatura
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}