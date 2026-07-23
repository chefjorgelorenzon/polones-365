"use client";

import { useActionState, useEffect, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  CircleAlert,
  Clock3,
  LoaderCircle,
  Save,
  UserRound,
} from "lucide-react";

import {
  type ProfileActionState,
  updateProfileAction,
} from "./actions";

type ProfileFormProps = {
  profile: {
    full_name: string | null;
    phone: string | null;
    role: string;
    study_goal: string | null;
    current_level: string | null;
    daily_goal_minutes: number | null;
    current_lesson_number: number | null;
  };
};

const initialState: ProfileActionState = {
  success: false,
  message: "",
};

const studyGoals = [
  {
    value: "Conversação",
    label: "Conversação",
  },
  {
    value: "Viagem",
    label: "Viagem para a Polônia",
  },
  {
    value: "Trabalho",
    label: "Trabalho e carreira",
  },
  {
    value: "Cidadania",
    label: "Cidadania polonesa",
  },
  {
    value: "Família",
    label: "Comunicação com familiares",
  },
  {
    value: "Cultura",
    label: "Cultura e interesse pessoal",
  },
];

const levels = [
  {
    value: "Iniciante",
    label: "Iniciante",
  },
  {
    value: "Básico",
    label: "Básico",
  },
  {
    value: "Intermediário",
    label: "Intermediário",
  },
  {
    value: "Avançado",
    label: "Avançado",
  },
];

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const [messageVisible, setMessageVisible] = useState(false);

  useEffect(() => {
    if (!state.message) return;

    setMessageVisible(true);

    const timeout = window.setTimeout(() => {
      setMessageVisible(false);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      {messageVisible && state.message && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold ${
            state.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
          ) : (
            <CircleAlert className="mt-0.5 shrink-0" size={20} />
          )}

          <p>{state.message}</p>
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <UserRound size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-zinc-950">
                Informações pessoais
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Dados usados na sua conta e no suporte.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <InputField
              id="full_name"
              name="full_name"
              label="Nome completo"
              defaultValue={profile.full_name ?? ""}
              placeholder="Digite seu nome completo"
              autoComplete="name"
              required
            />

            <InputField
              id="phone"
              name="phone"
              label="WhatsApp"
              defaultValue={profile.phone ?? ""}
              placeholder="(54) 99999-9999"
              autoComplete="tel"
              inputMode="tel"
            />

            <ReadOnlyField
              label="Tipo de conta"
              value={formatRole(profile.role)}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <BookOpenCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-black text-zinc-950">
                Preferências de aprendizado
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Personalize sua rotina de estudos.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <SelectField
              id="study_goal"
              name="study_goal"
              label="Principal objetivo"
              defaultValue={profile.study_goal ?? ""}
              placeholder="Selecione seu objetivo"
              options={studyGoals}
            />

            <SelectField
              id="current_level"
              name="current_level"
              label="Nível atual"
              defaultValue={profile.current_level ?? ""}
              placeholder="Selecione seu nível"
              options={levels}
            />

            <div>
              <label
                htmlFor="daily_goal_minutes"
                className="text-sm font-black text-zinc-800"
              >
                Meta diária
              </label>

              <div className="relative mt-2">
                <Clock3
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  id="daily_goal_minutes"
                  name="daily_goal_minutes"
                  type="number"
                  min={5}
                  max={180}
                  step={5}
                  defaultValue={profile.daily_goal_minutes ?? 20}
                  className="h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-11 pr-24 text-sm font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-100"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
                  minutos
                </span>
              </div>

              <p className="mt-2 text-xs text-zinc-500">
                Escolha uma meta entre 5 e 180 minutos por dia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
              Progresso atual
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                <BookOpenCheck size={21} />
              </div>

              <div>
                <p className="text-sm text-zinc-500">Aula atual</p>

                <p className="text-xl font-black text-zinc-950">
                  Aula {profile.current_lesson_number ?? 1}
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-700/20 transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={19} />
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </section>
    </form>
  );
}

type InputFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  required?: boolean;
};

function InputField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
  autoComplete,
  inputMode,
  required,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-black text-zinc-800">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-100"
      />
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  options: Array<{
    value: string;
    label: string;
  }>;
};

function SelectField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-black text-zinc-800">
        {label}
      </label>

      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold text-zinc-950 outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-100"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm font-black text-zinc-800">{label}</p>

      <div className="mt-2 flex h-12 items-center rounded-2xl border border-zinc-200 bg-zinc-100 px-4">
        <p className="text-sm font-semibold text-zinc-500">{value}</p>
      </div>

      <p className="mt-2 text-xs text-zinc-500">
        Essa informação não pode ser alterada pelo aluno.
      </p>
    </div>
  );
}

function formatRole(role: string) {
  const roles: Record<string, string> = {
    student: "Aluno",
    aluno: "Aluno",
    admin: "Administrador",
    teacher: "Professor",
    professor: "Professor",
  };

  return roles[role.toLowerCase()] ?? role;
}