import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/services/profile.service";

export default async function PerfilPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
          Minha conta
        </p>

        <h1 className="mt-2 text-4xl font-black text-zinc-950">
          Meu perfil
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-600">
          Gerencie suas informações pessoais e preferências de estudo.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">
            Informações pessoais
          </h2>

          <div className="mt-6 space-y-5">
            <Field
              label="Nome completo"
              value={profile.full_name ?? "-"}
            />

            <Field
              label="WhatsApp"
              value={profile.phone ?? "-"}
            />

            <Field
              label="Função"
              value={profile.role}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-zinc-950">
            Aprendizado
          </h2>

          <div className="mt-6 space-y-5">
            <Field
              label="Objetivo"
              value={profile.study_goal ?? "Não informado"}
            />

            <Field
              label="Nível"
              value={profile.current_level ?? "Não informado"}
            />

            <Field
              label="Meta diária"
              value={
                profile.daily_goal_minutes
                  ? `${profile.daily_goal_minutes} minutos`
                  : "Não definida"
              }
            />

            <Field
              label="Aula atual"
              value={String(profile.current_lesson_number)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-zinc-900">
        {value}
      </p>
    </div>
  );
}