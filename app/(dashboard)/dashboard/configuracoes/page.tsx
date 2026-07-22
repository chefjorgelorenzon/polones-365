import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  Globe2,
  GraduationCap,
  Save,
  Settings2,
  Target,
  UserRound,
} from "lucide-react";

import {
  getCurrentProfile,
  updateProfileSettings,
} from "@/lib/services/profile.service";

type ConfiguracoesPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

function normalizeOptionalValue(
  value: FormDataEntryValue | null
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
}

export default async function ConfiguracoesPage({
  searchParams,
}: ConfiguracoesPageProps) {
  const profile = await getCurrentProfile();
  const params = await searchParams;

  if (!profile) {
    redirect("/login");
  }

  async function updateSettingsAction(
    formData: FormData
  ) {
    "use server";

    const studyGoal = normalizeOptionalValue(
      formData.get("study_goal")
    );

    const currentLevel = normalizeOptionalValue(
      formData.get("current_level")
    );

    const nativeLanguage = normalizeOptionalValue(
      formData.get("native_language")
    );

    const timezone = normalizeOptionalValue(
      formData.get("timezone")
    );

    const dailyGoalValue = Number(
      formData.get("daily_goal_minutes")
    );

    const dailyGoalMinutes = Number.isFinite(
      dailyGoalValue
    )
      ? dailyGoalValue
      : 15;

    try {
      await updateProfileSettings({
        study_goal: studyGoal,
        current_level: currentLevel,
        daily_goal_minutes: dailyGoalMinutes,
        native_language: nativeLanguage,
        timezone,
      });
    } catch (error) {
      console.error(
        "Erro ao salvar configurações:",
        error
      );

      redirect(
        "/dashboard/configuracoes?error=1"
      );
    }

    redirect(
      "/dashboard/configuracoes?success=1"
    );
  }

  return (
    <main className="space-y-8 pb-12">
      <header>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 transition hover:text-red-700"
        >
          <ArrowLeft size={18} />
          Voltar ao início
        </Link>

        <div className="mt-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-red-700">
            Minha conta
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Configurações
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Personalize sua rotina de estudos e ajuste
            sua experiência dentro da plataforma.
          </p>
        </div>
      </header>

      {params.success === "1" && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-black">
              Configurações salvas
            </p>

            <p className="mt-1 text-sm">
              Suas preferências foram atualizadas
              com sucesso.
            </p>
          </div>
        </div>
      )}

      {params.error === "1" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          Não foi possível salvar suas configurações.
          Tente novamente.
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-6">
          <article className="relative overflow-hidden rounded-[28px] bg-zinc-950 p-6 text-white shadow-sm sm:p-8">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-700/20 blur-3xl" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-700 text-white">
                <Settings2 size={25} />
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-red-400">
                Preferências
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Uma rotina que funciona para você
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Defina uma meta realista para manter a
                constância sem transformar os estudos em
                uma obrigação pesada.
              </p>
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <UserRound size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-500">
                  Conta conectada
                </p>

                <p className="font-black text-zinc-950">
                  {profile.full_name || "Aluno"}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-5">
              <Link
                href="/dashboard/perfil"
                className="text-sm font-black text-red-700 transition hover:text-red-800"
              >
                Editar dados pessoais
              </Link>
            </div>
          </article>
        </aside>

        <form
          action={updateSettingsAction}
          className="space-y-6"
        >
          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <Target size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-950">
                  Objetivo de aprendizagem
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Conte para a plataforma qual é sua
                  principal motivação para aprender polonês.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="study_goal"
                className="text-sm font-black text-zinc-800"
              >
                Meu objetivo
              </label>

              <select
                id="study_goal"
                name="study_goal"
                defaultValue={profile.study_goal ?? ""}
                className="mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
              >
                <option value="">
                  Selecione um objetivo
                </option>

                <option value="comunicacao">
                  Comunicar-me em polonês
                </option>

                <option value="viagem">
                  Viajar para a Polônia
                </option>

                <option value="familia">
                  Conversar com familiares
                </option>

                <option value="cidadania">
                  Preparar-me para cidadania
                </option>

                <option value="trabalho">
                  Usar o idioma profissionalmente
                </option>

                <option value="cultura">
                  Conhecer a cultura polonesa
                </option>

                <option value="outro">
                  Outro objetivo
                </option>
              </select>
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <GraduationCap size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-950">
                  Nível atual
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Escolha a opção que melhor representa seu
                  conhecimento atual.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="current_level"
                className="text-sm font-black text-zinc-800"
              >
                Meu nível de polonês
              </label>

              <select
                id="current_level"
                name="current_level"
                defaultValue={
                  profile.current_level ?? ""
                }
                className="mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
              >
                <option value="">
                  Selecione seu nível
                </option>

                <option value="iniciante">
                  Iniciante — estou começando agora
                </option>

                <option value="basico">
                  Básico — conheço algumas palavras
                </option>

                <option value="intermediario">
                  Intermediário — consigo entender frases
                </option>

                <option value="avancado">
                  Avançado — consigo conversar
                </option>
              </select>
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <Clock3 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-950">
                  Meta diária
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Defina quanto tempo deseja reservar por
                  dia para aprender polonês.
                </p>
              </div>
            </div>

            <fieldset className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[10, 15, 20, 30].map((minutes) => (
                <label
                  key={minutes}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="daily_goal_minutes"
                    value={minutes}
                    defaultChecked={
                      (profile.daily_goal_minutes ??
                        15) === minutes
                    }
                    className="peer sr-only"
                  />

                  <span className="flex min-h-24 flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-4 text-center transition peer-checked:border-red-700 peer-checked:bg-red-50 peer-checked:ring-2 peer-checked:ring-red-100">
                    <strong className="text-2xl font-black text-zinc-950 peer-checked:text-red-700">
                      {minutes}
                    </strong>

                    <span className="mt-1 text-xs font-bold text-zinc-500">
                      minutos por dia
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
                <Globe2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-950">
                  Idioma e localização
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Essas informações ajudam a personalizar
                  conteúdos e horários.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="native_language"
                  className="text-sm font-black text-zinc-800"
                >
                  Idioma nativo
                </label>

                <select
                  id="native_language"
                  name="native_language"
                  defaultValue={
                    profile.native_language ??
                    "pt-BR"
                  }
                  className="mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                >
                  <option value="pt-BR">
                    Português — Brasil
                  </option>

                  <option value="pt-PT">
                    Português — Portugal
                  </option>

                  <option value="es">
                    Espanhol
                  </option>

                  <option value="en">
                    Inglês
                  </option>

                  <option value="pl">
                    Polonês
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="text-sm font-black text-zinc-800"
                >
                  Fuso horário
                </label>

                <select
                  id="timezone"
                  name="timezone"
                  defaultValue={
                    profile.timezone ??
                    "America/Sao_Paulo"
                  }
                  className="mt-2 h-14 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
                >
                  <option value="America/Sao_Paulo">
                    Brasília
                  </option>

                  <option value="America/Manaus">
                    Manaus
                  </option>

                  <option value="America/Rio_Branco">
                    Rio Branco
                  </option>

                  <option value="Europe/Warsaw">
                    Varsóvia
                  </option>

                  <option value="Europe/Lisbon">
                    Lisboa
                  </option>

                  <option value="Europe/London">
                    Londres
                  </option>
                </select>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
                <Bell size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-950">
                  Lembretes de estudo
                </h2>

                <p className="mt-1 text-sm leading-6 text-zinc-500">
                  Os lembretes por WhatsApp e e-mail serão
                  disponibilizados em uma próxima etapa da
                  plataforma.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5">
              <p className="text-sm font-black text-zinc-700">
                Em breve
              </p>

              <p className="mt-1 text-sm leading-6 text-zinc-500">
                Você poderá escolher o horário e o canal
                usado para receber sua aula recomendada.
              </p>
            </div>
          </article>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard"
              className="flex h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 text-sm font-black !text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-red-700 px-7 text-sm font-black text-white transition hover:bg-red-800"
            >
              <Save size={18} />
              Salvar configurações
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}