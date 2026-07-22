"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type PlanId = "mensal" | "trimestral" | "anual";

type RegisterFormProps = {
  selectedPlan: PlanId | null;
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(
      2,
      6
    )}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(
    2,
    7
  )}-${digits.slice(7)}`;
}

export default function RegisterForm({
  selectedPlan,
}: RegisterFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedName = fullName
      .trim()
      .replace(/\s+/g, " ");

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const normalizedPhone = phone.replace(/\D/g, "");

    const nameParts = normalizedName
      .split(" ")
      .filter(Boolean);

    if (
      normalizedName.length < 3 ||
      nameParts.length < 2
    ) {
      setErrorMessage("Informe seu nome completo.");
      return;
    }

    if (!normalizedEmail) {
      setErrorMessage("Informe um e-mail válido.");
      return;
    }

    if (
      normalizedPhone.length < 10 ||
      normalizedPhone.length > 11
    ) {
      setErrorMessage(
        "Informe um WhatsApp válido com DDD."
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "A senha precisa ter pelo menos 8 caracteres."
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

      const { data, error } =
        await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: normalizedName,
              phone: normalizedPhone,
              selected_plan: selectedPlan,
            },
          },
        });

      if (error) {
        const errorText = error.message.toLowerCase();

        if (
          errorText.includes("already registered") ||
          errorText.includes("already exists") ||
          errorText.includes("user already registered")
        ) {
          setErrorMessage(
            "Já existe uma conta cadastrada com este e-mail."
          );
          return;
        }

        setErrorMessage(
          "Não foi possível criar sua conta. Verifique os dados e tente novamente."
        );
        return;
      }

      if (!data.user) {
        setErrorMessage(
          "Não foi possível concluir o cadastro."
        );
        return;
      }

      if (selectedPlan) {
        router.push(
          `/onboarding?plano=${selectedPlan}`
        );
      } else {
        router.push("/onboarding");
      }

      router.refresh();
    } catch {
      setErrorMessage(
        "Ocorreu um erro inesperado. Aguarde alguns segundos e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(formatPhone(value));
  }

  return (
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
        label="Nome completo"
        icon={<UserRound size={19} />}
      >
        <input
          type="text"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
          placeholder="Como podemos chamar você?"
          autoComplete="name"
          disabled={loading}
          required
          className="h-14 w-full bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
        />
      </Field>

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
          className="h-14 w-full bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
        />
      </Field>

      <Field
        label="WhatsApp"
        icon={<Phone size={19} />}
      >
        <input
          type="tel"
          value={phone}
          onChange={(event) =>
            handlePhoneChange(event.target.value)
          }
          placeholder="(54) 99999-9999"
          autoComplete="tel"
          inputMode="tel"
          disabled={loading}
          required
          className="h-14 w-full bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
        />
      </Field>

      <Field
        label="Senha"
        icon={<KeyRound size={19} />}
      >
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Mínimo de 8 caracteres"
          autoComplete="new-password"
          disabled={loading}
          minLength={8}
          required
          className="h-14 min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((current) => !current)
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
      </Field>

      <Field
        label="Confirme sua senha"
        icon={<KeyRound size={19} />}
      >
        <input
          type={showPassword ? "text" : "password"}
          value={passwordConfirmation}
          onChange={(event) =>
            setPasswordConfirmation(
              event.target.value
            )
          }
          placeholder="Digite a senha novamente"
          autoComplete="new-password"
          disabled={loading}
          minLength={8}
          required
          className="h-14 w-full bg-transparent pr-4 text-sm font-semibold text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-400"
        />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-6 text-zinc-600">
        <input
          type="checkbox"
          required
          disabled={loading}
          className="mt-1 h-4 w-4 rounded border-zinc-300 accent-red-700"
        />

        <span>
          Concordo com os{" "}
          <Link
            href="/termos"
            className="font-bold text-red-700 hover:underline"
          >
            Termos de Uso
          </Link>{" "}
          e a{" "}
          <Link
            href="/privacidade"
            className="font-bold text-red-700 hover:underline"
          >
            Política de Privacidade
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#D71920] px-6 font-black text-white shadow-lg shadow-red-700/20 transition hover:bg-[#B91319] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle
              size={20}
              className="animate-spin"
            />

            Criando sua conta...
          </>
        ) : (
          <>
            Criar minha conta
            <ArrowRight size={20} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Já possui uma conta?{" "}
        <Link
          href="/login"
          className="font-black text-red-700 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
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