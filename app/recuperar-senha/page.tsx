"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Send,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage("Informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const redirectTo = `${window.location.origin}/atualizar-senha`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo,
          }
        );

      if (error) {
        setErrorMessage(
          "Não foi possível enviar o link de recuperação. Verifique o e-mail e tente novamente."
        );
        return;
      }

      setSuccessMessage(
        "Enviamos um link de recuperação para o seu e-mail. Verifique também a caixa de spam."
      );
    } catch {
      setErrorMessage(
        "Ocorreu um erro inesperado. Aguarde alguns segundos e tente novamente."
      );
    } finally {
      setLoading(false);
    }
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

        <div className="mt-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-red-700">
            Recuperação de acesso
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.045em] text-zinc-950">
            Esqueceu sua senha?
          </h1>

          <p className="mt-4 leading-7 text-zinc-600">
            Informe o e-mail cadastrado. Você receberá um
            link para criar uma nova senha.
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
              disabled={loading || Boolean(successMessage)}
              required
              autoFocus
              className="h-14 min-w-0 flex-1 bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </Field>

          {!successMessage && (
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

                  Enviando link...
                </>
              ) : (
                <>
                  Enviar link de recuperação
                  <Send size={19} />
                </>
              )}
            </button>
          )}

          {successMessage && (
            <button
              type="button"
              onClick={() => {
                setSuccessMessage("");
                setEmail("");
              }}
              className="flex h-14 w-full items-center justify-center rounded-2xl border border-zinc-300 bg-white px-6 font-black text-zinc-800 transition hover:bg-zinc-50"
            >
              Enviar para outro e-mail
            </button>
          )}

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm font-black text-red-700 transition hover:text-red-800 hover:underline"
          >
            <ArrowLeft size={17} />
            Voltar para o login
          </Link>
        </form>
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