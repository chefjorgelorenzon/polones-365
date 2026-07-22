"use client";

import { LoaderCircle, LockKeyhole } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function ConfirmSubscriptionButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="
        flex w-full items-center justify-center gap-3
        rounded-2xl bg-red-600 px-6 py-4
        text-base font-bold text-white
        transition hover:bg-red-700
        disabled:cursor-not-allowed
        disabled:opacity-70
      "
    >
      {pending ? (
        <>
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Preparando checkout...
        </>
      ) : (
        <>
          <LockKeyhole className="h-5 w-5" />
          Finalizar assinatura
        </>
      )}
    </button>
  );
}