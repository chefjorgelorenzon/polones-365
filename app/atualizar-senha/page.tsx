"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [hasRecoverySession, setHasRecoverySession] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setHasRecoverySession(true);
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" ||
          session
        ) {
          setHasRecoverySession(true);
          setCheckingSession(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage(
        "A nova senha precisa ter pelo menos 8 caracteres."
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("As senhas não são iguais.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        setErrorMessage(
          "Não foi possível atualizar sua senha. Solicite um novo link de recuperação."
        );
        return;
      }

      setSuccessMessage(
        "Sua senha foi atualizada com sucesso."
      );

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch {
      setErrorMessage(
        "Ocorreu um erro inesperado. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-5 font-bold text-zinc-700 shadow-lg shadow-zinc-950/5">
          <LoaderCircle
            size={22}
            className="animate-spin text-red-700"
          />

          Verificando seu link...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 sm:p-10">
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

        {!hasRecoverySession ? (
          <div className="mt-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <AlertCircle size={26} />
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-[-0.04em] text-zinc-950">
              Link inválido ou expirado
            </h1>

            <p className="mt-4 leading-7 text-zinc-600">
              Este link de recuperação não é mais válido.
              Solicite um novo link para continuar.
            </p>

            <Link
              href="/recuperar-senha"
              className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#D71920] px-6 font-black text-white transition hover:bg-[#B91319]"
            >
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">
                Proteja sua conta
              </p>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-zinc-950">
                Crie uma nova senha.
              </h1>

              <p className="mt-4 leading-7 text-zinc-600">
                Escolha uma senha segura com pelo menos
                oito caracteres.
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

              {successMessage && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{successMessage}</span>
                </div>
              )}

              <Field
                label="Nova senha"
                icon={<KeyRound size={19} />}
              >
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading || Boolean(successMessage)}
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
                  className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
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
              </Field>

              <Field
                label="Confirme a nova senha"
                icon={<LockKeyhole size={19} />}
              >
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(
                      event.target.value
                    )
                  }
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  disabled={loading || Boolean(successMessage)}
                  className="h-14 min-w-0 flex-1 bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
                />
              </Field>

              <button
                type="submit"
                disabled={loading || Boolean(successMessage)}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#D71920] px-6 font-black text-white shadow-lg shadow-red-700/20 transition hover:-translate-y-0.5 hover:bg-[#B91319] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={20}
                      className="animate-spin"
                    />

                    Atualizando senha...
                  </>
                ) : successMessage ? (
                  <>
                    <CheckCircle2 size={20} />
                    Senha atualizada
                  </>
                ) : (
                  <>
                    Atualizar minha senha
                    <LockKeyhole size={19} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
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