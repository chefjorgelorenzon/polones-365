import { Lightbulb } from "lucide-react";

type PolandTip = {
  title: string;
  description: string;
};

const POLAND_TIPS: PolandTip[] = [
  {
    title: "Como os poloneses se cumprimentam?",
    description:
      "Em situações formais, é comum usar “Dzień dobry”. Entre amigos, “Cześć” é uma forma mais descontraída.",
  },
  {
    title: "A Polônia possui 16 províncias",
    description:
      "As divisões administrativas do país são chamadas de voivodias. Cada uma possui características culturais próprias.",
  },
  {
    title: "O pierogi é um dos pratos mais famosos",
    description:
      "Pierogi são massas recheadas que podem levar batata, queijo, carne, repolho, cogumelos ou recheios doces.",
  },
  {
    title: "Varsóvia é a capital da Polônia",
    description:
      "A cidade foi quase totalmente destruída durante a Segunda Guerra Mundial e reconstruída nas décadas seguintes.",
  },
  {
    title: "Cracóvia foi a antiga capital",
    description:
      "Cracóvia é uma das cidades mais antigas do país e possui um dos centros históricos mais importantes da Europa.",
  },
  {
    title: "A moeda polonesa é o złoty",
    description:
      "Mesmo fazendo parte da União Europeia, a Polônia ainda utiliza sua própria moeda, chamada złoty.",
  },
  {
    title: "O nome Polska significa Polônia",
    description:
      "Em polonês, o país é chamado de Polska. O idioma oficial é o język polski.",
  },
  {
    title: "O polonês possui sete casos gramaticais",
    description:
      "As terminações das palavras podem mudar conforme a função que exercem dentro de uma frase.",
  },
  {
    title: "Os nomes possuem formas diminutivas",
    description:
      "É comum usar formas carinhosas dos nomes, como Kuba para Jakub e Kasia para Katarzyna.",
  },
  {
    title: "O Natal é uma celebração muito tradicional",
    description:
      "Na ceia de Natal polonesa, chamada Wigilia, tradicionalmente são servidos doze pratos.",
  },
];

function getDayOfYear(): number {
  const now = new Date();

  const currentDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  );

  const startOfYear = new Date(
    Date.UTC(now.getUTCFullYear(), 0, 0)
  );

  const difference =
    currentDate.getTime() - startOfYear.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );
}

function getPolandTip(): PolandTip {
  const dayOfYear = getDayOfYear();

  return POLAND_TIPS[dayOfYear % POLAND_TIPS.length];
}

export default function PolandTipCard() {
  const tip = getPolandTip();

  return (
    <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
        <Lightbulb size={21} />
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-blue-700">
        Curiosidade sobre a Polônia
      </p>

      <h3 className="mt-3 text-2xl font-black tracking-tight text-zinc-950">
        {tip.title}
      </h3>

      <p className="mt-3 leading-7 text-zinc-500">
        {tip.description}
      </p>
    </article>
  );
}