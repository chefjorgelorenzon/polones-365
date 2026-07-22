"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const benefits = [
  {
    icon: CalendarCheck2,
    title: "Sua aula recomendada",
    description:
      "Acesse rapidamente o conteúdo indicado para o seu dia.",
  },
  {
    icon: CheckCircle2,
    title: "Seu progresso salvo",
    description:
      "Continue exatamente de onde parou na última vez.",
  },
  {
    icon: ShieldCheck,
    title: "Ambiente protegido",
    description:
      "Seus dados e sua jornada ficam seguros em sua conta.",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    if (!password) {
      setErrorMessage("Informe sua senha.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (error) {
        const errorText = error.message.toLowerCase();

        if (
          errorText.includes("invalid login credentials") ||
          errorText.includes("invalid credentials")
        ) {
          setErrorMessage("E-mail ou senha incorretos.");
          return;
        }

        if (errorText.includes("email not confirmed")) {
          setErrorMessage(
            "Confirme seu e-mail antes de entrar."
          );
          return;
        }

        setErrorMessage(
          "Não foi possível entrar. Verifique seus dados e tente novamente."
        );
        return;
      }

      if (!data.user) {
        setErrorMessage(
          "Não foi possível acessar sua conta."
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage(
        "Ocorreu um erro inesperado. Aguarde alguns segundos e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-lg">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-700 font-black text-white">
              MP
            </div>

            <div>
              <p className="text-lg font-black leading-none text-zinc-950">
                Márcio Polonês
              </p>

              <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-red-700">
                Polonês 3.0
              </p>
            </div>
          </Link>

          <div className="mt-10">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">
              Bem-vindo de volta
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-zinc-950 sm:text-5xl">
              Continue sua jornada no polonês.
            </h1>

            <p className="mt-5 leading-7 text-zinc-600">
              Entre na sua conta para acessar sua aula
              recomendada, acompanhar seu progresso e
              continuar de onde parou.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
              >
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <span>{errorMessage}</span>
              </div>
            )}

            <Field
              label="E-mail"
              icon={<Mail size={19} />}
            >
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="voce@email.com"
                autoComplete="email"
                inputMode="email"
                disabled={loading}
                required
                autoFocus
                className="h-14 min-w-0 flex-1 bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
              />
            </Field>

            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-black text-zinc-800">
                  Senha
                </span>

                <Link
                  href="/recuperar-senha"
                  className="text-sm font-bold text-red-700 transition hover:text-red-800 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <div className="flex items-center rounded-2xl border border-zinc-300 bg-white transition focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-100">
                <span className="ml-4 mr-3 shrink-0 text-zinc-400">
                  <KeyRound size={19} />
                </span>

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="h-14 min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  disabled={loading}
                  className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={
                    showPassword
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#D71920] px-6 font-black text-white shadow-lg shadow-red-700/20 transition hover:-translate-y-0.5 hover:bg-[#B91319] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />

                  Entrando...
                </>
              ) : (
                <>
                  Entrar na plataforma
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-zinc-600">
              Ainda não possui uma conta?{" "}
              <Link
                href="/cadastro"
                className="font-black text-red-700 transition hover:text-red-800 hover:underline"
              >
                Criar minha conta
              </Link>
            </p>
          </form>
        </div>
      </section>

      <section className="relative hidden overflow-hidden bg-[#C8101E] lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute -left-44 -top-44 h-[500px] w-[500px] rounded-full border-[100px] border-white/5" />

          <div className="absolute -bottom-48 -right-36 h-[600px] w-[600px] rounded-full border-[120px] border-white/5" />
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-12 py-16">
          <div className="grid w-full max-w-4xl items-center gap-12 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute -inset-8 rounded-full bg-white/15 blur-3xl" />

              <Image
                src="/capa-polones-3.jpg"
                alt="Curso Polonês 3.0"
                width={1024}
                height={1536}
                priority
                className="relative rounded-[28px] border border-white/20 shadow-2xl"
              />
            </div>

            <div className="text-white">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/65">
                Continue evoluindo
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.04em]">
                Seu próximo passo já está esperando por você.
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/75">
                Retome sua rotina de estudos e avance um
                pouco mais no idioma todos os dias.
              </p>

              <div className="mt-9 space-y-5">
                {benefits.map(
                  ({
                    icon: Icon,
                    title,
                    description,
                  }) => (
                    <div
                      key={title}
                      className="flex gap-4"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-red-700">
                        <Icon size={22} />
                      </div>

                      <div>
                        <p className="font-black">
                          {title}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-white/65">
                          {description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  icon: ReactNode;
  children: ReactNode;
};

function Field({
  label,
  icon,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-zinc-800">
        {label}
      </span>

      <div className="flex items-center rounded-2xl border border-zinc-300 bg-white transition focus-within:border-red-600 focus-within:ring-4 focus-within:ring-red-100">
        <span className="ml-4 mr-3 shrink-0 text-zinc-400">
          {icon}
        </span>

        {children}
      </div>
    </label>
  );
}