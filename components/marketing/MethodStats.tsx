import {
  CalendarCheck2,
  GraduationCap,
  Infinity,
  MonitorSmartphone,
} from "lucide-react";

const stats = [
  {
    icon: CalendarCheck2,
    value: "365",
    label: "aulas em sequência",
  },
  {
    icon: GraduationCap,
    value: "1 ano",
    label: "de evolução guiada",
  },
  {
    icon: Infinity,
    value: "24h",
    label: "de acesso à plataforma",
  },
  {
    icon: MonitorSmartphone,
    value: "100%",
    label: "online e responsivo",
  },
];

export default function MethodStats() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 px-5 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map(({ icon: Icon, value, label }, index) => (
          <article
            key={label}
            className={`group flex items-center gap-3 rounded-2xl px-2 py-4 transition sm:px-5 ${
              index > 0 ? "lg:border-l lg:border-zinc-200" : ""
            }`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700 transition duration-300 group-hover:bg-red-700 group-hover:text-white">
              <Icon size={22} />
            </div>

            <div>
              <p className="text-xl font-black tracking-tight text-zinc-950 sm:text-2xl">
                {value}
              </p>

              <p className="mt-0.5 text-xs font-semibold leading-5 text-zinc-500 sm:text-sm">
                {label}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}