import { BookOpen, Headphones } from "lucide-react";

type WordOfDay = {
  polish: string;
  portuguese: string;
  pronunciation?: string;
};

const WORDS: WordOfDay[] = [
  {
    polish: "Dzień dobry",
    portuguese: "Bom dia",
    pronunciation: "djên dô-bri",
  },
  {
    polish: "Cześć",
    portuguese: "Olá / Tchau",
    pronunciation: "tchésh-tch",
  },
  {
    polish: "Dziękuję",
    portuguese: "Obrigado",
    pronunciation: "djen-ku-iê",
  },
  {
    polish: "Proszę",
    portuguese: "Por favor / De nada",
    pronunciation: "pró-she",
  },
  {
    polish: "Tak",
    portuguese: "Sim",
    pronunciation: "tak",
  },
  {
    polish: "Nie",
    portuguese: "Não",
    pronunciation: "niê",
  },
  {
    polish: "Do widzenia",
    portuguese: "Até logo",
    pronunciation: "dô vi-dzê-nia",
  },
  {
    polish: "Przepraszam",
    portuguese: "Desculpe",
    pronunciation: "pshe-prá-sham",
  },
  {
    polish: "Jak się masz?",
    portuguese: "Como você está?",
    pronunciation: "iak shê mash",
  },
  {
    polish: "Dobranoc",
    portuguese: "Boa noite",
    pronunciation: "dô-brá-nots",
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

function getWordOfDay(): WordOfDay {
  const dayOfYear = getDayOfYear();

  return WORDS[dayOfYear % WORDS.length];
}

export default function WordOfDayCard() {
  const word = getWordOfDay();

  return (
    <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-700">
          <BookOpen size={21} />
        </div>

        <span
          className="text-2xl"
          aria-label="Bandeira da Polônia"
        >
          🇵🇱
        </span>
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-red-700">
        Palavra do dia
      </p>

      <h3 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
        {word.polish}
      </h3>

      <p className="mt-2 text-lg font-semibold text-zinc-500">
        {word.portuguese}
      </p>

      {word.pronunciation && (
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-700">
          <Headphones size={18} />

          <span>
            Pronúncia: {word.pronunciation}
          </span>
        </div>
      )}
    </article>
  );
}