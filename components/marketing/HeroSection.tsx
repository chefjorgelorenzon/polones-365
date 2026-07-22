import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

const benefits = [
  "365 aulas organizadas",
  "Uma aula recomendada por dia",
  "Do nível iniciante ao avançado",
  "Acesso pelo celular ou computador",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#C8101E]">
      {/* Elementos decorativos */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-56 top-12 h-[500px] w-[500px] rounded-full border-[100px] border-white/5" />

        <div className="absolute -right-56 bottom-0 h-[600px] w-[600px] rounded-full border-[120px] border-white/5" />

        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-red-950/20 blur-3xl" />

        <div className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-20">
        {/* Conteúdo */}
        <div className="text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
            <CalendarDays size={17} />
            Uma aula por dia durante 365 dias
          </div>

          <p className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] text-white/65 sm:text-sm">
            <Sparkles size={16} />
            Método Polonês 3.0
          </p>

          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Aprenda polonês do zero, um dia de cada vez.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
            Uma jornada prática e progressiva para desenvolver sua pronúncia,
            compreensão e confiança até conseguir se comunicar em polonês.
          </p>

          {/* Benefícios */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-red-700">
                  <Check
                    size={15}
                    strokeWidth={3}
                  />
                </span>

                <span className="font-semibold text-white/90">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* Botões */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/cadastro"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-white px-7 font-black !text-red-700 shadow-xl shadow-red-950/20 transition hover:-translate-y-0.5 hover:bg-zinc-100 hover:!text-red-800"
            >
              Começar agora
              <ArrowRight size={20} />
            </Link>

            <Link
              href="#como-funciona"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 font-bold !text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20 hover:!text-white"
            >
              <Play size={19} />
              Conhecer o método
            </Link>
          </div>

          {/* Informações de confiança */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Smartphone size={17} />
              Celular ou computador
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={17} />
              Estude no seu ritmo
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={17} />
              Acesso seguro
            </span>
          </div>
        </div>

        {/* Imagem do curso */}
        <div className="relative mx-auto w-full max-w-[470px]">
          <div
            className="pointer-events-none absolute -inset-10 rounded-full bg-white/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative rotate-1 rounded-[36px] border border-white/25 bg-white/10 p-3 shadow-2xl shadow-red-950/30 backdrop-blur-sm transition duration-500 hover:rotate-0">
            <div className="overflow-hidden rounded-[28px] bg-white">
              <Image
                src="/capa-polones-3.jpg"
                alt="Capa do curso Método Polonês 3.0"
                width={1024}
                height={1536}
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 470px, 470px"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Card da aula */}
          <div className="absolute -bottom-5 -left-4 hidden min-w-[230px] rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl sm:block lg:-left-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <Play
                  size={22}
                  fill="currentColor"
                />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-red-700">
                  Aula de hoje
                </p>

                <p className="mt-1 text-sm font-black text-zinc-900">
                  Comece sua jornada
                </p>

                <p className="mt-0.5 text-xs text-zinc-500">
                  Evolua um pouco todos os dias
                </p>
              </div>
            </div>
          </div>

          {/* Card das 365 aulas */}
          <div className="absolute -right-4 top-12 hidden rounded-2xl border border-white/30 bg-white/95 px-5 py-4 shadow-2xl sm:block lg:-right-10">
            <p className="text-2xl font-black text-red-700">
              365
            </p>

            <p className="mt-0.5 text-xs font-bold text-zinc-500">
              dias de evolução
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}