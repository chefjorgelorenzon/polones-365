"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Message = {
  type: "success" | "error";
  text: string;
};

export default function ChangePasswordForm() {
  const supabase = useMemo(() => createClient(), []);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const passwordChecks = {
    minimumLength: newPassword.length >= 8,
    hasLetter: /[a-zA-Z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
  };

  const isNewPasswordValid =
    passwordChecks.minimumLength &&
    passwordChecks.hasLetter &&
    passwordChecks.hasNumber;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    setMessage(null);

    if (!currentPassword) {
      setMessage({
        type: "error",
        text: "Informe sua senha atual.",
      });
      return;
    }

    if (!newPassword) {
      setMessage({
        type: "error",
        text: "Informe a nova senha.",
      });
      return;
    }

    if (!isNewPasswordValid) {
      setMessage({
        type: "error",
        text: "A nova senha deve ter pelo menos 8 caracteres, uma letra e um número.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "A confirmação da nova senha não confere.",
      });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: "error",
        text: "A nova senha deve ser diferente da senha atual.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error(
          "Não foi possível identificar o usuário autenticado.",
        );
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (signInError) {
        setMessage({
          type: "error",
          text: "A senha atual está incorreta.",
        });
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw updateError;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage({
        type: "success",
        text: "Senha alterada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);

      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <ShieldCheck size={24} />
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-red-700">
            Segurança
          </p>

          <h2 className="mt-2 text-xl font-black text-zinc-950">
            Alterar senha
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Confirme sua senha atual e escolha uma nova senha para
            proteger sua conta.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-5"
      >
        <PasswordField
          id="current-password"
          label="Senha atual"
          value={currentPassword}
          placeholder="Digite sua senha atual"
          showPassword={showCurrentPassword}
          onChange={setCurrentPassword}
          onToggleVisibility={() =>
            setShowCurrentPassword((current) => !current)
          }
          autoComplete="current-password"
          disabled={isSubmitting}
        />

        <PasswordField
          id="new-password"
          label="Nova senha"
          value={newPassword}
          placeholder="Digite sua nova senha"
          showPassword={showNewPassword}
          onChange={setNewPassword}
          onToggleVisibility={() =>
            setShowNewPassword((current) => !current)
          }
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <PasswordField
          id="confirm-password"
          label="Confirmar nova senha"
          value={confirmPassword}
          placeholder="Digite novamente a nova senha"
          showPassword={showConfirmPassword}
          onChange={setConfirmPassword}
          onToggleVisibility={() =>
            setShowConfirmPassword((current) => !current)
          }
          autoComplete="new-password"
          disabled={isSubmitting}
        />

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center gap-2">
            <LockKeyhole
              size={18}
              className="text-zinc-500"
            />

            <p className="text-sm font-black text-zinc-800">
              Sua nova senha deve conter:
            </p>
          </div>

          <div className="mt-3 space-y-2">
            <PasswordRequirement
              valid={passwordChecks.minimumLength}
              text="No mínimo 8 caracteres"
            />

            <PasswordRequirement
              valid={passwordChecks.hasLetter}
              text="Pelo menos uma letra"
            />

            <PasswordRequirement
              valid={passwordChecks.hasNumber}
              text="Pelo menos um número"
            />
          </div>
        </div>

        {message && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <CircleAlert
                size={19}
                className="mt-0.5 shrink-0"
              />
            )}

            <p>{message.text}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-700 px-6 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
                Alterando...
              </>
            ) : (
              <>
                <KeyRound size={18} />
                Alterar senha
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  showPassword: boolean;
  autoComplete: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
};

function PasswordField({
  id,
  label,
  value,
  placeholder,
  showPassword,
  autoComplete,
  disabled,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-black text-zinc-800"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pr-12 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          aria-label={
            showPassword ? "Ocultar senha" : "Mostrar senha"
          }
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-zinc-400 transition hover:text-zinc-700 disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>
      </div>
    </div>
  );
}

type PasswordRequirementProps = {
  valid: boolean;
  text: string;
};

function PasswordRequirement({
  valid,
  text,
}: PasswordRequirementProps) {
  return (
    <div
      className={`flex items-center gap-2 text-xs font-bold ${
        valid ? "text-emerald-700" : "text-zinc-500"
      }`}
    >
      <CheckCircle2 size={16} />
      <span>{text}</span>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const message = error.message.toLowerCase();

    if (message.includes("same password")) {
      return "A nova senha deve ser diferente da senha atual.";
    }

    if (message.includes("password should be at least")) {
      return "A nova senha não atende aos requisitos mínimos.";
    }

    if (message.includes("new password should be different")) {
      return "A nova senha deve ser diferente da senha atual.";
    }

    return error.message;
  }

  return "Não foi possível alterar a senha. Tente novamente.";
}