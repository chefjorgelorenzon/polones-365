import {
  BarChart3,
  CircleCheckBig,
  PlayCircle,
  Unlock,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Unlock,
    title: "Acesse sua jornada",
    description:
      "Entre na plataforma e veja imediatamente qual é a aula recomendada para o seu dia.",
  },
  {
    number: "02",
    icon: PlayCircle,
    title: "Assista e pratique",
    description:
      "Aprenda com aulas curtas, progressivas e organizadas para facilitar sua evolução.",
  },
  {
    number: "03",
    icon: CircleCheckBig,
    title: "Conclua a aula",
    description:
      "Marque o conteúdo como concluído e mantenha uma sequência diária de estudos.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Acompanhe seu progresso",
    description:
      "Veja suas aulas concluídas, sua sequência de estudos e o quanto já avançou.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden bg-[#F7F7F8] px-5 py-24 sm:px-6 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-0 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-zinc-200/60 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-red-700">
            Como funciona
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-zinc-950 sm:text-5xl">
            Todos os dias você sabe exatamente o que estudar.
          </h2>

          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Nada de entrar em uma plataforma cheia de vídeos e ficar sem saber
            por onde começar. O Polonês 3.0 conduz sua evolução passo a passo.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-zinc-300 xl:block"
            aria-hidden="true"
          />

          <div className="relative grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map(
              ({ number, icon: Icon, title, description }) => (
                <article
                  key={number}
                  className="group relative rounded-[28px] border border-zinc-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 ring-8 ring-[#F7F7F8] transition duration-300 group-hover:bg-red-700 group-hover:text-white">
                      <Icon size={24} />
                    </div>

                    <span className="text-sm font-black tracking-[0.15em] text-zinc-300">
                      {number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-black text-zinc-950">
                    {title}
                  </h3>

                  <p className="mt-4 leading-7 text-zinc-600">
                    {description}
                  </p>
                </article>
              )
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-zinc-500">
            Uma rotina simples, clara e possível de manter todos os dias.
          </p>
        </div>
      </div>
    </section>
  );
}